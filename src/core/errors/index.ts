// Tipos e interfaces
export * from './types';

// Classes principais
export { AppError } from './AppError';
export { ErrorLogger } from './ErrorLogger';
export { ErrorHandler, errorHandler } from './ErrorHandler';
export { ErrorMiddleware, withErrorHandling } from './ErrorMiddleware';

// Hooks React (excluindo useErrorBoundary que está duplicado)
export { 
  useErrorHandler,
  useErrorToast,
  useNetworkStatus,
  useErrorRecovery
} from './hooks/useErrorHandler';

// Componentes React
export { 
  ErrorBoundary,
  DefaultErrorFallback,
  NetworkErrorFallback,
  AuthErrorFallback,
  PermissionErrorFallback
} from './components/ErrorBoundary';

// Utilitários de conveniência
export { 
  handleError, 
  withRetry, 
  captureAsync, 
  captureSync 
} from './ErrorHandler';

// Utilitários de validação
export { 
  validateRequest, 
  validateQuery, 
  validateParams 
} from './ErrorMiddleware';

// Utilitários de contexto
export { 
  captureRequestContext, 
  captureBrowserContext 
} from './ErrorLogger';

// Códigos de erro comuns
export const ErrorCodes = {
  // Autenticação
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',

  // Autorização
  AUTHZ_INSUFFICIENT_PERMISSIONS: 'AUTHZ_INSUFFICIENT_PERMISSIONS',
  AUTHZ_ACCESS_DENIED: 'AUTHZ_ACCESS_DENIED',
  AUTHZ_ROLE_REQUIRED: 'AUTHZ_ROLE_REQUIRED',

  // Validação
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  VALIDATION_MIN_LENGTH: 'VALIDATION_MIN_LENGTH',
  VALIDATION_MAX_LENGTH: 'VALIDATION_MAX_LENGTH',
  VALIDATION_EMAIL_INVALID: 'VALIDATION_EMAIL_INVALID',
  VALIDATION_PASSWORD_WEAK: 'VALIDATION_PASSWORD_WEAK',

  // Recursos não encontrados
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  DATABASE_RECORD_NOT_FOUND: 'DATABASE_RECORD_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Conflitos
  DATABASE_DUPLICATE_ENTRY: 'DATABASE_DUPLICATE_ENTRY',
  BUSINESS_CONFLICT: 'BUSINESS_CONFLICT',

  // Erros de servidor
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED: 'DATABASE_QUERY_FAILED',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_SERVER_ERROR: 'NETWORK_SERVER_ERROR',
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',
  SYSTEM_OVERLOAD: 'SYSTEM_OVERLOAD',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',

  // React
  REACT_ERROR: 'REACT_ERROR',
  REACT_ERROR_BOUNDARY: 'REACT_ERROR_BOUNDARY',

  // API
  API_ERROR: 'API_ERROR',
} as const;

// Categorias de erro
export const ErrorCategories = {
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  DATABASE: 'database',
  NETWORK: 'network',
  BUSINESS: 'business',
  SYSTEM: 'system',
  UNKNOWN: 'unknown',
} as const;

// Níveis de severidade
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Configurações padrão
export const DefaultErrorConfig = {
  logErrors: true,
  notifyErrors: process.env.NODE_ENV === 'production',
  showUserFriendlyErrors: true,
  captureContext: true,
  maxRetries: 3,
  retryDelay: 1000,
  ignoredErrors: ['USER_CANCELLED', 'NETWORK_OFFLINE'],
  environment: (process.env.NODE_ENV as any) || 'development',
} as const;

// Função de inicialização do sistema
export function initializeErrorHandling(config?: Partial<typeof DefaultErrorConfig>) {
  const { ErrorHandler } = require('./ErrorHandler');
  const errorHandler = ErrorHandler.getInstance();
  
  if (config) {
    errorHandler.setConfig(config);
  }

  // Configurar handlers globais
  if (typeof window !== 'undefined') {
    // Capturar erros não tratados
    window.addEventListener('error', (event) => {
      errorHandler.handle(event.error || new Error(event.message));
    });

    // Capturar rejeições de promises não tratadas
    window.addEventListener('unhandledrejection', (event) => {
      errorHandler.handle(new Error(event.reason));
    });
  }

  return errorHandler;
}

// Função para criar erro de validação com Zod
export function createValidationError(field: string, message: string, value?: any) {
  const { AppError } = require('./AppError');
  return AppError.validation(field, message, value);
}

// Função para criar erro de autenticação
export function createAuthError(message: string) {
  const { AppError } = require('./AppError');
  return AppError.authentication(message);
}

// Função para criar erro de autorização
export function createAuthzError(message: string) {
  const { AppError } = require('./AppError');
  return AppError.authorization(message);
}

// Função para criar erro de banco de dados
export function createDatabaseError(message: string, retryable = true) {
  const { AppError } = require('./AppError');
  return AppError.database(message, retryable);
}

// Função para criar erro de rede
export function createNetworkError(message: string, retryable = true) {
  const { AppError } = require('./AppError');
  return AppError.network(message, retryable);
}

// Função para criar erro de negócio
export function createBusinessError(message: string) {
  const { AppError } = require('./AppError');
  return AppError.business(message);
}

// Função para criar erro do sistema
export function createSystemError(message: string, retryable = true) {
  const { AppError } = require('./AppError');
  return AppError.system(message, retryable);
}

// Função para verificar se um erro é retryable
export function isRetryableError(error: Error | any): boolean {
  const { AppError } = require('./AppError');
  
  if (error instanceof AppError) {
    return error.isRetryable();
  }

  const retryableCodes = [
    'NETWORK_TIMEOUT',
    'NETWORK_SERVER_ERROR',
    'DATABASE_CONNECTION_FAILED',
    'SYSTEM_OVERLOAD',
  ];

  return retryableCodes.some(code => 
    error.message?.includes(code) || error.code === code
  );
}

// Função para obter mensagem amigável de um erro
export function getUserFriendlyMessage(error: Error | any): string {
  const { AppError } = require('./AppError');
  
  if (error instanceof AppError) {
    return error.toUserFriendly();
  }

  return error.message || 'Ocorreu um erro inesperado. Tente novamente.';
}

// Função para obter código HTTP de um erro
export function getHttpStatus(error: Error | any): number {
  const { AppError } = require('./AppError');
  
  if (!(error instanceof AppError)) {
    return 500;
  }

  const statusMap: Record<string, number> = {
    'AUTH_INVALID_CREDENTIALS': 401,
    'AUTH_SESSION_EXPIRED': 401,
    'AUTH_TOKEN_INVALID': 401,
    'AUTH_TOKEN_EXPIRED': 401,
    'AUTHZ_INSUFFICIENT_PERMISSIONS': 403,
    'AUTHZ_ACCESS_DENIED': 403,
    'AUTHZ_ROLE_REQUIRED': 403,
    'VALIDATION_ERROR': 400,
    'VALIDATION_REQUIRED_FIELD': 400,
    'VALIDATION_INVALID_FORMAT': 400,
    'VALIDATION_MIN_LENGTH': 400,
    'VALIDATION_MAX_LENGTH': 400,
    'VALIDATION_EMAIL_INVALID': 400,
    'VALIDATION_PASSWORD_WEAK': 400,
    'RESOURCE_NOT_FOUND': 404,
    'DATABASE_RECORD_NOT_FOUND': 404,
    'USER_NOT_FOUND': 404,
    'DATABASE_DUPLICATE_ENTRY': 409,
    'BUSINESS_CONFLICT': 409,
    'DATABASE_CONNECTION_FAILED': 503,
    'DATABASE_QUERY_FAILED': 500,
    'NETWORK_TIMEOUT': 504,
    'NETWORK_SERVER_ERROR': 502,
    'SYSTEM_MAINTENANCE': 503,
    'SYSTEM_OVERLOAD': 503,
    'SYSTEM_ERROR': 500,
    'UNKNOWN_ERROR': 500,
  };

  return statusMap[error.metadata.code] || 500;
} 