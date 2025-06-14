import { ErrorHandlingConfig } from '../types';

// Configurações por ambiente
export const errorConfigs: Record<string, ErrorHandlingConfig> = {
  development: {
    logErrors: true,
    notifyErrors: false,
    showUserFriendlyErrors: false, // Mostrar erros técnicos em desenvolvimento
    captureContext: true,
    maxRetries: 2,
    retryDelay: 500,
    ignoredErrors: ['USER_CANCELLED', 'NETWORK_OFFLINE'],
    environment: 'development',
  },
  
  staging: {
    logErrors: true,
    notifyErrors: true,
    showUserFriendlyErrors: true,
    captureContext: true,
    maxRetries: 3,
    retryDelay: 1000,
    ignoredErrors: ['USER_CANCELLED'],
    environment: 'staging',
  },
  
  production: {
    logErrors: true,
    notifyErrors: true,
    showUserFriendlyErrors: true,
    captureContext: true,
    maxRetries: 3,
    retryDelay: 2000,
    ignoredErrors: ['USER_CANCELLED'],
    environment: 'production',
  },
};

// Configuração atual baseada no ambiente
export const currentErrorConfig = errorConfigs[process.env.NODE_ENV || 'development'];

// Configurações específicas para diferentes tipos de erro
export const errorTypeConfigs = {
  // Erros que devem sempre ser logados
  alwaysLog: [
    'AUTH_INVALID_CREDENTIALS',
    'AUTHZ_INSUFFICIENT_PERMISSIONS',
    'DATABASE_CONNECTION_FAILED',
    'SYSTEM_ERROR',
    'UNKNOWN_ERROR',
  ],

  // Erros que devem sempre ser notificados
  alwaysNotify: [
    'SYSTEM_ERROR',
    'DATABASE_CONNECTION_FAILED',
    'CRITICAL_BUSINESS_ERROR',
  ],

  // Erros que são retryable por padrão
  retryable: [
    'NETWORK_TIMEOUT',
    'NETWORK_SERVER_ERROR',
    'DATABASE_CONNECTION_FAILED',
    'SYSTEM_OVERLOAD',
  ],

  // Erros que não devem ser retryable
  notRetryable: [
    'AUTH_INVALID_CREDENTIALS',
    'AUTHZ_INSUFFICIENT_PERMISSIONS',
    'VALIDATION_ERROR',
    'BUSINESS_CONFLICT',
    'USER_NOT_FOUND',
  ],
};

// Configurações de notificação
export const notificationConfig = {
  // Serviços de monitoramento
  services: {
    sentry: {
      enabled: !!process.env.SENTRY_DSN,
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    },
    logRocket: {
      enabled: !!process.env.LOGROCKET_APP_ID,
      appId: process.env.LOGROCKET_APP_ID,
    },
    dataDog: {
      enabled: !!process.env.DATADOG_API_KEY,
      apiKey: process.env.DATADOG_API_KEY,
      site: process.env.DATADOG_SITE || 'datadoghq.com',
    },
  },

  // Configurações de email para notificações críticas
  email: {
    enabled: !!process.env.ERROR_NOTIFICATION_EMAIL,
    recipients: process.env.ERROR_NOTIFICATION_EMAIL?.split(',') || [],
    from: process.env.ERROR_NOTIFICATION_FROM || 'errors@yourapp.com',
  },

  // Configurações de Slack/Discord
  chat: {
    slack: {
      enabled: !!process.env.SLACK_WEBHOOK_URL,
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: process.env.SLACK_ERROR_CHANNEL || '#errors',
    },
    discord: {
      enabled: !!process.env.DISCORD_WEBHOOK_URL,
      webhookUrl: process.env.DISCORD_WEBHOOK_URL,
    },
  },
};

// Configurações de logging
export const loggingConfig = {
  // Níveis de log por ambiente
  levels: {
    development: 'debug',
    staging: 'info',
    production: 'warn',
  },

  // Formato dos logs
  format: {
    development: 'pretty',
    staging: 'json',
    production: 'json',
  },

  // Arquivos de log
  files: {
    enabled: process.env.NODE_ENV === 'production',
    path: process.env.LOG_FILE_PATH || './logs',
    maxSize: '10m',
    maxFiles: 5,
  },

  // Logs sensíveis que devem ser mascarados
  sensitiveFields: [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'cookie',
  ],
};

// Configurações de métricas
export const metricsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  
  // Métricas a serem coletadas
  collect: {
    errorCount: true,
    errorRate: true,
    errorTypes: true,
    responseTime: true,
    retryCount: true,
    recoveryRate: true,
  },

  // Intervalo de coleta (em segundos)
  interval: 60,

  // Backend para métricas
  backend: process.env.METRICS_BACKEND || 'console',
};

// Configurações de rate limiting para notificações
export const rateLimitConfig = {
  // Máximo de notificações por minuto
  maxNotificationsPerMinute: 10,
  
  // Máximo de notificações por hora
  maxNotificationsPerHour: 100,
  
  // Máximo de notificações por dia
  maxNotificationsPerDay: 1000,
  
  // Tempo de cooldown entre notificações do mesmo erro (em segundos)
  cooldownPeriod: 300,
};

// Configurações de contexto
export const contextConfig = {
  // Informações sempre incluídas no contexto
  alwaysInclude: [
    'userId',
    'sessionId',
    'requestId',
    'timestamp',
    'url',
    'method',
    'userAgent',
  ],

  // Informações opcionais no contexto
  optional: [
    'ip',
    'headers',
    'body',
    'params',
    'query',
  ],

  // Informações sensíveis que devem ser removidas
  sensitive: [
    'authorization',
    'cookie',
    'x-api-key',
    'password',
  ],

  // Tamanho máximo do contexto (em bytes)
  maxSize: 1024 * 10, // 10KB
};

// Configurações de validação
export const validationConfig = {
  // Validações padrão
  defaults: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email deve ser válido',
    },
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      message: 'Senha deve ter pelo menos 8 caracteres com letras maiúsculas, minúsculas e números',
    },
    uuid: {
      pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      message: 'ID deve ser um UUID válido',
    },
  },

  // Mensagens de erro personalizadas
  messages: {
    required: 'Campo obrigatório',
    minLength: 'Mínimo de {min} caracteres',
    maxLength: 'Máximo de {max} caracteres',
    pattern: 'Formato inválido',
    email: 'Email inválido',
    password: 'Senha muito fraca',
    uuid: 'ID inválido',
  },
};

// Função para obter configuração baseada no ambiente
export function getErrorConfig(): ErrorHandlingConfig {
  const env = process.env.NODE_ENV || 'development';
  return errorConfigs[env] || errorConfigs.development;
}

// Função para verificar se um erro deve ser logado
export function shouldLogError(errorCode: string): boolean {
  return errorTypeConfigs.alwaysLog.includes(errorCode) || 
         currentErrorConfig.logErrors;
}

// Função para verificar se um erro deve ser notificado
export function shouldNotifyError(errorCode: string): boolean {
  return errorTypeConfigs.alwaysNotify.includes(errorCode) || 
         currentErrorConfig.notifyErrors;
}

// Função para verificar se um erro é retryable
export function isRetryableError(errorCode: string): boolean {
  if (errorTypeConfigs.notRetryable.includes(errorCode)) {
    return false;
  }
  return errorTypeConfigs.retryable.includes(errorCode);
}

// Função para obter configuração de notificação
export function getNotificationConfig() {
  return notificationConfig;
}

// Função para obter configuração de logging
export function getLoggingConfig() {
  return loggingConfig;
} 