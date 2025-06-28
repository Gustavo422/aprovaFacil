/// <reference types="cypress" />

describe('Fluxo de redefinição de senha', () => {
  // Dados de teste
  const testToken = 'valid-reset-token-123';
  const newPassword = 'NovaSenha123@';
  const invalidToken = 'invalid-token';
  const expiredToken = 'expired-token-123';

  // Função para visitar a página de redefinição de senha com um token
  const visitResetPasswordPage = (token) => {
    cy.visit(`/auth/reset-password?token=${token}`);
    cy.get('h1').should('contain', 'Redefinir senha');
  };

  it('deve exibir mensagem de erro para token inválido', () => {
    // Visita a página com token inválido
    visitResetPasswordPage(invalidToken);
    
    // Verifica se a mensagem de erro é exibida
    cy.get('.alert-destructive').should('be.visible')
      .and('contain', 'Link inválido ou expirado');
    
    // Verifica se o formulário não está visível
    cy.get('form').should('not.exist');
    
    // Verifica se o link para solicitar novo e-mail está visível
    cy.get('a[href="/auth/forgot-password"]')
      .should('exist')
      .and('contain', 'Solicitar novo link');
  });

  it('deve permitir redefinir a senha com token válido', () => {
    // Intercepta a requisição de redefinição de senha
    cy.intercept('POST', '/api/auth/reset-password', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Senha redefinida com sucesso'
      }
    }).as('resetPasswordRequest');

    // Visita a página com token válido
    visitResetPasswordPage(testToken);
    
    // Preenche o formulário com nova senha
    cy.get('input[name="password"]').type(newPassword);
    cy.get('input[name="confirmPassword"]').type(newPassword);
    
    // Submete o formulário
    cy.get('button[type="submit"]').click();

    // Verifica se a requisição foi feita corretamente
    cy.wait('@resetPasswordRequest').its('request.body').should('deep.equal', {
      token: testToken,
      password: newPassword,
      confirmPassword: newPassword
    });

    // Verifica se a mensagem de sucesso é exibida
    cy.get('.alert-success').should('be.visible')
      .and('contain', 'Senha redefinida com sucesso');
    
    // Verifica se o botão para fazer login está visível
    cy.get('a[href="/auth/login"]')
      .should('exist')
      .and('contain', 'Fazer login');
  });

  it('deve validar o formulário de redefinição de senha', () => {
    visitResetPasswordPage(testToken);
    
    // Tenta submeter o formulário vazio
    cy.get('button[type="submit"]').click();
    
    // Verifica mensagens de erro para campos obrigatórios
    cy.contains('A senha é obrigatória').should('be.visible');
    cy.contains('Confirme sua senha').should('be.visible');
    
    // Preenche com senhas que não conferem
    cy.get('input[name="password"]').type('Senha123');
    cy.get('input[name="confirmPassword"]').type('Senha456');
    
    // Verifica mensagem de erro para senhas diferentes
    cy.contains('As senhas não conferem').should('be.visible');
    
    // Preenche com senha fraca
    cy.get('input[name="password"]').clear().type('senhafraca');
    cy.get('input[name="confirmPassword"]').clear().type('senhafraca');
    
    // Verifica mensagem de erro para senha fraca
    cy.contains('A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial').should('be.visible');
  });

  it('deve lidar com erro ao redefinir senha com token expirado', () => {
    // Intercepta a requisição de redefinição de senha para retornar erro de token expirado
    cy.intercept('POST', '/api/auth/reset-password', {
      statusCode: 400,
      body: {
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'O link de redefinição de senha expirou'
        }
      }
    }).as('resetPasswordRequest');

    // Visita a página com token expirado
    visitResetPasswordPage(expiredToken);
    
    // Preenche o formulário
    cy.get('input[name="password"]').type(newPassword);
    cy.get('input[name="confirmPassword"]').type(newPassword);
    
    // Submete o formulário
    cy.get('button[type="submit"]').click();

    // Verifica se a mensagem de erro é exibida
    cy.get('.alert-destructive').should('be.visible')
      .and('contain', 'O link de redefinição de senha expirou');
    
    // Verifica se o link para solicitar novo e-mail está visível
    cy.get('a[href="/auth/forgot-password"]')
      .should('exist')
      .and('contain', 'Solicitar novo link');
  });
});
