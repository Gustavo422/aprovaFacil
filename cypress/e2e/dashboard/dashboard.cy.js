/// <reference types="cypress" />

describe('Dashboard', () => {
  beforeEach(() => {
    // Faz login antes de cada teste
    cy.login(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'));
    cy.visit('/dashboard');
    // Aguarda o carregamento do dashboard
    cy.get('[data-testid="dashboard-loading"]', { timeout: 10000 }).should('not.exist');
  });

  it('Deve exibir o dashboard corretamente', () => {
    // Verifica se os elementos principais do dashboard estão visíveis
    cy.get('h1').should('contain', 'Dashboard');
    
    // Verifica se os cards de estatísticas estão visíveis
    cy.get('[data-testid="stats-cards"]').should('be.visible');
    
    // Verifica se o gráfico de progresso está visível
    cy.get('[data-testid="progress-chart"]').should('be.visible');
    
    // Verifica se a lista de atividades recentes está visível
    cy.get('[data-testid="recent-activities"]').should('be.visible');
  });

  it('Deve carregar as estatísticas do usuário', () => {
    // Verifica se as estatísticas foram carregadas
    cy.get('[data-testid="total-studied"]').should('be.visible');
    cy.get('[data-testid="correct-answers"]').should('be.visible');
    cy.get('[data-testid="study-streak"]').should('be.visible');
  });

  it('Deve navegar para a página de conteúdo', () => {
    // Clica no link para a página de conteúdo
    cy.get('a[href="/conteudo"]').first().click();
    
    // Verifica se a navegação foi bem-sucedida
    cy.url().should('include', '/conteudo');
    cy.get('h1').should('contain', 'Conteúdo');
  });

  it('Deve exibir mensagem de boas-vindas personalizada', () => {
    // Verifica se a mensagem de boas-vindas contém o nome do usuário
    cy.get('[data-testid="welcome-message"]')
      .should('be.visible')
      .and('contain', 'Bem-vindo');
  });
});
