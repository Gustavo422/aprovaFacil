#!/usr/bin/env node

/**
 * Script para atualizar todas as importações do Supabase para usar a configuração unificada
 * FASE 3: CONFIGURAÇÃO UNIFICADA
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurações
const BACKEND_DIR = path.join(__dirname, '../backend');
const FRONTEND_DIR = path.join(__dirname, '../frontend');

// Padrões de importação para substituir
const IMPORT_PATTERNS = [
  // Backend - substituir importações diretas por configuração unificada
  {
    pattern: /import\s+\{\s*createClient\s*\}\s+from\s+['"]@supabase\/supabase-js['"];?\s*\nconst\s+supabase\s*=\s*createClient\([^)]+\);/g,
    replacement: `import { supabase } from '@/config/supabase-unified';`,
    description: 'Substituir createClient direto por configuração unificada (backend)'
  },
  {
    pattern: /import\s+\{\s*createClient,\s*SupabaseClient\s*\}\s+from\s+['"]@supabase\/supabase-js['"];?\s*\nconst\s+supabase\s*=\s*createClient\([^)]+\);/g,
    replacement: `import { supabase } from '@/config/supabase-unified';`,
    description: 'Substituir createClient com SupabaseClient por configuração unificada (backend)'
  },
  {
    pattern: /import\s+\{\s*supabase\s*\}\s+from\s+['"]\.\.\/config\/supabase['"];?/g,
    replacement: `import { supabase } from '@/config/supabase-unified';`,
    description: 'Substituir importação de config/supabase por configuração unificada'
  },
  {
    pattern: /import\s+\{\s*supabase\s*\}\s+from\s+['"]\.\.\/\.\.\/config\/supabase['"];?/g,
    replacement: `import { supabase } from '@/config/supabase-unified';`,
    description: 'Substituir importação relativa de config/supabase por configuração unificada'
  },
  {
    pattern: /import\s+\{\s*supabase\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/config\/supabase['"];?/g,
    replacement: `import { supabase } from '@/config/supabase-unified';`,
    description: 'Substituir importação relativa profunda de config/supabase por configuração unificada'
  },
  {
    pattern: /import\s+\{\s*supabase\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/config\/supabase['"];?/g,
    replacement: `import { supabase } from '@/config/supabase-unified';`,
    description: 'Substituir importação relativa muito profunda de config/supabase por configuração unificada'
  },
  {
    pattern: /import\s+\{\s*supabase\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/config\/supabase['"];?/g,
    replacement: `import { supabase } from '@/config/supabase-unified';`,
    description: 'Substituir importação relativa extremamente profunda de config/supabase por configuração unificada'
  },
  {
    pattern: /import\s+\{\s*supabase\s*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/config\/supabase['"];?/g,
    replacement: `import { supabase } from '@/config/supabase-unified';`,
    description: 'Substituir importação relativa máxima de config/supabase por configuração unificada'
  }
];

// Arquivos que devem ser removidos (configurações redundantes)
const FILES_TO_REMOVE = [
  'backend/src/api/concursos/config/supabase.ts',
  'frontend/src/lib/supabase/client.tsx'
];

// Arquivos que devem ser ignorados (manter configuração específica)
const FILES_TO_IGNORE = [
  'backend/src/config/supabase-unified.ts', // Configuração unificada (manter)
  'frontend/lib/supabase.tsx', // Configuração frontend específica (manter)
  'frontend/src/lib/supabase/enhanced-client.ts', // Cliente avançado (manter)
  'frontend/src/lib/supabase/connection-pool.ts', // Pool de conexões (manter)
  'frontend/src/lib/supabase/pooled-client.ts', // Cliente com pool (manter)
  'frontend/src/lib/supabase/supabase-provider.tsx', // Provider React (manter)
  'frontend/src/lib/repositories/base.ts', // Repository base (manter)
  'frontend/lib/cache-database-service.ts', // Serviço de cache (manter)
  'backend/src/lib/logging/supabase-transport.ts', // Transport de logging (manter)
  'backend/src/repositories/UserRepository.ts', // Repository específico (manter)
  'backend/src/core/monitoring/database-status.ts', // Monitoramento (manter)
  'backend/src/auth/enhanced-auth.service.ts', // Serviço de auth (manter)
  'backend/src/app.ts', // App principal (manter)
  'backend/src/security/login-security.service.ts', // Segurança (manter)
  'backend/src/utils/test-history.ts', // Utilitário específico (manter)
  'backend/src/utils/run-users-migration.ts', // Migração (manter)
  'backend/src/utils/metrics-history.ts', // Métricas (manter)
  'backend/src/utils/log-history.ts', // Logs (manter)
  'backend/src/api/monitor/tests/run/route.ts', // Rota de monitoramento (manter)
  'backend/src/api/monitor/tests/history/route.ts', // Rota de histórico (manter)
  'backend/src/api/monitor/metrics/history/route.ts', // Rota de métricas (manter)
  'backend/src/api/monitor/metrics/custom/route.ts', // Rota customizada (manter)
  'backend/src/api/auth/refresh/route.ts', // Rota de auth (manter)
  'backend/src/api/auth/login/route.ts', // Rota de login (manter)
  'backend/src/api/auth/me/route.ts', // Rota de perfil (manter)
  'backend/src/api/auth/logout/route.ts', // Rota de logout (manter)
  'backend/src/api/admin/security/route.ts' // Rota de admin (manter)
];

function shouldIgnoreFile(filePath) {
  return FILES_TO_IGNORE.some(ignorePath => 
    filePath.includes(ignorePath.replace(/^backend\//, '').replace(/^frontend\//, ''))
  );
}

function findTypeScriptFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorar node_modules e pastas de backup
        if (!item.includes('node_modules') && !item.includes('backup') && !item.includes('.git')) {
          traverse(fullPath);
        }
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        const relativePath = path.relative(process.cwd(), fullPath);
        if (!shouldIgnoreFile(relativePath)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;
    
    // Aplicar cada padrão de substituição
    for (const pattern of IMPORT_PATTERNS) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        content = content.replace(pattern.pattern, pattern.replacement);
        changes += matches.length;
        console.log(`  ✅ ${pattern.description}: ${matches.length} substituições`);
      }
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

function removeRedundantFiles() {
  console.log('\n🗑️  Removendo arquivos de configuração redundantes...');
  
  for (const filePath of FILES_TO_REMOVE) {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`  ✅ Removido: ${filePath}`);
      } catch (error) {
        console.error(`  ❌ Erro ao remover ${filePath}:`, error.message);
      }
    } else {
      console.log(`  ⚠️  Arquivo não encontrado: ${filePath}`);
    }
  }
}

function main() {
  console.log('🚀 FASE 3: CONFIGURAÇÃO UNIFICADA - ATUALIZANDO IMPORTAÇÕES');
  console.log('=' .repeat(70));
  
  let totalChanges = 0;
  let totalFiles = 0;
  
  // Processar arquivos do backend
  console.log('\n📁 Processando arquivos do backend...');
  const backendFiles = findTypeScriptFiles(BACKEND_DIR);
  
  for (const file of backendFiles) {
    const changes = updateFile(file);
    if (changes > 0) {
      totalChanges += changes;
      totalFiles++;
    }
  }
  
  // Processar arquivos do frontend (apenas os que não são ignorados)
  console.log('\n📁 Processando arquivos do frontend...');
  const frontendFiles = findTypeScriptFiles(FRONTEND_DIR);
  
  for (const file of frontendFiles) {
    const changes = updateFile(file);
    if (changes > 0) {
      totalChanges += changes;
      totalFiles++;
    }
  }
  
  // Remover arquivos redundantes
  removeRedundantFiles();
  
  // Resumo
  console.log('\n' + '=' .repeat(70));
  console.log('📊 RESUMO DA ATUALIZAÇÃO:');
  console.log(`  📁 Arquivos processados: ${backendFiles.length + frontendFiles.length}`);
  console.log(`  ✏️  Arquivos modificados: ${totalFiles}`);
  console.log(`  🔄 Total de substituições: ${totalChanges}`);
  console.log(`  🗑️  Arquivos removidos: ${FILES_TO_REMOVE.length}`);
  
  if (totalChanges > 0) {
    console.log('\n✅ FASE 3 CONCLUÍDA COM SUCESSO!');
    console.log('🎯 Próximo passo: Executar testes para validar as mudanças');
  } else {
    console.log('\n⚠️  Nenhuma mudança foi necessária');
    console.log('ℹ️  As importações já estão usando a configuração unificada');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, updateFile, removeRedundantFiles }; 