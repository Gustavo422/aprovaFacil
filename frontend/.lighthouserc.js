// Configuração do Lighthouse CI para testes de desempenho
module.exports = {
  ci: {
    collect: {
      // Configuração da coleta de métricas
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 60000, // Aumentado para 60 segundos
      url: [
        'http://localhost:3000',
        'http://localhost:3000/login',
        'http://localhost:3000/dashboard',
      ],
      // Número de execuções para calcular a média
      numberOfRuns: 1, // Reduzido para 1 para testes locais
      // Configuração do navegador
      chromeFlags: '--no-sandbox --headless --disable-gpu --disable-dev-shm-usage',
      settings: {
        // Configurações adicionais
        output: ['html', 'json'],
        outputPath: './lighthouse-reports',
        logLevel: 'info',
      },
    },
    assert: {
      // Limiares de desempenho (0-1)
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }], // Limiar reduzido para testes locais
        'categories:accessibility': ['warn', { minScore: 0.7 }],
        'categories:best-practices': ['warn', { minScore: 0.7 }],
        'categories:seo': ['warn', { minScore: 0.7 }],
        'categories:pwa': ['warn', { minScore: 0.3 }],
      },
    },
    upload: {
      // Configuração para upload dos relatórios
      target: 'filesystem',
      outputDir: './lighthouse-reports',
      reportFilenamePattern: '%%HOSTNAME%%-%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
