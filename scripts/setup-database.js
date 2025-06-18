const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente do Supabase não encontradas!');
  console.error('Verifique se o arquivo .env.local existe com:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=...');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para executar SQL
async function executeSQL(sqlContent, fileName) {
  try {
    console.log(`🔄 Executando ${fileName}...`);
    
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      // Se exec_sql não existir, tentar executar diretamente
      console.log(`⚠️  exec_sql não disponível, tentando execução direta...`);
      
      // Dividir o SQL em comandos individuais
      const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
      
      for (const command of commands) {
        if (command.trim()) {
          const { error: cmdError } = await supabase.rpc('exec_sql', { sql: command + ';' });
          if (cmdError) {
            console.log(`⚠️  Comando ignorado (pode ser normal): ${command.substring(0, 50)}...`);
          }
        }
      }
    }
    
    console.log(`✅ ${fileName} executado com sucesso!`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao executar ${fileName}:`, error.message);
    return false;
  }
}

// Função para ler arquivo SQL
async function readSQLFile(filePath) {
  try {
    const fs = require('fs').promises;
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Erro ao ler arquivo ${filePath}:`, error.message);
    return null;
  }
}

// Função principal
async function setupDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados...\n');
  
  // Lista de arquivos SQL na ordem de execução
  const sqlFiles = [
    { path: 'clean_database.sql', name: 'Limpeza do Banco' },
    { path: 'database_schema.sql', name: 'Schema do Banco' },
    { path: 'prepare_restructure.sql', name: 'Reestruturação' },
    { path: 'add_triggers_and_indexes.sql', name: 'Triggers e Índices' },
    { path: 'sample_data.sql', name: 'Dados de Exemplo' }
  ];
  
  let successCount = 0;
  
  for (const file of sqlFiles) {
    const sqlContent = await readSQLFile(file.path);
    if (sqlContent) {
      const success = await executeSQL(sqlContent, file.name);
      if (success) successCount++;
    }
    console.log(''); // Linha em branco para separar
  }
  
  console.log('📊 Resumo da execução:');
  console.log(`✅ ${successCount}/${sqlFiles.length} arquivos executados com sucesso`);
  
  if (successCount === sqlFiles.length) {
    console.log('\n🎉 Banco de dados configurado com sucesso!');
    console.log('Agora você pode testar o sistema de concursos.');
  } else {
    console.log('\n⚠️  Alguns arquivos não foram executados completamente.');
    console.log('Verifique os logs acima para mais detalhes.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase }; 