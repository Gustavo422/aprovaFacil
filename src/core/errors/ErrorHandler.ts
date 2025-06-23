import { AppError as IAppError, ErrorHandler as IErrorHandler, ErrorNotifier, ErrorHandlingConfig } from './types';
import { AppError } from './AppError';
import { ErrorLogger } from './ErrorLogger';
import { captureRequestContext, captureBrowserContext } from './ErrorLogger';
import { logger } from '../utils/logger';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private logger: ErrorLogger;
  private handlers: IErrorHandler[] = [];
  private notifiers: ErrorNotifier[] = [];
  private config: ErrorHandlingConfig;

  private constructor() {
    this.logger = ErrorLogger.getInstance();
    this.config = this.getDefaultConfig();
    this.initializeHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private getDefaultConfig(): ErrorHandlingConfig {
    return {
      logErrors: true,
      notifyErrors: process.env.NODE_ENV === 'production',
      showUserFriendlyErrors: true,
      captureContext: true,
      maxRetries: 3,
      retryDelay: 1000,
      ignoredErrors: ['USER_CANCELLED', 'NETWORK_OFFLINE'],
      environment: (process.env.NODE_ENV as 'development' | 'production' | 'staging') || 'development',
    };
  }

  private initializeHandlers(): void {
    // Handler para erros de autenticação
    this.handlers.push(async (error: IAppError) => {
      if (error.metadata.category === 'authentication') {
        // Redirecionar para login ou renovar token
        if (typeof window !== 'undefined') {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
      }
    });

    // Handler para erros de autorização
    this.handlers.push(async (error: IAppError) => {
      if (error.metadata.category === 'authorization') {
        // Mostrar mensagem de acesso negado
        if (typeof window !== 'undefined') {
          // Você pode usar um toast ou modal aqui
          logger.warn('Access denied', { error: error as Error });
        }
      }
    });

    // Handler para erros de rede
    this.handlers.push(async (error: IAppError) => {
      if (error.metadata.category === 'network') {
        // Verificar conectividade e tentar reconectar
        if (typeof window !== 'undefined' && !navigator.onLine) {
          logger.warn('Network is offline', {});
        }
      }
    });

    // Handler para erros críticos do sistema
    this.handlers.push(async (error: IAppError) => {
      if (error.metadata.severity === 'critical') {
        // Notificar administradores ou mostrar tela de erro crítica
        logger.error('Critical error detected', { error: error as Error });
      }
    });
  }

  public async handle(error: Error | IAppError, context?: Record<string, unknown>): Promise<void> {
    let appError: IAppError;

    // Converter erro genérico para AppError se necessário
    if (error instanceof AppError) {
      appError = error;
    } else {
      appError = AppError.fromError(error, {
        code: 'UNKNOWN_ERROR',
        category: 'unknown',
        severity: 'medium',
        retryable: false,
        userFriendly: true,
      });
    }

    // Adicionar contexto se disponível
    if (this.config.captureContext) {
      if (context) {
        (appError as AppError).addContext(captureRequestContext(context));
      } else if (typeof window !== 'undefined') {
        (appError as AppError).addContext(captureBrowserContext());
      }
    }

    // Verificar se o erro deve ser ignorado
    if (this.config.ignoredErrors.includes(appError.metadata.code)) {
      return;
    }

    try {
      // Log do erro
      if (this.config.logErrors) {
        await this.logger.log(appError);
      }

      // Executar handlers específicos
      const handlerPromises = this.handlers.map(handler => {
        const result = handler(appError);
        return result instanceof Promise ? result : Promise.resolve(result);
      });

      await Promise.allSettled(handlerPromises);

      // Notificar se necessário
      if (this.config.notifyErrors && this.shouldNotify(appError)) {
        await this.notify(appError);
      }

    } catch (handlingError) {
      logger.error('Error handling failed', { 
        error: handlingError instanceof Error ? handlingError : new Error(String(handlingError))
      });
      logger.error('Original error', { 
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }

  private shouldNotify(error: IAppError): boolean {
    // Notificar apenas erros de alta severidade em produção
    return error.metadata.severity === 'high' || error.metadata.severity === 'critical';
  }

  private async notify(error: IAppError): Promise<void> {
    const promises = this.notifiers.map(notifier => {
      const result = notifier(error);
      return result instanceof Promise ? result : Promise.resolve(result);
    });

    await Promise.allSettled(promises);
  }

  public addHandler(handler: IErrorHandler): void {
    this.handlers.push(handler);
  }

  public addNotifier(notifier: ErrorNotifier): void {
    this.notifiers.push(notifier);
  }

  public setConfig(config: Partial<ErrorHandlingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public getConfig(): ErrorHandlingConfig {
    return { ...this.config };
  }

  // Utilitário para retry com backoff exponencial
  public async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.config.maxRetries,
    delay: number = this.config.retryDelay
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Se não é o último attempt e o erro é retryable
        if (attempt < maxRetries && this.isRetryableError(error)) {
          const backoffDelay = delay * Math.pow(2, attempt);
          await this.sleep(backoffDelay);
          continue;
        }
        
        break;
      }
    }

    throw lastError!;
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof AppError) {
      return error.isRetryable();
    }

    // Verificar códigos de erro comuns que são retryable
    const retryableCodes = [
      'NETWORK_TIMEOUT',
      'NETWORK_SERVER_ERROR',
      'DATABASE_CONNECTION_FAILED',
      'SYSTEM_OVERLOAD',
    ];

    const errorObj = error as { message?: string; code?: string };
    return retryableCodes.some(code => 
      errorObj.message?.includes(code) || errorObj.code === code
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utilitário para capturar erros em funções assíncronas
  public async captureAsync<T>(
    operation: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      await this.handle(error as Error, context);
      return null;
    }
  }

  // Utilitário para capturar erros em funções síncronas
  public captureSync<T>(
    operation: () => T,
    context?: Record<string, unknown>
  ): T | null {
    try {
      return operation();
    } catch (error) {
      this.handle(error as Error, context);
      return null;
    }
  }

  // Utilitário para criar boundary de erro
  public createErrorBoundary<T extends unknown[], R>(
    fn: (...args: T) => R | Promise<R>,
    context?: Record<string, unknown>
  ): (...args: T) => Promise<R | null> {
    return async (...args: T): Promise<R | null> => {
      try {
        const result = fn(...args);
        return result instanceof Promise ? await result : result;
      } catch (error) {
        await this.handle(error as Error, context);
        return null;
      }
    };
  }
}

// Instância singleton
const errorHandler = ErrorHandler.getInstance();

// Funções utilitárias exportadas
export const handleError = (error: Error | IAppError, context?: Record<string, unknown>) => 
  errorHandler.handle(error, context);

export const withRetry = <T>(
  operation: () => Promise<T>,
  maxRetries?: number,
  delay?: number
) => errorHandler.withRetry(operation, maxRetries, delay);

export const captureAsync = <T>(
  operation: () => Promise<T>,
  context?: Record<string, unknown>
) => errorHandler.captureAsync(operation, context);

export const captureSync = <T>(
  operation: () => T,
  context?: Record<string, unknown>
) => errorHandler.captureSync(operation, context); 