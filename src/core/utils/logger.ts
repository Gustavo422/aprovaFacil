export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogContext {
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  duration?: number;
  error?: Error;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  private formatLog(level: LogLevel, message: string, context?: LogContext): LogEntry {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context) {
      logEntry.context = context;
    }

    return logEntry;
  }

  private output(level: LogLevel, message: string, context?: LogContext): void {
    if (this.isTest) return; // Não logar em testes

    const logEntry = this.formatLog(level, message, context);

    if (this.isDevelopment) {
      // Em desenvolvimento, usar console com cores
      const colors = {
        [LogLevel.ERROR]: '\x1b[31m', // Vermelho
        [LogLevel.WARN]: '\x1b[33m',  // Amarelo
        [LogLevel.INFO]: '\x1b[36m',  // Ciano
        [LogLevel.DEBUG]: '\x1b[37m', // Branco
      };
      const reset = '\x1b[0m';
      
      console.log(
        `${colors[level]}[${level.toUpperCase()}]${reset} ${logEntry.timestamp} - ${message}`,
        context ? JSON.stringify(context, null, 2) : ''
      );
    } else {
      // Em produção, usar JSON estruturado
      console.log(JSON.stringify(logEntry));
    }
  }

  error(message: string, context?: LogContext): void {
    this.output(LogLevel.ERROR, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.output(LogLevel.WARN, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.output(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.output(LogLevel.DEBUG, message, context);
    }
  }

  // Métodos específicos para operações de banco
  dbQuery(operation: string, table: string, duration: number, context?: LogContext): void {
    this.info(`DB Query: ${operation} on ${table}`, {
      ...context,
      operation,
      table,
      duration,
    });
  }

  dbError(operation: string, table: string, error: Error, context?: LogContext): void {
    this.error(`DB Error: ${operation} on ${table}`, {
      ...context,
      operation,
      table,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }

  // Métodos específicos para operações de usuário
  userAction(userId: string, action: string, resource: string, resourceId?: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      ...context,
      userId,
      action,
      resource,
      resourceId,
    });
  }

  // Métodos específicos para performance
  performance(operation: string, duration: number, context?: LogContext): void {
    this.info(`Performance: ${operation}`, {
      ...context,
      operation,
      duration,
    });
  }
}

export const logger = new Logger();

// Helper para criar contexto de log
export function createLogContext(overrides: Partial<LogContext> = {}): LogContext {
  return {
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

// Decorator para logar performance de métodos
export function logPerformance(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: unknown[]) {
    const start = Date.now();
    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - start;
      
      logger.performance(`${target.constructor.name}.${propertyKey}`, duration, {
        success: true,
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      
      logger.performance(`${target.constructor.name}.${propertyKey}`, duration, {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
      
      throw error;
    }
  };

  return descriptor;
} 