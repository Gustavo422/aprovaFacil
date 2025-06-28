/// <reference types="cypress" />

describe('Página de perfil do usuário', () => {
  // Dados de teste
  const userStats = {
    total_questions_answered: 150,
    correct_answers: 120,
    average_score: 80.5,
    total_study_time: 3600, // em segundos
    last_active: new Date().toISOString()
  };

  beforeEach(() => {
    // Faz login antes de cada teste
    cy.login();
    
    // Intercepta a requisição de busca das estatísticas do usuário
    cy.intercept('GET', '/api/user/stats', {
      statusCode: 200,
      body: {
        success: true,
        data: userStats
      }
    }).as('getUserStats');

    // Visita a página de perfil
    cy.visit('/profile');
    
    // Aguarda o carregamento das estatísticas
    cy.wait('@getUserStats');
  });

  it('deve exibir as estatísticas do usuário corretamente', () => {
    // Verifica se o título da página está correto
    cy.get('h1').should('contain', 'Meu Perfil');
    
    // Verifica se as estatísticas são exibidas corretamente
    cy.get('[data-testid="total-questions"]')
      .should('contain', userStats.total_questions_answered);
      
    cy.get('[data-testid="correct-answers"]')
      .should('contain', userStats.correct_answers);
      
    cy.get('[data-testid="average-score"]')
      .should('contain', `${userStats.average_score}%`);
      
    // Verifica o tempo de estudo formatado (1h 0m)
    cy.get('[data-testid="study-time"]')
      .should('contain', '1h 0m');
      
    // Verifica a data do último acesso formatada
    cy.get('[data-testid="last-active"]')
      .should('be.visible');
  });

  it('deve permitir atualizar as informações do perfil', () => {
    const updatedName = 'Novo Nome';
    const updatedEmail = 'novoemail@exemplo.com';
    
    // Intercepta a requisição de atualização do perfil
    cy.intercept('PUT', '/api/user/profile', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          name: updatedName,
          email: updatedEmail
        }
      }
    }).as('updateProfile');
    
    // Clica no botão de editar perfil
    cy.get('button').contains('Editar Perfil').click();
    
    // Preenche o formulário
    cy.get('input[name="name"]').clear().type(updatedName);
    cy.get('input[name="email"]').clear().type(updatedEmail);
    
    // Submete o formulário
    cy.get('form').submit();
    
    // Verifica se a requisição foi feita corretamente
    cy.wait('@updateProfile').its('request.body').should('deep.equal', {
      name: updatedName,
      email: updatedEmail
    });
    
    // Verifica se a mensagem de sucesso é exibida
    cy.get('.alert-success').should('be.visible')
      .and('contain', 'Perfil atualizado com sucesso');
      
    // Verifica se as informações foram atualizadas na interface
    cy.get('h2').should('contain', updatedName);
    cy.contains(updatedEmail).should('be.visible');
  });

  it('deve exibir mensagem de erro ao falhar ao carregar as estatísticas', () => {
    // Intercepta a requisição para retornar erro
    cy.intercept('GET', '/api/user/stats', {
      statusCode: 500,
      body: {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao carregar estatísticas'
        }
      }
    }).as('getUserStatsError');
    
    // Recarrega a página para forçar um novo carregamento
    cy.reload();
    
    // Aguarda a requisição de erro
    cy.wait('@getUserStatsError');
    
    // Verifica se a mensagem de erro é exibida
    cy.get('.alert-destructive').should('be.visible')
      .and('contain', 'Erro ao carregar estatísticas');
      
    // Verifica se o botão de tentar novamente está visível
    cy.get('button').contains('Tentar novamente').should('be.visible');
  });

  it('deve permitir fazer logout', () => {
    // Intercepta a requisição de logout
    cy.intercept('POST', '/api/auth/logout', {
      statusCode: 200,
      body: { success: true }
    }).as('logout');
    
    // Clica no botão de logout
    cy.get('button').contains('Sair').click();
    
    // Confirma o logout no diálogo de confirmação
    cy.get('button').contains('Confirmar').click();
    
    // Verifica se a requisição de logout foi feita
    cy.wait('@logout');
    
    // Verifica se foi redirecionado para a página de login
    cy.url().should('include', '/auth/login');
  });
});
