import { AppError, ErrorContext } from './types';

interface ILogger {
  log(error: AppError): Promise<void>;
}

export class ErrorLogger {
  private static instance: ErrorLogger;
  private loggers: ILogger[] = [];
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.initializeLoggers();
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private initializeLoggers(): void {
    // Console logger para desenvolvimento
    if (this.isDevelopment) {
      this.loggers.push(new ConsoleLogger());
    }

    // File logger para produção
    if (process.env.NODE_ENV === 'production') {
      this.loggers.push(new FileLogger());
    }

    // External service logger (ex: Sentry, LogRocket, etc.)
    if (process.env.ERROR_LOGGING_SERVICE) {
      this.loggers.push(new ExternalServiceLogger());
    }
  }

  public async log(error: AppError): Promise<void> {
    const promises = this.loggers.map(logger => 
      logger.log(error).catch((logError: Error) => {
        // Fallback para console se outros loggers falharem
        console.error('Logger failed:', logError);
        console.error('Original error:', error);
      })
    );

    await Promise.allSettled(promises);
  }

  public addLogger(logger: ILogger): void {
    this.loggers.push(logger);
  }

  public removeLogger(logger: ILogger): void {
    const index = this.loggers.indexOf(logger);
    if (index > -1) {
      this.loggers.splice(index, 1);
    }
  }
}

class ConsoleLogger implements ILogger {
  async log(error: AppError): Promise<void> {
    const timestamp = new Date().toISOString();
    const context = error.metadata.context;
    
    console.group(`🚨 ERROR [${timestamp}] - ${error.metadata.code}`);
    console.error('Message:', error.message);
    console.error('Category:', error.metadata.category);
    console.error('Severity:', error.metadata.severity);
    console.error('Retryable:', error.metadata.retryable);
    console.error('User Friendly:', error.metadata.userFriendly);
    
    if (context) {
      console.error('Context:', {
        userId: context.userId,
        sessionId: context.sessionId,
        requestId: context.requestId,
        url: context.url,
        method: context.method,
        userAgent: context.userAgent,
        ip: context.ip,
      });
    }
    
    if (error.metadata.stack) {
      console.error('Stack:', error.metadata.stack);
    }
    
    if (error.metadata.cause) {
      console.error('Cause:', error.metadata.cause);
    }
    
    console.groupEnd();
  }
}

class FileLogger implements ILogger {
  async log(error: AppError): Promise<void> {
    // Em um ambiente real, você implementaria logging para arquivo
    // Por exemplo, usando winston, pino, ou similar
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      error: error.toJSON(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
    };

    // Simulação de logging para arquivo
    console.log('📄 FILE LOG:', JSON.stringify(logEntry, null, 2));
  }
}

class ExternalServiceLogger implements ILogger {
  async log(error: AppError): Promise<void> {
    try {
      // Exemplo com Sentry
      if (process.env.SENTRY_DSN) {
        await this.logToSentry(error);
      }

      // Exemplo com LogRocket
      if (process.env.LOGROCKET_APP_ID) {
        await this.logToLogRocket(error);
      }

      // Exemplo com DataDog
      if (process.env.DATADOG_API_KEY) {
        await this.logToDataDog(error);
      }
    } catch (logError) {
      console.error('Failed to log to external service:', logError);
    }
  }

  private async logToSentry(error: AppError): Promise<void> {
    // Implementação com Sentry
    // const Sentry = require('@sentry/nextjs');
    // Sentry.captureException(error, {
    //   tags: {
    //     category: error.metadata.category,
    //     severity: error.metadata.severity,
    //     code: error.metadata.code,
    //   },
    //   extra: {
    //     context: error.metadata.context,
    //     metadata: error.metadata,
    //   },
    // });
    console.log('📡 SENTRY LOG:', error.metadata.code);
  }

  private async logToLogRocket(error: AppError): Promise<void> {
    // Implementação com LogRocket
    // LogRocket.captureException(error);
    console.log('📡 LOGROCKET LOG:', error.metadata.code);
  }

  private async logToDataDog(error: AppError): Promise<void> {
    // Implementação com DataDog
    // dd.track('error', {
    //   error_code: error.metadata.code,
    //   error_category: error.metadata.category,
    //   error_severity: error.metadata.severity,
    // });
    console.log('📡 DATADOG LOG:', error.metadata.code);
  }
}

// Utilitário para capturar contexto da requisição
export function captureRequestContext(req?: any): Partial<ErrorContext> {
  if (!req) return {};

  return {
    url: req.url,
    method: req.method,
    userAgent: req.headers?.['user-agent'],
    ip: req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress,
    headers: req.headers,
    body: req.body,
    params: req.params,
  };
}

// Utilitário para capturar contexto do navegador
export function captureBrowserContext(): Partial<ErrorContext> {
  if (typeof window === 'undefined') return {};

  return {
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date(),
  };
} 