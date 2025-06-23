export interface LogContext {
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  duration?: number;
  error?: Error;
  [key: string]: unknown;
}

// Logger centralizado: use sempre import { logger } from '@/lib/logger';
export { logger } from '@/lib/logger';

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