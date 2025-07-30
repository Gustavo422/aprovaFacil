#!/usr/bin/env node

/**
 * Script de teste para validar a configuração unificada do Supabase
 * FASE 3: CONFIGURAÇÃO UNIFICADA - TESTES
 */

const fs = require('fs');
const path = require('path');

// Função para verificar se um arquivo usa a configuração unificada
function checkUnifiedConfig(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { status: 'not_found', message: 'Arquivo não encontrado' };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se usa configuração unificada
    if (content.includes("import { supabase } from '@/config/supabase-unified'")) {
      return { status: 'unified', message: '✅ Usa configuração unificada' };
    }
    
    // Verificar se ainda usa createClient diretamente
    if (content.includes("import { createClient } from '@supabase/supabase-js'")) {
      return { status: 'direct', message: '❌ Ainda usa createClient diretamente' };
    }
    
    // Verificar se não usa Supabase
    if (!content.includes('supabase') && !content.includes('createClient')) {
      return { status: 'none', message: 'ℹ️ Não usa Supabase' };
    }
    
    return { status: 'unknown', message: '❓ Configuração desconhecida' };
  } catch (error) {
    return { status: 'error', message: `❌ Erro: ${error.message}` };
  }
}

// Arquivos para testar
const TEST_FILES = [
  // Backend - arquivos principais
  'backend/src/config/supabase-unified.ts',
  'backend/src/app.ts',
  'backend/src/auth/enhanced-auth.service.ts',
  'backend/src/repositories/UserRepository.ts',
  'backend/src/api/auth/login/route.ts',
  'backend/src/api/auth/me/route.ts',
  'backend/src/api/admin/security/route.ts',
  
  // Frontend - arquivos principais
  'frontend/lib/supabase.tsx',
  'frontend/src/lib/supabase/enhanced-client.ts',
  'frontend/src/lib/repositories/base.ts'
];

// Verificar se arquivos redundantes foram removidos
const REMOVED_FILES = [
  'backend/src/api/concursos/config/supabase.ts',
  'frontend/src/lib/supabase/client.tsx'
];

function main() {
  console.log('🧪 FASE 3: CONFIGURAÇÃO UNIFICADA - TESTES DE VALIDAÇÃO');
  console.log('=' .repeat(70));
  
  let unifiedCount = 0;
  let directCount = 0;
  let otherCount = 0;
  
  // Testar arquivos principais
  console.log('\n📁 Testando arquivos principais...');
  for (const filePath of TEST_FILES) {
    const result = checkUnifiedConfig(filePath);
    console.log(`  ${result.message} - ${filePath}`);
    
    if (result.status === 'unified') unifiedCount++;
    else if (result.status === 'direct') directCount++;
    else otherCount++;
  }
  
  // Verificar arquivos removidos
  console.log('\n🗑️  Verificando arquivos removidos...');
  for (const filePath of REMOVED_FILES) {
    if (!fs.existsSync(filePath)) {
      console.log(`  ✅ Removido: ${filePath}`);
    } else {
      console.log(`  ❌ Ainda existe: ${filePath}`);
    }
  }
  
  // Verificar configuração unificada
  console.log('\n🔧 Verificando configuração unificada...');
  const unifiedConfig = checkUnifiedConfig('backend/src/config/supabase-unified.ts');
  if (unifiedConfig.status === 'unified') {
    console.log('  ✅ Configuração unificada existe e está correta');
  } else {
    console.log(`  ❌ Problema na configuração unificada: ${unifiedConfig.message}`);
  }
  
  // Resumo
  console.log('\n' + '=' .repeat(70));
  console.log('📊 RESUMO DOS TESTES:');
  console.log(`  ✅ Arquivos com configuração unificada: ${unifiedCount}`);
  console.log(`  ❌ Arquivos ainda usando createClient: ${directCount}`);
  console.log(`  ℹ️  Outros arquivos: ${otherCount}`);
  console.log(`  🗑️  Arquivos redundantes removidos: ${REMOVED_FILES.length}`);
  
  if (directCount === 0 && unifiedCount > 0) {
    console.log('\n🎉 FASE 3 CONCLUÍDA COM SUCESSO!');
    console.log('✅ Todas as importações estão usando a configuração unificada');
    console.log('🚀 Próximo passo: FASE 4 - Limpeza de código');
  } else if (directCount > 0) {
    console.log('\n⚠️  AINDA HÁ ARQUIVOS PARA ATUALIZAR');
    console.log(`❌ ${directCount} arquivos ainda usam createClient diretamente`);
    console.log('🔄 Execute novamente o script de atualização');
  } else {
    console.log('\n❌ NENHUM ARQUIVO USA CONFIGURAÇÃO UNIFICADA');
    console.log('🔍 Verifique se a configuração unificada foi criada corretamente');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, checkUnifiedConfig }; 