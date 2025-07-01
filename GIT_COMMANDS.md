# Comandos Git para Gerenciamento de Repositórios

Este arquivo contém os comandos necessários para gerenciar as atualizações nos repositórios do projeto.

## Estrutura de Repositórios

1. **Repositório Principal (Monorepo)**
   - Contém os submódulos do frontend e backend
   - Local: `c:\Users\Gustavo\Downloads\aprovaJa-main`

2. **Frontend**
   - Repositório independente
   - Remote: `https://github.com/Gustavo422/frontend-aprovafacil.git`
   - Pasta local: `frontend/`

3. **Backend**
   - Repositório independente
   - Remote: `https://github.com/Gustavo422/backend-aprovafacil.git`
   - Pasta local: `backend/`

## Comandos Básicos

### Clonar o Projeto Pela Primeira Vez

```bash
# Clonar o repositório principal com submódulos
git clone --recurse-submodules https://github.com/Gustavo422/aprovaJa-main.git
cd aprovaJa-main

# Se já tiver clonado sem os submódulos
git submodule update --init --recursive
```

## Atualizando Alterações

### 1. Quando Fizer Alterações no Frontend

```bash
# Navegar para a pasta do frontend
cd frontend

# Verificar alterações
git status

# Adicionar arquivos alterados
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Fazer push para o repositório do frontend
git push origin main

# Voltar para a raiz e atualizar o submódulo
cd ..
git add frontend
git commit -m "Atualizar referência do frontend"
git push
```

### 2. Quando Fizer Alterações no Backend

```bash
# Navegar para a pasta do backend
cd backend

# Verificar alterações
git status

# Adicionar arquivos alterados
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Fazer push para o repositório do backend
git push origin main

# Voltar para a raiz e atualizar o submódulo
cd ..
git add backend
git commit -m "Atualizar referência do backend"
git push
```

### 3. Atualizando o Projeto Local

```bash
# Atualizar o repositório principal
git pull

# Atualizar todos os submódulos
git submodule update --remote --merge
```

## Comandos Úteis

### Verificar Status dos Submódulos

```bash
git submodule status
```

### Atualizar Todos os Submódulos

```bash
git submodule foreach 'git checkout main && git pull'
```

### Resetar Alterações em um Submódulo

```bash
cd frontend  # ou backend
git reset --hard
git clean -fd
cd ..
```

## Fluxo de Trabalho Recomendado

1. Sempre trabalhe dentro da pasta específica do frontend ou backend
2. Faça commits frequentes
3. Antes de começar a trabalhar, atualize o repositório principal e os submódulos
4. Após terminar as alterações, faça push para o repositório específico e depois atualize o repositório principal

## Solução de Problemas

### Se o Git reclamar de alterações não rastreadas

```bash
# No repositório com problemas
git stash
git pull
```

### Se os submódulos não estiverem atualizando

```bash
git submodule sync
git submodule update --init --recursive
```

### Se precisar recomeçar do zero

```bash
# Remover os submódulos atuais
git submodule deinit -f frontend backend
rm -rf .git/modules/frontend
rm -rf .git/modules/backend
rm -rf frontend
rm -rf backend

# Adicionar novamente
git submodule add https://github.com/Gustavo422/frontend-aprovafacil.git frontend
git submodule add https://github.com/Gustavo422/backend-aprovafacil.git backend

git add .
git commit -m "Reconfigurar submódulos"
git push
```

## Dicas

1. Mantenha os commits atômicos (uma única alteração por commit)
2. Escreva mensagens de commit claras e descritivas
3. Antes de fazer push, sempre execute os testes
4. Considere usar branches para novas funcionalidades (feature branches)

## Configuração do Git (opcional, mas recomendado)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
git config --global pull.rebase true
git config --global push.default current
```
