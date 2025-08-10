#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

function run(command, cwd, name) {
  console.log(`\n🔄 Iniciando ${name}...`);
  console.log(`Comando: ${command}`);
  console.log(`Diretório: ${cwd}`);

  const child = exec(command, { cwd, env: { ...process.env, NODE_ENV: 'development' } }, (error) => {
    if (error) {
      console.error(`❌ Erro ao executar ${name}:`, error.message);
      process.exit(1);
    }
  });

  if (child.stdout) child.stdout.pipe(process.stdout);
  if (child.stderr) child.stderr.pipe(process.stderr);

  return child;
}

const projectRoot = path.resolve(__dirname, '..');
const backendDir = path.join(projectRoot, 'backend');
const frontendDir = path.join(projectRoot, 'frontend');

// Iniciar backend e frontend em paralelo
const backend = run('npm run dev', backendDir, 'Backend');
const frontend = run('npm run dev:debug', frontendDir, 'Frontend');

process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando aplicações...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Encerrando aplicações...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});