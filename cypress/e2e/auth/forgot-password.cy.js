/// <reference types="cypress" />

describe('Fluxo de recuperação de senha', () => {
  // Dados de teste
  const testEmail = Cypress.env('TEST_EMAIL') || 'test@example.com';
  const invalidEmail = 'invalid-email';
  const nonExistentEmail = 'nonexistent@example.com';

  beforeEach(() => {
    // Visita a página de recuperação de senha antes de cada teste
    cy.visit('/auth/forgot-password');
    
    // Verifica se a página de recuperação de senha foi carregada corretamente
    cy.get('h1').should('contain', 'Esqueceu sua senha?');
    cy.get('form').should('exist');
  });

  it('deve exibir mensagem de sucesso ao enviar e-mail com e-mail válido', () => {
    // Intercepta a requisição de recuperação de senha
    cy.intercept('POST', '/api/auth/forgot-password', {
      statusCode: 200,
      body: {
        success: true,
        message: 'E-mail de recuperação enviado com sucesso'
      }
    }).as('forgotPasswordRequest');

    // Preenche o formulário com e-mail válido
    cy.get('input[name="email"]').type(testEmail);
    
    // Submete o formulário
    cy.get('button[type="submit"]').click();

    // Verifica se a requisição foi feita corretamente
    cy.wait('@forgotPasswordRequest').its('request.body').should('deep.equal', {
      email: testEmail
    });

    // Verifica se a mensagem de sucesso é exibida
    cy.get('.alert-success').should('be.visible')
      .and('contain', 'E-mail de recuperação enviado');
    
    // Verifica se o botão de voltar para o login está visível
    cy.get('a[href="/auth/login"]').should('exist')
      .and('contain', 'Voltar para o login');
  });

  it('deve exibir mensagem de erro ao enviar e-mail inválido', () => {
    // Preenche o formulário com e-mail inválido
    cy.get('input[name="email"]').type(invalidEmail);
    
    // Tenta submeter o formulário
    cy.get('button[type="submit"]').click();

    // Verifica se a mensagem de erro é exibida
    cy.get('.text-destructive').should('be.visible')
      .and('contain', 'Por favor, insira um e-mail válido');

    // Verifica se o botão está desabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('deve exibir mensagem de erro quando o e-mail não existe', () => {
    // Intercepta a requisição de recuperação de senha para retornar erro
    cy.intercept('POST', '/api/auth/forgot-password', {
      statusCode: 400,
      body: {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Não encontramos uma conta com este e-mail'
        }
      }
    }).as('forgotPasswordRequest');

    // Preenche o formulário com e-mail que não existe
    cy.get('input[name="email"]').type(nonExistentEmail);
    
    // Submete o formulário
    cy.get('button[type="submit"]').click();

    // Verifica se a requisição foi feita corretamente
    cy.wait('@forgotPasswordRequest');

    // Verifica se a mensagem de erro é exibida
    cy.get('.alert-destructive').should('be.visible')
      .and('contain', 'Não encontramos uma conta com este e-mail');
  });

  it('deve redirecionar para a página de login ao clicar no link', () => {
    // Clica no link para voltar ao login
    cy.get('a[href="/auth/login"]').click();
    
    // Verifica se foi redirecionado para a página de login
    cy.url().should('include', '/auth/login');
    cy.get('h1').should('contain', 'Acesse sua conta');
  });
});
