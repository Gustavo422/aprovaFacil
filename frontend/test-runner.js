// Script personalizado para executar testes com configuração correta
const { spawn } = require('child_process');

// Configura o ambiente para testes
process.env.NODE_ENV = 'test';

// Executa o Jest com as opções desejadas
const jest = spawn('npx', ['jest', '--runInBand', '--verbose'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

// Manipula a saída do processo
jest.on('close', (code) => {
  process.exit(code);
});

// Manipula erros
ejest.on('error', (error) => {
  console.error('Erro ao executar os testes:', error);
  process.exit(1);
});
