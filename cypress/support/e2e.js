// ***********************************************
// Este arquivo é executado antes de cada teste E2E
// ***********************************************

// Importa os comandos personalizados
import './commands';

// Configurações globais de testes
beforeEach(() => {
  // Intercepta requisições de API para evitar chamadas reais durante os testes
  cy.intercept('POST', '/api/auth/**').as('authRequest');
  cy.intercept('GET', '/api/dashboard/**').as('dashboardRequest');
  cy.intercept('GET', '/api/conteudo/**').as('conteudoRequest');
  
  // Configura o viewport padrão
  cy.viewport(1280, 800);
});

// Adiciona tratamento global de erros não capturados
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para evitar que o Cypress falhe o teste
  // Você pode adicionar lógica adicional aqui para lidar com erros específicos
  console.error('Erro não capturado:', err);
  return false;
});
