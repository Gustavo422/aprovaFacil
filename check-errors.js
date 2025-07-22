#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando erros TypeScript e Lint...\n');

// Função para executar comandos
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      cwd: './backend',
      stdio: 'pipe'
    });
    console.log(`✅ ${description} - OK`);
    if (output.trim()) {
      console.log(output);
    }
    return { success: true, output };
  } catch (error) {
    console.log(`❌ ${description} - ERRO`);
    console.log(error.stdout || error.message);
    return { success: false, error: error.stdout || error.message };
  }
}

// Verificar se estamos no diretório correto
if (!fs.existsSync('./backend/package.json')) {
  console.log('❌ Execute este script na raiz do projeto (onde está a pasta backend)');
  process.exit(1);
}

console.log('🏗️  Verificando estrutura do projeto...');

// 1. Verificar erros TypeScript
const tscResult = runCommand('npx tsc --noEmit', 'Verificação TypeScript');

// 2. Verificar lint (se existir)
if (fs.existsSync('./backend/.eslintrc.js') || fs.existsSync('./backend/eslint.config.js')) {
  const lintResult = runCommand('npx eslint src --ext .ts,.js', 'Verificação ESLint');
}

// 3. Listar arquivos que podem estar obsoletos
console.log('\n📁 Verificando arquivos potencialmente obsoletos...');

const obsoletePatterns = [
  'backend/src/**/*.test.js',
  'backend/src/**/*.spec.js', 
  'backend/src/**/*.old.*',
  'backend/src/**/*.backup.*',
  'backend/src/**/*-old.*',
  'backend/src/**/*_old.*'
];

// 4. Verificar imports quebrados
console.log('\n🔗 Verificando imports...');
const glob = require('glob');

try {
  const tsFiles = glob.sync('backend/src/**/*.ts');
  const brokenImports = [];
  
  tsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const importLines = content.match(/^import.*from\s+['"]([^'"]+)['"];?$/gm);
    
    if (importLines) {
      importLines.forEach(line => {
        const match = line.match(/from\s+['"]([^'"]+)['"]/);
        if (match) {
          const importPath = match[1];
          if (importPath.startsWith('.')) {
            // Import relativo - verificar se arquivo existe
            const fullPath = path.resolve(path.dirname(file), importPath);
            const possibleExtensions = ['.ts', '.js', '/index.ts', '/index.js'];
            
            let exists = false;
            for (const ext of possibleExtensions) {
              if (fs.existsSync(fullPath + ext)) {
                exists = true;
                break;
              }
            }
            
            if (!exists) {
              brokenImports.push({
                file: file.replace('backend/', ''),
                import: importPath,
                line: line.trim()
              });
            }
          }
        }
      });
    }
  });
  
  if (brokenImports.length > 0) {
    console.log('❌ Imports quebrados encontrados:');
    brokenImports.forEach(item => {
      console.log(`   ${item.file}: ${item.import}`);
    });
  } else {
    console.log('✅ Todos os imports relativos estão OK');
  }
} catch (error) {
  console.log('⚠️  Não foi possível verificar imports (instale glob: npm install glob)');
}

console.log('\n📊 Resumo da verificação concluída!');
console.log('\nPara corrigir os erros encontrados:');
console.log('1. Corrija os erros TypeScript mostrados acima');
console.log('2. Remova arquivos obsoletos se encontrados');
console.log('3. Corrija imports quebrados');
console.log('4. Execute novamente: node check-errors.js');