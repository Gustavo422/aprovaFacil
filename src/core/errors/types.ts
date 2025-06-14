export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  url?: string;
  method?: string;
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

export interface ErrorMetadata {
  code: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'validation' | 'authentication' | 'authorization' | 'database' | 'network' | 'business' | 'system' | 'unknown';
  retryable: boolean;
  userFriendly: boolean;
  context?: ErrorContext;
  stack?: string;
  cause?: Error;
}

export interface AppError extends Error {
  metadata: ErrorMetadata;
  toJSON(): Record<string, any>;
  toUserFriendly(): string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    userMessage?: string;
    details?: any;
    timestamp: string;
    requestId?: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  code: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  error: {
    code: string;
    message: string;
    userMessage?: string;
    details?: {
      validationErrors: ValidationError[];
    };
    timestamp: string;
    requestId?: string;
  };
}

export type ErrorHandler = (error: AppError) => void | Promise<void>;
export type IErrorLogger = (error: AppError) => void | Promise<void>;
export type ErrorNotifier = (error: AppError) => void | Promise<void>;

export interface ErrorHandlingConfig {
  logErrors: boolean;
  notifyErrors: boolean;
  showUserFriendlyErrors: boolean;
  captureContext: boolean;
  maxRetries: number;
  retryDelay: number;
  ignoredErrors: string[];
  environment: 'development' | 'staging' | 'production';
} 