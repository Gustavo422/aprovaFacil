#!/usr/bin/env node

/**
 * 🔍 ANÁLISE FINAL CUIDADOSA - FASE 4
 * 
 * Este script remove APENAS código realmente morto
 * Mantém código que pode ser útil mas mal implementado
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`🔍 ${title}`, 'cyan');
  console.log('='.repeat(60));
}

function removeFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      log(`✅ Removido: ${filePath}`, 'green');
      return true;
    } else {
      log(`⚠️  Não encontrado: ${filePath}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Erro ao remover ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function removeDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      log(`✅ Removido diretório: ${dirPath}`, 'green');
      return true;
    } else {
      log(`⚠️  Diretório não encontrado: ${dirPath}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Erro ao remover diretório ${dirPath}: ${error.message}`, 'red');
    return false;
  }
}

// Estatísticas
let stats = {
  filesRemoved: 0,
  directoriesRemoved: 0,
  dependenciesRemoved: 0,
  errors: 0
};

logSection('ANÁLISE FINAL CUIDADOSA - APENAS CÓDIGO REALMENTE MORTO');

// FASE 1: REMOVER APENAS ARQUIVOS REALMENTE MORTOS
logSection('FASE 1: REMOÇÃO CUIDADOSA');

// 1.1 Arquivos de teste órfãos (que não testam nada existente)
log('\n🧪 Removendo testes órfãos...', 'blue');
const orphanTests = [
  'tests/unit/frontend/utils/debugger.test.ts', // Testa arquivo que não existe
  'tests/unit/frontend/utils/example.test.tsx', // Teste de exemplo
  'tests/integration/api/route.test.ts', // Testa arquivo que não existe
  'tests/integration/concurso-preference.test.tsx', // Testa componentes que não existem
  'tests/integration/error-display.test.tsx', // Testa componentes que não existem
  'tests/integration/database/monitor.test.ts', // Testa arquivos que não existem
  'tests/unit/backend/services/connectionLogService.test.ts', // Testa serviços removidos
  'tests/unit/backend/services/monitoringService.test.ts', // Testa serviços removidos
  'tests/unit/backend/services/sessionService.test.ts', // Testa serviços removidos
  'tests/unit/frontend/components/auth-context.test.tsx', // Testa componentes que não existem
  'tests/unit/frontend/components/login-form.test.tsx', // Testa componentes que não existem
  'tests/unit/frontend/components/protected-route.test.tsx', // Testa componentes que não existem
  'tests/unit/frontend/utils/cache-*.test.ts' // Testa cache removido
];

orphanTests.forEach(file => {
  if (removeFile(file)) {
    stats.filesRemoved++;
  } else {
    stats.errors++;
  }
});

// 1.2 Arquivos de configuração órfãos
log('\n⚙️ Removendo configurações órfãs restantes...', 'blue');
const remainingConfigFiles = [
  'frontend/config/debug.ts', // Debug removido
  'frontend/middleware.ts', // Middleware órfão
  'frontend/manual-test-concurso-preference.js', // Teste manual
  'scripts/cleanup-aggressive.cjs' // Script temporário
];

remainingConfigFiles.forEach(file => {
  if (removeFile(file)) {
    stats.filesRemoved++;
  } else {
    stats.errors++;
  }
});

// 1.3 Arquivos de exemplo órfãos
log('\n🎯 Removendo exemplos órfãos...', 'blue');
const orphanExamples = [
  'backend/src/examples/protected-routes.ts',
  'frontend/app/examples/admin-only/page.tsx',
  'frontend/app/examples/protected/page.tsx',
  'frontend/features/auth/components/examples/protected-page-example.tsx'
];

orphanExamples.forEach(file => {
  if (removeFile(file)) {
    stats.filesRemoved++;
  } else {
    stats.errors++;
  }
});

// FASE 2: REMOVER DEPENDÊNCIAS REALMENTE NÃO UTILIZADAS
logSection('FASE 2: DEPENDÊNCIAS REALMENTE MORTAS');

// Apenas dependências que sabemos que não são utilizadas
log('\n📦 Removendo dependências realmente mortas...', 'blue');
const reallyUnusedDependencies = [
  'es-iterator-helpers', // Não utilizado
  'function.prototype.name', // Não utilizado
  'iterator.prototype', // Não utilizado
  'set-function-name', // Não utilizado
  'mermaid', // Não utilizado
  'node-fetch', // Substituído por fetch nativo
  'pg', // Não utilizado (usando Supabase)
  'ws' // Não utilizado
];

// Remover em lotes pequenos
const batchSize = 5;
for (let i = 0; i < reallyUnusedDependencies.length; i += batchSize) {
  const batch = reallyUnusedDependencies.slice(i, i + batchSize);
  const command = `npm uninstall ${batch.join(' ')}`;
  
  log(`\n📦 Removendo lote ${Math.floor(i/batchSize) + 1}: ${batch.join(', ')}`, 'yellow');
  
  try {
    execSync(command, { stdio: 'inherit' });
    stats.dependenciesRemoved += batch.length;
  } catch (error) {
    log(`❌ Erro ao remover lote: ${error.message}`, 'red');
    stats.errors += batch.length;
  }
}

// FASE 3: LIMPEZA DE ARQUIVOS TEMPORÁRIOS
logSection('FASE 3: ARQUIVOS TEMPORÁRIOS');

log('\n🗑️ Removendo arquivos temporários...', 'blue');
const tempFiles = [
  'knip-analysis-fase4.md',
  'knip-analysis-fase4.json',
  'knip-analysis-post-cleanup.json',
  'knip-analysis-final.json'
];

tempFiles.forEach(file => {
  if (removeFile(file)) {
    stats.filesRemoved++;
  } else {
    stats.errors++;
  }
});

// RELATÓRIO FINAL
logSection('RELATÓRIO FINAL');

log(`\n📊 ESTATÍSTICAS DA LIMPEZA FINAL:`, 'bold');
log(`✅ Arquivos removidos: ${stats.filesRemoved}`, 'green');
log(`✅ Diretórios removidos: ${stats.directoriesRemoved}`, 'green');
log(`✅ Dependências removidas: ${stats.dependenciesRemoved}`, 'green');
log(`❌ Erros encontrados: ${stats.errors}`, 'red');

const totalRemoved = stats.filesRemoved + stats.directoriesRemoved + stats.dependenciesRemoved;
log(`\n🎯 TOTAL DE ITENS REMOVIDOS: ${totalRemoved}`, 'bold');

log(`\n🎯 ESTRATÉGIA APLICADA:`, 'cyan');
log(`   ✅ Removido apenas código REALMENTE morto`);
log(`   ✅ Mantido código que pode ser útil mas mal implementado`);
log(`   ✅ Preservado estrutura que pode ser necessária`);
log(`   ✅ Foco em arquivos órfãos e dependências não utilizadas`);

if (stats.errors > 0) {
  log(`\n⚠️  ATENÇÃO: ${stats.errors} erros foram encontrados durante a limpeza.`, 'yellow');
  log(`   Verifique os logs acima para mais detalhes.`, 'yellow');
}

log(`\n🚀 LIMPEZA FINAL CONCLUÍDA!`, 'bold');
log(`   O projeto está limpo mantendo código potencialmente útil.`, 'green');

// Executar Knip final
log(`\n🔍 Executando análise Knip final...`, 'blue');
try {
  execSync('npx knip --reporter json > knip-analysis-clean.json', { stdio: 'inherit' });
  log(`✅ Análise final salva em knip-analysis-clean.json`, 'green');
} catch (error) {
  log(`❌ Erro na análise final: ${error.message}`, 'red');
}

log(`\n📋 Próximos passos:`, 'cyan');
log(`   1. Verificar se o projeto ainda funciona corretamente`);
log(`   2. Executar testes para garantir que nada foi quebrado`);
log(`   3. Revisar knip-analysis-clean.json para verificar resultado`);
log(`   4. Commit das mudanças com mensagem descritiva`);
log(`   5. Iniciar FASE 5: Otimização e Monitoramento`); 