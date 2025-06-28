// Este arquivo contém a configuração do Sentry para o lado do servidor
import * as Sentry from "@sentry/nextjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Configuração de ambiente
  environment: process.env.NODE_ENV || 'development',
  
  // Monitoramento de desempenho
  tracesSampleRate: 0.1, // Amostra 10% das transações em produção
  profilesSampleRate: 0.1, // Amostra 10% dos perfis em produção
  
  // Configuração de rastreamento de desempenho
  _experiments: {
    // Habilita o profiling no servidor
    profiler: {
      enable: true,
    },
    // Habilita o rastreamento de operações assíncronas
    enableInteractions: true,
  },
  
  // Habilita a captura de erros de console
  attachStacktrace: true,
  
  // Filtra eventos de erro comuns que não são úteis
  beforeSend(event, hint) {
    const error = hint.originalException;
    
    // Ignora erros de validação
    if (error && error.statusCode === 400) {
      return null;
    }
    
    // Ignora erros de autenticação/autorização
    if (error && (error.statusCode === 401 || error.statusCode === 403)) {
      return null;
    }
    
    return event;
  },
  
  // Configura o servidor
  serverName: process.env.SENTRY_SERVER_NAME || 'aprovaja-server',
  
  // Configuração de integrações
  integrations: [
    // Habilita o profiling de CPU
    nodeProfilingIntegration(),
    
    // Habilita o rastreamento de requisições HTTP
    new Sentry.Integrations.Http({ tracing: true }),
    
    // Habilita o rastreamento de operações assíncronas
    new Sentry.Integrations.OnUncaughtException({
      onFatalError: (err) => {
        // Permite que o processo seja finalizado pelo manipulador de erros do Node.js
        if (err.name === 'SentryError') {
          console.log(err);
        } else {
          Sentry.captureException(err);
          process.exit(1);
        }
      },
    }),
    
    // Habilita o rastreamento de rejeições de promessas não tratadas
    new Sentry.Integrations.OnUnhandledRejection({
      mode: 'warn',
    }),
  ],
  
  // Configuração de release
  release: process.env.APP_VERSION || '0.1.0',
  
  // Configuração de debug (desativado em produção)
  debug: process.env.NODE_ENV !== 'production',
  
  // Configuração de traces
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/api\.seu-dominio\.com/,
  ],
  
  // Configuração de breadcrumbs
  breadcrumbs: {
    console: true,
    http: true,
  },
  
  // Configuração de amostragem de transações
  transactionSampler: (samplingContext) => {
    // Exemplo: Amostra todas as transações com erro
    if (samplingContext.transactionContext.status === 'internal_error') {
      return 1.0;
    }
    
    // Exemplo: Amostra transações lentas
    if (samplingContext.transactionContext.endTimestamp - samplingContext.transactionContext.startTimestamp > 1000) {
      return 1.0;
    }
    
    // Amostra 10% das demais transações
    return 0.1;
  },
});

// Exporta o wrapper do Sentry para uso com Next.js
export { Sentry };
