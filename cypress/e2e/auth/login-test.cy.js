/// <reference types="cypress" />

describe('Teste de Login', () => {
  beforeEach(() => {
    // Limpa os cookies e localStorage antes de cada teste
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Visita a página de login diretamente
    cy.visit('/login');
    
    // Verifica se estamos na página de login
    cy.url().should('include', '/login');
    cy.get('h1').should('contain', 'Acesse sua conta');
  });

  it('Deve fazer login com sucesso', () => {
    // Faz login e verifica se a requisição foi bem-sucedida
    cy.login('demourasilvagustavo@gmail.com', '153060@Aa');
    
    // Verifica se foi redirecionado para a página inicial após o login
    // Se sua aplicação redireciona para outra rota, ajuste aqui
    cy.url().should('not.include', '/login');
    
    // Verifica se há algum cookie de sessão
    cy.getCookies().should('have.length.gt', 0);
    
    // Verifica se os dados do usuário estão no localStorage
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user') || 'null');
      expect(userData).to.be.an('object');
      expect(userData.user).to.have.property('email', 'demourasilvagustavo@gmail.com');
    });
    
    // Verifica se o nome do usuário está visível na página
    // Ajuste o seletor conforme sua aplicação
    cy.get('[data-testid="user-name"]')
      .should('be.visible')
      .and('contain', 'Gustavo'); // Ajuste para o nome esperado
  });
  
  it('Deve mostrar erro com credenciais inválidas', () => {
    // Tenta fazer login com credenciais inválidas
    cy.login('email@invalido.com', 'senhainvalida');
    
    // Verifica se permanece na página de login
    cy.url().should('include', '/login');
    
    // Verifica se a mensagem de erro é exibida
    // Ajuste o seletor conforme sua aplicação
    cy.get('[role="alert"]')
      .should('be.visible')
      .and('contain', 'Credenciais inválidas');
  });
});
