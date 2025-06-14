// Utilitários para tratamento de erros

export interface AppError extends Error {
  code?: string
  status: number
  context?: Record<string, any>
  isOperational: boolean
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status: number = 500,
    public context?: Record<string, any>,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Tipos de erro comuns
export const ErrorTypes = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  NETWORK: 'NETWORK_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  SERVER: 'SERVER_ERROR',
  DATABASE: 'DATABASE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
} as const

// Códigos de erro específicos
export const ErrorCodes = {
  // Autenticação
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_CONFIRMED: 'EMAIL_NOT_CONFIRMED',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Validação
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Autorização
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // Recursos
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  
  // Rede
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  
  // Rate Limit
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Servidor
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Banco de dados
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
  DATABASE_QUERY_ERROR: 'DATABASE_QUERY_ERROR',
  DATABASE_CONSTRAINT_VIOLATION: 'DATABASE_CONSTRAINT_VIOLATION',
  
  // Erro desconhecido
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const

// Função para criar erros padronizados
export function createError(
  message: string,
  code: keyof typeof ErrorCodes = 'UNKNOWN_ERROR',
  status: number = 500,
  context?: Record<string, any>
): AppError {
  return new AppError(message, ErrorCodes[code], status, context)
}

// Função para criar erros de validação
export function createValidationError(
  message: string,
  field?: string,
  context?: Record<string, any>
): AppError {
  return createError(
    message,
    'INVALID_INPUT',
    400,
    { field, ...context }
  )
}

// Função para criar erros de autenticação
export function createAuthError(
  message: string,
  context?: Record<string, any>
): AppError {
  return createError(
    message,
    'INVALID_CREDENTIALS',
    401,
    context
  )
}

// Função para criar erros de autorização
export function createAuthzError(
  message: string,
  context?: Record<string, any>
): AppError {
  return createError(
    message,
    'INSUFFICIENT_PERMISSIONS',
    403,
    context
  )
}

// Função para criar erros de recurso não encontrado
export function createNotFoundError(
  resource: string,
  context?: Record<string, any>
): AppError {
  return createError(
    `${resource} não encontrado`,
    'RESOURCE_NOT_FOUND',
    404,
    { resource, ...context }
  )
}

// Função para criar erros de rate limit
export function createRateLimitError(
  message: string = "Muitas tentativas. Aguarde alguns minutos.",
  context?: Record<string, any>
): AppError {
  return createError(
    message,
    'RATE_LIMIT_EXCEEDED',
    429,
    context
  )
}

// Função para criar erros de servidor
export function createServerError(
  message: string = "Erro interno do servidor",
  context?: Record<string, any>
): AppError {
  return createError(
    message,
    'INTERNAL_SERVER_ERROR',
    500,
    context
  )
}

// Função para obter mensagem amigável do erro
export function getErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error?.message) {
    // Mapeamento de mensagens específicas
    const messageMap: Record<string, string> = {
      'Request rate limit reached': 'Muitas tentativas. Aguarde alguns minutos.',
      'Invalid login credentials': 'Email ou senha incorretos.',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
      'User already registered': 'Este email já está cadastrado.',
      'fetch': 'Erro de conexão. Verifique sua internet.',
      'timeout': 'A operação demorou muito. Tente novamente.',
      'validation': 'Dados inválidos. Verifique as informações.',
      'permission': 'Você não tem permissão para esta ação.',
      'unauthorized': 'Acesso negado.',
      'not found': 'Recurso não encontrado.',
      'network': 'Erro de conexão. Verifique sua internet.'
    }
    
    const lowerMessage = error.message.toLowerCase()
    for (const [key, value] of Object.entries(messageMap)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return value
      }
    }
    
    return error.message
  }
  
  return "Ocorreu um erro inesperado. Tente novamente."
}

// Função para verificar se é um erro operacional
export function isOperationalError(error: any): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  
  // Erros de rede e timeout são operacionais
  if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
    return true
  }
  
  // Erros de validação são operacionais
  if (error?.status >= 400 && error?.status < 500) {
    return true
  }
  
  return false
}

// Função para logar erro
export function logError(error: any, context?: Record<string, any>) {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    name: error?.name,
    code: error?.code,
    status: error?.status,
    context: { ...context, ...error?.context },
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined
  }
  
  console.error('Erro registrado:', errorInfo)
  
  // Aqui você pode enviar para um serviço de monitoramento
  // como Sentry, LogRocket, etc.
  
  return errorInfo
}

// Função para wrapper de operações assíncronas
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  try {
    return await operation()
  } catch (error: any) {
    logError(error, context)
    
    // Se for um erro operacional, relançar
    if (isOperationalError(error)) {
      throw error
    }
    
    // Se não for operacional, criar um erro genérico
    throw createServerError("Ocorreu um erro inesperado", context)
  }
}

// Função para wrapper de operações síncronas
export function withErrorHandlingSync<T>(
  operation: () => T,
  context?: Record<string, any>
): T {
  try {
    return operation()
  } catch (error: any) {
    logError(error, context)
    
    if (isOperationalError(error)) {
      throw error
    }
    
    throw createServerError("Ocorreu um erro inesperado", context)
  }
} 