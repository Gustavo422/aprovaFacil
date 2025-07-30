#!/usr/bin/env node

/**
 * Script para atualizar arquivos do backend que ainda usam createClient diretamente
 * FASE 3: CONFIGURAÇÃO UNIFICADA - BACKEND
 */

const fs = require('fs');
const path = require('path');

// Arquivos específicos do backend que precisam ser atualizados
const BACKEND_FILES_TO_UPDATE = [
  'backend/src/utils/run-users-migration.ts',
  'backend/src/utils/metrics-history.ts',
  'backend/src/utils/test-history.ts',
  'backend/src/utils/log-history.ts',
  'backend/src/security/login-security.service.ts',
  'backend/src/repositories/UserRepository.ts',
  'backend/src/auth/enhanced-auth.service.ts',
  'backend/src/lib/logging/supabase-transport.ts',
  'backend/src/app.ts',
  'backend/src/api/monitor/tests/run/route.ts',
  'backend/src/api/monitor/tests/history/route.ts',
  'backend/src/api/monitor/metrics/history/route.ts',
  'backend/src/api/monitor/metrics/custom/route.ts',
  'backend/src/core/monitoring/database-status.ts',
  'backend/src/api/auth/refresh/route.ts',
  'backend/src/api/auth/logout/route.ts',
  'backend/src/api/auth/me/route.ts',
  'backend/src/api/auth/login/route.ts',
  'backend/src/api/admin/security/route.ts'
];

function updateBackendFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  Arquivo não encontrado: ${filePath}`);
      return 0;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;

    // Padrão 1: Substituir import + createClient por configuração unificada
    const pattern1 = /import\s+\{\s*createClient\s*\}\s+from\s+['"]@supabase\/supabase-js['"];?\s*\nconst\s+supabase\s*=\s*createClient\([^)]+\);/g;
    if (content.match(pattern1)) {
      content = content.replace(pattern1, `import { supabase } from '@/config/supabase-unified';`);
      changes++;
      console.log(`  ✅ Substituído createClient direto por configuração unificada`);
    }

    // Padrão 2: Substituir import + createClient com SupabaseClient
    const pattern2 = /import\s+\{\s*createClient,\s*SupabaseClient\s*\}\s+from\s+['"]@supabase\/supabase-js['"];?\s*\nconst\s+supabase\s*=\s*createClient\([^)]+\);/g;
    if (content.match(pattern2)) {
      content = content.replace(pattern2, `import { supabase } from '@/config/supabase-unified';`);
      changes++;
      console.log(`  ✅ Substituído createClient com SupabaseClient por configuração unificada`);
    }

    // Padrão 3: Substituir apenas o import, mantendo o resto
    const pattern3 = /import\s+\{\s*createClient\s*\}\s+from\s+['"]@supabase\/supabase-js['"];?/g;
    if (content.match(pattern3) && !content.includes('import { supabase }')) {
      content = content.replace(pattern3, `import { supabase } from '@/config/supabase-unified';`);
      changes++;
      console.log(`  ✅ Substituído import createClient por configuração unificada`);
    }

    // Padrão 4: Substituir import com SupabaseClient
    const pattern4 = /import\s+\{\s*createClient,\s*SupabaseClient\s*\}\s+from\s+['"]@supabase\/supabase-js['"];?/g;
    if (content.match(pattern4) && !content.includes('import { supabase }')) {
      content = content.replace(pattern4, `import { supabase } from '@/config/supabase-unified';`);
      changes++;
      console.log(`  ✅ Substituído import createClient, SupabaseClient por configuração unificada`);
    }

    // Se houve mudanças, salvar o arquivo
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  💾 Arquivo atualizado: ${path.relative(process.cwd(), filePath)}`);
      return changes;
    }

    return 0;
  } catch (error) {
    console.error(`  ❌ Erro ao processar ${filePath}:`, error.message);
    return 0;
  }
}

function main() {
  console.log('🚀 FASE 3: CONFIGURAÇÃO UNIFICADA - ATUALIZANDO BACKEND');
  console.log('=' .repeat(60));
  
  let totalChanges = 0;
  let totalFiles = 0;
  
  for (const filePath of BACKEND_FILES_TO_UPDATE) {
    console.log(`\n📁 Processando: ${filePath}`);
    const changes = updateBackendFile(filePath);
    if (changes > 0) {
      totalChanges += changes;
      totalFiles++;
    }
  }
  
  // Resumo
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESUMO DA ATUALIZAÇÃO DO BACKEND:');
  console.log(`  📁 Arquivos processados: ${BACKEND_FILES_TO_UPDATE.length}`);
  console.log(`  ✏️  Arquivos modificados: ${totalFiles}`);
  console.log(`  🔄 Total de substituições: ${totalChanges}`);
  
  if (totalChanges > 0) {
    console.log('\n✅ BACKEND ATUALIZADO COM SUCESSO!');
    console.log('🎯 Próximo passo: Testar as mudanças');
  } else {
    console.log('\n⚠️  Nenhuma mudança foi necessária no backend');
    console.log('ℹ️  Os arquivos já estão usando a configuração unificada');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, updateBackendFile }; 