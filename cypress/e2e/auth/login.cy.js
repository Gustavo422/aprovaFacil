/// <reference types="cypress" />

describe('Testes de Autenticação', () => {
  beforeEach(() => {
    // Visita a página de login antes de cada teste
    cy.visit('/auth/login');
  });

  it('Deve exibir a página de login corretamente', () => {
    // Verifica se os elementos principais estão visíveis
    cy.get('h1').should('contain', 'Acesse sua conta');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Deve exibir mensagem de erro com credenciais inválidas', () => {
    // Preenche o formulário com credenciais inválidas
    cy.get('input[name="email"]').type('usuario@invalido.com');
    cy.get('input[name="password"]').type('senhainvalida');
    
    // Submete o formulário
    cy.get('button[type="submit"]').click();
    
    // Verifica se a mensagem de erro é exibida
    cy.get('[role="alert"]').should('be.visible')
      .and('contain', 'Credenciais inválidas');
  });
});
