import { NextRequest, NextResponse } from 'next/server';
import { AppError } from './AppError';
import { errorHandler } from './ErrorHandler';
import { ErrorResponse, ValidationErrorResponse } from './types';
import { captureRequestContext } from './ErrorLogger';

export interface ErrorMiddlewareConfig {
  includeStack?: boolean;
  logErrors?: boolean;
  formatErrors?: boolean;
  cors?: boolean;
}

export class ErrorMiddleware {
  private config: ErrorMiddlewareConfig;

  constructor(config: ErrorMiddlewareConfig = {}) {
    this.config = {
      includeStack: process.env.NODE_ENV === 'development',
      logErrors: true,
      formatErrors: true,
      cors: true,
      ...config,
    };
  }

  public handler = async (
    request: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> => {
    try {
      return await handler();
    } catch (error) {
      return this.handleError(error, request);
    }
  };

  public async handleError(
    error: unknown,
    request: NextRequest
  ): Promise<NextResponse> {
    let appError: AppError;
    const requestId = this.generateRequestId();

    // Converter erro para AppError
    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = AppError.fromError(error, {
        code: 'API_ERROR',
        category: 'system',
        severity: 'high',
        retryable: false,
        userFriendly: true,
      });
    } else {
      appError = AppError.create(
        'UNKNOWN_ERROR',
        'An unknown error occurred',
        'unknown',
        'high',
        false,
        true
      );
    }

    // Adicionar contexto da requisição
    appError.addContext({
      requestId,
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') || undefined,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date(),
    });

    // Log do erro se habilitado
    if (this.config.logErrors) {
      await errorHandler.handle(appError, request);
    }

    // Criar resposta de erro
    const errorResponse = this.createErrorResponse(appError, requestId);

    // Configurar headers CORS se habilitado
    const response = NextResponse.json(errorResponse, {
      status: this.getHttpStatus(appError),
    });

    if (this.config.cors) {
      this.setCorsHeaders(response);
    }

    // Adicionar headers de rastreamento
    response.headers.set('X-Request-ID', requestId);
    response.headers.set('X-Error-Code', appError.metadata.code);

    return response;
  }

  private createErrorResponse(
    error: AppError,
    requestId: string
  ): ErrorResponse {
    const baseResponse: ErrorResponse = {
      success: false,
      error: {
        code: error.metadata.code,
        message: error.message,
        userMessage: error.toUserFriendly(),
        timestamp: new Date().toISOString(),
        requestId,
      },
    };

    // Adicionar detalhes de validação se for erro de validação
    if (error.metadata.category === 'validation') {
      return this.createValidationErrorResponse(error, baseResponse);
    }

    // Adicionar stack trace em desenvolvimento
    if (this.config.includeStack && error.metadata.stack) {
      baseResponse.error.details = {
        stack: error.metadata.stack,
        category: error.metadata.category,
        severity: error.metadata.severity,
        retryable: error.metadata.retryable,
      };
    }

    return baseResponse;
  }

  private createValidationErrorResponse(
    error: AppError,
    baseResponse: ErrorResponse
  ): ValidationErrorResponse {
    return {
      ...baseResponse,
      error: {
        ...baseResponse.error,
        details: {
          validationErrors: [
            {
              field: 'unknown',
              message: error.message,
              code: error.metadata.code,
            },
          ],
        },
      },
    };
  }

  private getHttpStatus(error: AppError): number {
    const statusMap: Record<string, number> = {
      // Autenticação
      'AUTH_INVALID_CREDENTIALS': 401,
      'AUTH_SESSION_EXPIRED': 401,
      'AUTH_TOKEN_INVALID': 401,
      'AUTH_TOKEN_EXPIRED': 401,

      // Autorização
      'AUTHZ_INSUFFICIENT_PERMISSIONS': 403,
      'AUTHZ_ACCESS_DENIED': 403,
      'AUTHZ_ROLE_REQUIRED': 403,

      // Validação
      'VALIDATION_ERROR': 400,
      'VALIDATION_REQUIRED_FIELD': 400,
      'VALIDATION_INVALID_FORMAT': 400,
      'VALIDATION_MIN_LENGTH': 400,
      'VALIDATION_MAX_LENGTH': 400,
      'VALIDATION_EMAIL_INVALID': 400,
      'VALIDATION_PASSWORD_WEAK': 400,

      // Recursos não encontrados
      'RESOURCE_NOT_FOUND': 404,
      'DATABASE_RECORD_NOT_FOUND': 404,
      'USER_NOT_FOUND': 404,

      // Conflitos
      'DATABASE_DUPLICATE_ENTRY': 409,
      'BUSINESS_CONFLICT': 409,

      // Erros de servidor
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

  private setCorsHeaders(response: NextResponse): void {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utilitário para criar middleware com configuração específica
  public static create(config?: ErrorMiddlewareConfig): ErrorMiddleware {
    return new ErrorMiddleware(config);
  }

  // Utilitário para wrapper de API routes
  public static withErrorHandling<T extends unknown[], R>(
    handler: (...args: T) => Promise<R>,
    config?: ErrorMiddlewareConfig
  ): (...args: T) => Promise<R> {
    const _middleware = new ErrorMiddleware(config);
    
    return async (...args: T): Promise<R> => {
      try {
        return await handler(...args);
      } catch (error) {
        // Se for uma requisição Next.js, usar o middleware
        if (args[0] && typeof args[0] === 'object' && 'url' in args[0]) {
          throw error; // Deixar o middleware lidar
        }
        
        // Para outros casos, usar o error handler
        await errorHandler.handle(error as Error);
        throw error;
      }
    };
  }
}

// Middleware global para Next.js
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  const middleware = new ErrorMiddleware();
  return (req: NextRequest) => middleware.handler(req, () => handler(req));
}

// Utilitário para validar dados de entrada
export function validateRequest<T>(
  data: unknown,
  validator: (data: unknown) => data is T
): T {
  if (!validator(data)) {
    throw AppError.validation(
      'request',
      'Invalid request data format',
      data
    );
  }
  return data;
}

// Utilitário para validar parâmetros de query
export function validateQuery<T>(
  query: unknown,
  validator: (query: unknown) => query is T
): T {
  if (!validator(query)) {
    throw AppError.validation(
      'query',
      'Invalid query parameters',
      query
    );
  }
  return query;
}

// Utilitário para validar parâmetros de rota
export function validateParams<T>(
  params: unknown,
  validator: (params: unknown) => params is T
): T {
  if (!validator(params)) {
    throw AppError.validation(
      'params',
      'Invalid route parameters',
      params
    );
  }
  return params;
} 