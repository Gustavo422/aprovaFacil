import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config({ path: '.env.local' });

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    async setupNodeEvents(on, config) {
      // Configuração para relatórios
      const mochawesomeReporter = await import('cypress-mochawesome-reporter/plugin');
      mochawesomeReporter.default(on);
      
      // Configuração para testes de API
      config.env = {
        ...config.env,
        API_URL: 'http://localhost:3000/api',
        // Adicione outras variáveis de ambiente conforme necessário
      };
      
      return config;
    },
  },
  env: {
    // Variáveis de ambiente adicionais podem ser adicionadas aqui
  },
});

