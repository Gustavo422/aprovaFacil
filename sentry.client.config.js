// Este arquivo contém a configuração do Sentry para o lado do cliente
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Configuração de ambiente
  environment: process.env.NODE_ENV || 'development',
  
  // Monitoramento de desempenho
  tracesSampleRate: 0.1, // Amostra 10% das transações em produção
  profilesSampleRate: 0.1, // Amostra 10% dos perfis em produção
  
  // Configuração de replay de sessão
  replaysSessionSampleRate: 0.1, // Grava 10% das sessões
  replaysOnErrorSampleRate: 1.0, // Grava 100% das sessões com erros
  
  // Configuração de rastreamento de desempenho
  _experiments: {
    // Habilita o rastreamento de interações do usuário
    enableInteractions: true,
    // Habilita o rastreamento de Web Vitals
    enableWebVitals: true,
  },
  
  // Habilita a captura de erros de console
  attachStacktrace: true,
  
  // Filtra eventos de erro comuns que não são úteis
  beforeSend(event, hint) {
    const error = hint.originalException;
    
    // Ignora erros de conexão/offline
    if (error && error.message && (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('Network request failed')
    )) {
      return null;
    }
    
    // Ignora erros de chunk loading (provavelmente devido a atualizações)
    if (error && error.message && /Loading chunk [\d]+ failed/.test(error.message)) {
      window.location.reload();
      return null;
    }
    
    return event;
  },
  
  // Configuração de integrações
  integrations: [
    // Replay de sessão
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: true,
      networkDetailAllowUrls: [
        window.location.origin,
        // Adicione aqui outras URLs de API que deseja monitorar
      ],
      networkCaptureBodies: true,
    }),
    
    // Rastreamento de desempenho do navegador
    new Sentry.BrowserTracing({
      // Rastreia navegação entre páginas
      routingInstrumentation: Sentry.vueRouterInstrumentation(),
      // Rastreia requisições de API
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/api\.seu-dominio\.com\/api/,
      ],
    }),
    
    // Monitoramento de Web Vitals
    new Sentry.BrowserProfilingIntegration(),
  ],
  
  // Configuração de release
  release: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  
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
    dom: {
      enabled: true,
    },
    fetch: true,
    xhr: true,
    location: true,
  },
});
