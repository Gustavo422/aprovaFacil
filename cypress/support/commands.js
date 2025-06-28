// ***********************************************
// Este arquivo contém comandos personalizados do Cypress
//
// Para mais exemplos de comandos personalizados veja:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- Login de Comando --
// Este comando faz login na aplicação
//
// cy.login()
//   - email: string - Email do usuário
//   - password: string - Senha do usuário
//   - options: object - Opções adicionais
//     - cacheSession: boolean - Se deve armazenar a sessão (padrão: true)
//     - failOnStatusCode: boolean - Se deve falhar em códigos de status inválidos (padrão: true)
//
// Exemplo de uso:
// cy.login('usuario@exemplo.com', 'senha123')

Cypress.Commands.add('login', (email, password, options = {}) => {
  const { cacheSession = true } = options;
  
  const login = () => {
    // Garante que o email seja uma string para usar como chave de sessão
    const sessionId = `session-${email}`;
    
    cy.session(
      sessionId,
      () => {
        // 1. Primeiro, fazemos um log da requisição que será enviada
        cy.log('Enviando requisição de login para:', '/api/auth/login');
        cy.log('Email:', email);
        
        // 2. Faz a requisição de login
        cy.request({
          method: 'POST',
          url: '/api/auth/login',
          body: { email, password },
          failOnStatusCode: false,
          log: true
        }).then((response) => {
          // 3. Log detalhado da resposta
          cy.log('Resposta completa da API:', JSON.stringify({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            body: response.body
          }, null, 2));
          
          // 4. Se o status não for 200, lança um erro
          if (response.status !== 200) {
            const errorMessage = `Erro na requisição: ${response.status} - ${response.statusText}\n` +
              `Resposta: ${JSON.stringify(response.body, null, 2)}`;
            cy.log('❌ ' + errorMessage);
            throw new Error(errorMessage);
          }
          
          // 5. Verifica se a resposta tem o formato esperado
          const { body } = response;
          
          if (!body || !body.success || !body.user) {
            const errorMessage = 'Resposta da API em formato inesperado. ' +
              `Resposta: ${JSON.stringify(body, null, 2)}`;
            cy.log('❌ ' + errorMessage);
            throw new Error(errorMessage);
          }
          
          // 6. Armazena os dados do usuário no localStorage
          const userData = {
            user: body.user,
            session: body.session || { expiresAt: Math.floor(Date.now() / 1000) + 3600 } // 1 hora de expiração padrão
          };
          
          cy.log('Dados do usuário armazenados:', JSON.stringify(userData, null, 2));
          window.localStorage.setItem('user', JSON.stringify(userData));
          
          // 7. Verifica se há cookies de sessão
          cy.getCookies().then(cookies => {
            const sessionCookies = cookies.filter(cookie => 
              cookie.name.includes('session') || 
              cookie.name.includes('auth')
            );
            
            if (sessionCookies.length === 0) {
              cy.log('⚠️  Nenhum cookie de sessão encontrado na resposta');
            } else {
              cy.log('Cookies de sessão encontrados:', sessionCookies);
            }
          });
          
          // 8. Retorna os dados do usuário para validação usando cy.wrap
          // para garantir que a Promise seja tratada corretamente
          return cy.wrap(userData);
        });
      },
      {
        validate: () => {
          // Usa cy.then() para garantir que o código seja executado no contexto do Cypress
          return cy.then(() => {
            // Tenta validar a sessão verificando os dados do usuário no localStorage
            const userData = JSON.parse(window.localStorage.getItem('user') || 'null');
            
            // Log para debug
            cy.log('Dados do usuário armazenados:', userData);
            
            if (!userData || !userData.user) {
              throw new Error('Nenhum dado de usuário encontrado no localStorage');
            }
            
            // Verifica se a sessão expirou
            const now = Math.floor(Date.now() / 1000);
            const expiresAt = userData.session?.expiresAt || 0;
            
            if (expiresAt && now > expiresAt) {
              throw new Error('Sessão expirada');
            }
            
            // Verifica se há cookies de sessão
            return cy.getCookies().then(cookies => {
              const hasSessionCookie = cookies.some(cookie => 
                cookie.name.includes('session') || 
                cookie.name.includes('auth')
              );
              
              if (!hasSessionCookie) {
                cy.log('⚠️  Nenhum cookie de sessão ativo encontrado');
              }
              
              return true;
            });
          });
        },
      }
    );
  };

  // Se não for para usar cache, limpa tudo antes
  if (!cacheSession) {
    cy.clearCookies();
    cy.clearLocalStorage();
  }
  
  // Executa o login
  return login();
});

// -- Logout de Comando --
// Este comando faz logout da aplicação
//
// cy.logout()
//
// Exemplo de uso:
// cy.logout()


Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('supabase.auth.token');
  });
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit('/auth/login');
});

// -- Comando para verificar se o usuário está autenticado --
// Este comando verifica se o usuário está autenticado
//
// cy.isAuthenticated()
//
// Exemplo de uso:
// cy.isAuthenticated().should('be.true')


Cypress.Commands.add('isAuthenticated', () => {
  return cy.window().then((win) => {
    const token = JSON.parse(win.localStorage.getItem('supabase.auth.token') || 'null');
    return token && token.access_token ? true : false;
  });
});
