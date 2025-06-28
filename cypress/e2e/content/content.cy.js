/// <reference types="cypress" />

describe('Página de Conteúdo', () => {
  beforeEach(() => {
    // Faz login antes de cada teste
    cy.login(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'));
    cy.visit('/conteudo');
    // Aguarda o carregamento do conteúdo
    cy.get('[data-testid="content-loading"]', { timeout: 10000 }).should('not.exist');
  });

  it('Deve exibir a lista de conteúdos', () => {
    // Verifica se a lista de conteúdos está visível
    cy.get('[data-testid="content-list"]').should('be.visible');
    
    // Verifica se existem itens na lista
    cy.get('[data-testid^="content-item-"]').should('have.length.greaterThan', 0);
  });

  it('Deve filtrar conteúdos por categoria', () => {
    // Seleciona uma categoria no filtro
    cy.get('[data-testid="category-filter"]').click();
    cy.get('[data-testid="category-option"]').first().click();
    
    // Verifica se a URL foi atualizada com o filtro
    cy.url().should('include', 'categoria=');
    
    // Verifica se a lista foi atualizada
    cy.get('[data-testid^="content-item-"]').should('exist');
  });

  it('Deve permitir buscar por conteúdo', () => {
    // Digita um termo de busca
    const searchTerm = 'matemática';
    cy.get('[data-testid="search-input"]').type(searchTerm);
    
    // Aguarda a busca ser concluída
    cy.get('[data-testid="content-loading"]').should('not.exist');
    
    // Verifica se os resultados contêm o termo de busca
    cy.get('[data-testid^="content-item-"]').each(($item) => {
      cy.wrap($item).should('contain', searchTerm);
    });
  });

  it('Deve navegar para os detalhes do conteúdo', () => {
    // Clica no primeiro item da lista
    cy.get('[data-testid^="content-item-"]').first().click();
    
    // Verifica se a navegação foi bem-sucedida
    cy.url().should('match', /\/conteudo\/[a-zA-Z0-9-]+/);
    cy.get('[data-testid="content-detail"]').should('be.visible');
  });

  it('Deve exibir mensagem quando não houver conteúdo', () => {
    // Simula uma busca sem resultados
    cy.intercept('GET', '/api/conteudo**', { statusCode: 200, body: [] });
    cy.visit('/conteudo?q=termo-que-nao-existe');
    
    // Verifica se a mensagem de conteúdo não encontrado é exibida
    cy.get('[data-testid="no-content-message"]')
      .should('be.visible')
      .and('contain', 'Nenhum conteúdo encontrado');
  });
});
