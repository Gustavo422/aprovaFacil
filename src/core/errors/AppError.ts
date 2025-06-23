import { AppError as IAppError, ErrorMetadata, ErrorContext } from './types';

export class AppError extends Error implements IAppError {
  public readonly metadata: ErrorMetadata;
  private readonly _timestamp: Date;

  constructor(
    message: string,
    metadata: Omit<ErrorMetadata, 'timestamp'>,
    cause?: Error
  ) {
    super(message);
    this.name = 'AppError';
    this._timestamp = new Date();
    
    this.metadata = {
      ...metadata,
      stack: this.stack,
      cause: cause || undefined,
    };

    // Preserva o stack trace original
    if (cause && cause.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }

    // Garante que o erro seja serializável
    Object.setPrototypeOf(this, AppError.prototype);
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      metadata: {
        ...this.metadata,
        timestamp: this._timestamp.toISOString(),
      },
      stack: this.metadata.stack,
    };
  }

  public toUserFriendly(): string {
    if (this.metadata.userFriendly) {
      return this.message;
    }

    // Mapeamento de códigos de erro para mensagens amigáveis
    const userFriendlyMessages: Record<string, string> = {
      'AUTH_INVALID_CREDENTIALS': 'Credenciais inválidas. Verifique seu email e senha.',
      'AUTH_SESSION_EXPIRED': 'Sua sessão expirou. Faça login novamente.',
      'AUTH_INSUFFICIENT_PERMISSIONS': 'Você não tem permissão para realizar esta ação.',
      'VALIDATION_REQUIRED_FIELD': 'Campo obrigatório não preenchido.',
      'VALIDATION_INVALID_FORMAT': 'Formato inválido para este campo.',
      'VALIDATION_MIN_LENGTH': 'Este campo deve ter pelo menos {min} caracteres.',
      'VALIDATION_MAX_LENGTH': 'Este campo deve ter no máximo {max} caracteres.',
      'VALIDATION_EMAIL_INVALID': 'Email inválido.',
      'VALIDATION_PASSWORD_WEAK': 'Senha muito fraca. Use pelo menos 8 caracteres com letras, números e símbolos.',
      'DATABASE_CONNECTION_FAILED': 'Erro de conexão com o banco de dados.',
      'DATABASE_QUERY_FAILED': 'Erro ao processar dados.',
      'DATABASE_RECORD_NOT_FOUND': 'Registro não encontrado.',
      'DATABASE_DUPLICATE_ENTRY': 'Este registro já existe.',
      'NETWORK_TIMEOUT': 'Tempo limite da conexão excedido.',
      'NETWORK_OFFLINE': 'Sem conexão com a internet.',
      'NETWORK_SERVER_ERROR': 'Erro no servidor. Tente novamente mais tarde.',
      'BUSINESS_INSUFFICIENT_FUNDS': 'Saldo insuficiente.',
      'BUSINESS_LIMIT_EXCEEDED': 'Limite excedido.',
      'BUSINESS_INVALID_STATE': 'Operação não permitida no estado atual.',
      'SYSTEM_MAINTENANCE': 'Sistema em manutenção. Tente novamente mais tarde.',
      'SYSTEM_OVERLOAD': 'Sistema sobrecarregado. Tente novamente em alguns minutos.',
      'UNKNOWN_ERROR': 'Ocorreu um erro inesperado. Tente novamente.',
    };

    return userFriendlyMessages[this.metadata.code] || 'Ocorreu um erro inesperado. Tente novamente.';
  }

  public addContext(context: Partial<ErrorContext>): void {
    this.metadata.context = {
      ...this.metadata.context,
      ...context,
      timestamp: this._timestamp,
    };
  }

  public isRetryable(): boolean {
    return this.metadata.retryable;
  }

  public getSeverity(): ErrorMetadata['severity'] {
    return this.metadata.severity;
  }

  public getCategory(): ErrorMetadata['category'] {
    return this.metadata.category;
  }

  public static fromError(error: Error, metadata: Omit<ErrorMetadata, 'stack' | 'cause'>): AppError {
    return new AppError(error.message, metadata, error);
  }

  public static create(
    code: string,
    message: string,
    category: ErrorMetadata['category'] = 'unknown',
    severity: ErrorMetadata['severity'] = 'medium',
    retryable: boolean = false,
    userFriendly: boolean = true
  ): AppError {
    return new AppError(message, {
      code,
      category,
      severity,
      retryable,
      userFriendly,
    });
  }

  public static validation(
    field: string,
    message: string,
    _value?: unknown
  ): AppError {
    return AppError.create(
      'VALIDATION_ERROR',
      `Validation error for field '${field}': ${message}`,
      'validation',
      'low',
      false,
      true
    );
  }

  public static authentication(message: string): AppError {
    return AppError.create(
      'AUTH_ERROR',
      message,
      'authentication',
      'high',
      false,
      true
    );
  }

  public static authorization(message: string): AppError {
    return AppError.create(
      'AUTHZ_ERROR',
      message,
      'authorization',
      'high',
      false,
      true
    );
  }

  public static database(message: string, retryable: boolean = true): AppError {
    return AppError.create(
      'DATABASE_ERROR',
      message,
      'database',
      'high',
      retryable,
      false
    );
  }

  public static network(message: string, retryable: boolean = true): AppError {
    return AppError.create(
      'NETWORK_ERROR',
      message,
      'network',
      'medium',
      retryable,
      true
    );
  }

  public static business(message: string): AppError {
    return AppError.create(
      'BUSINESS_ERROR',
      message,
      'business',
      'medium',
      false,
      true
    );
  }

  public static system(message: string, retryable: boolean = true): AppError {
    return AppError.create(
      'SYSTEM_ERROR',
      message,
      'system',
      'critical',
      retryable,
      false
    );
  }
} 