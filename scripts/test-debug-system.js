#!/usr/bin/env node

const { spawn } = require('child_process');
const axios = require('axios');

console.log('🧪 Testando Sistema de Debug do AprovaFácil...\n');

// Configurações
const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

// Função para aguardar
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para testar se o servidor está rodando
async function checkServer(url, name) {
  try {
    const response = await axios.get(`${url}/api/health`, { timeout: 5000 });
    console.log(`✅ ${name} está rodando em ${url}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} não está rodando em ${url}`);
    return false;
  }
}

// Função para fazer requisições de teste
async function testRequests() {
  console.log('\n📡 Fazendo requisições de teste...\n');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      url: `${BACKEND_URL}/api/health`,
      expectedStatus: 200
    },
    {
      name: 'Login (deve falhar sem credenciais)',
      method: 'POST',
      url: `${BACKEND_URL}/api/auth/login`,
      data: { email: 'test@example.com', password: 'test123' },
      expectedStatus: 400
    },
    {
      name: 'Usuários (deve falhar sem autenticação)',
      method: 'GET',
      url: `${BACKEND_URL}/api/user`,
      expectedStatus: 401
    }
  ];

  for (const test of tests) {
    try {
      console.log(`🔄 Testando: ${test.name}`);
      
      const config = {
        method: test.method,
        url: test.url,
        timeout: 10000
      };

      if (test.data) {
        config.data = test.data;
      }

      const response = await axios(config);
      
      console.log(`✅ ${test.name}: ${response.status} ${response.statusText}`);
      
      if (response.data) {
        console.log(`   Resposta: ${JSON.stringify(response.data).substring(0, 100)}...`);
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`⚠️ ${test.name}: ${error.response.status} ${error.response.statusText}`);
        
        if (error.response.data) {
          console.log(`   Erro: ${JSON.stringify(error.response.data).substring(0, 100)}...`);
        }
      } else {
        console.log(`❌ ${test.name}: ${error.message}`);
      }
    }
    
    await wait(1000); // Aguardar 1 segundo entre testes
  }
}

// Função principal
async function main() {
  console.log('🔍 Verificando se os servidores estão rodando...\n');
  
  const backendRunning = await checkServer(BACKEND_URL, 'Backend');
  const frontendRunning = await checkServer(FRONTEND_URL, 'Frontend');
  
  if (!backendRunning) {
    console.log('\n❌ Backend não está rodando. Execute primeiro:');
    console.log('   cd backend && npm run dev:debug');
    process.exit(1);
  }
  
  if (!frontendRunning) {
    console.log('\n⚠️ Frontend não está rodando, mas continuando com testes do backend...');
  }
  
  console.log('\n⏳ Aguardando 3 segundos para estabilizar...');
  await wait(3000);
  
  // Fazer requisições de teste
  await testRequests();
  
  console.log('\n🎉 Teste concluído!');
  console.log('\n📋 Verifique os logs acima para ver:');
  console.log('   • Requisições HTTP do backend');
  console.log('   • Chamadas ao Supabase');
  console.log('   • Respostas e erros');
  console.log('   • Códigos de status (200, 400, 401, etc.)');
  console.log('   • Métodos HTTP (GET, POST, etc.)');
  console.log('   • Duração das requisições');
  
  console.log('\n🔍 Para ver logs do frontend:');
  console.log('   1. Abra http://localhost:3000?debug=true');
  console.log('   2. Pressione F12 para abrir o console');
  console.log('   3. Faça algumas ações na aplicação');
  console.log('   4. Observe os logs no console do navegador');
}

// Executar teste
main().catch(error => {
  console.error('\n💥 Erro durante o teste:', error.message);
  process.exit(1);
}); 