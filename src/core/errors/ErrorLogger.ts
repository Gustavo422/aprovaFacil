import { AppError, ErrorContext } from './types';
import { logger } from '../utils/logger';

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
    const promises = this.loggers.map(loggerInstance => 
      loggerInstance.log(error).catch((logError: Error) => {
        // Fallback para console se outros loggers falharem
        logger.error('Logger failed', { error: logError });
        logger.error('Original error', { error: error as Error });
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
    
    logger.error(`ERROR [${timestamp}] - ${error.metadata.code}`, {
      message: error.message,
      category: error.metadata.category,
      severity: error.metadata.severity,
      retryable: error.metadata.retryable,
      userFriendly: error.metadata.userFriendly,
      context: context ? {
        userId: context.userId,
        sessionId: context.sessionId,
        requestId: context.requestId,
        url: context.url,
        method: context.method,
        userAgent: context.userAgent,
        ip: context.ip,
      } : undefined,
      stack: error.metadata.stack,
      cause: error.metadata.cause,
    });
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
    logger.info('FILE LOG', { logEntry });
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
      logger.error('Failed to log to external service', { error: logError as Error });
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
    logger.info('SENTRY LOG', { code: error.metadata.code });
  }

  private async logToLogRocket(error: AppError): Promise<void> {
    // Implementação com LogRocket
    // LogRocket.captureException(error);
    logger.info('LOGROCKET LOG', { code: error.metadata.code });
  }

  private async logToDataDog(error: AppError): Promise<void> {
    // Implementação com DataDog
    // dd.track('error', {
    //   error_code: error.metadata.code,
    //   error_category: error.metadata.category,
    //   error_severity: error.metadata.severity,
    // });
    logger.info('DATADOG LOG', { code: error.metadata.code });
  }
}

// Utilitário para capturar contexto da requisição
export function captureRequestContext(req?: unknown): Partial<ErrorContext> {
  if (!req) return {};

  const reqObj = req as {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    connection?: { remoteAddress?: string };
    body?: unknown;
    params?: Record<string, unknown>;
  };

  return {
    url: reqObj.url,
    method: reqObj.method,
    userAgent: reqObj.headers?.['user-agent'],
    ip: reqObj.headers?.['x-forwarded-for'] || reqObj.connection?.remoteAddress,
    headers: reqObj.headers,
    body: reqObj.body,
    params: reqObj.params,
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