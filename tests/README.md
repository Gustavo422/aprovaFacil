# 🧪 Estrutura Unificada de Testes - AprovaFácil

## 🗂️ Organização Hierárquica

Esta pasta contém todos os testes do projeto organizados de forma estruturada para facilitar manutenção e execução.

### 📋 Estrutura de Pastas

```
tests/
├── unit/                # Testes unitários
│   ├── backend/         # Testes do backend
│   │   ├── services/    # Testes de serviços
│   │   ├── repositories/# Testes de repositórios
│   │   └── utils/       # Testes de utilitários
│   └── frontend/        # Testes do frontend
│       ├── components/  # Testes de componentes
│       ├── hooks/       # Testes de hooks
│       └── utils/       # Testes de utilitários
├── integration/         # Testes de integração
│   ├── api/             # Testes de API
│   ├── auth/            # Testes de autenticação
│   └── database/        # Testes de banco
├── e2e/                 # Testes end-to-end
│   ├── auth/            # Fluxos de autenticação
│   ├── admin/           # Fluxos administrativos
│   └── user/            # Fluxos de usuário
├── fixtures/            # Dados de teste
│   ├── users/           # Usuários de teste
│   ├── concursos/       # Concursos de teste
│   └── mock-data/       # Dados mock
├── setup.ts             # Configuração de testes
└── README.md            # Este arquivo
```

## 📊 Conteúdo por Categoria

### 🔧 Testes Unitários (Unit)

**Backend Services:**
- Testes de serviços de autenticação
- Testes de serviços de concursos
- Testes de serviços de usuários
- Testes de serviços de monitoramento

**Backend Repositories:**
- Testes de repositórios de dados
- Testes de acesso ao banco
- Testes de queries complexas

**Backend Utils:**
- Testes de utilitários
- Testes de validações
- Testes de helpers

**Frontend Components:**
- Testes de componentes React
- Testes de formulários
- Testes de contextos

**Frontend Hooks:**
- Testes de hooks customizados
- Testes de lógica de estado

**Frontend Utils:**
- Testes de utilitários
- Testes de helpers
- Testes de formatação

### 🔗 Testes de Integração (Integration)

**API:**
- Testes de endpoints
- Testes de rotas
- Testes de middlewares

**Auth:**
- Testes de autenticação
- Testes de autorização
- Testes de tokens

**Database:**
- Testes de conexão
- Testes de queries
- Testes de migrações

### 🌐 Testes End-to-End (E2E)

**Auth:**
- Fluxos de login/logout
- Fluxos de registro
- Fluxos de recuperação de senha

**Admin:**
- Fluxos administrativos
- Gestão de usuários
- Configurações do sistema

**User:**
- Fluxos de usuário
- Navegação
- Interações com interface

### 🎭 Fixtures

**Users:**
- Usuários de teste
- Perfis diferentes
- Dados mock de usuários

**Concursos:**
- Concursos de teste
- Categorias
- Dados mock de concursos

**Mock Data:**
- Dados genéricos
- Configurações de teste
- Schemas de teste

## 🚀 Como Executar

### Testes Unitários:
```bash
# Backend
npm run test:unit:backend

# Frontend
npm run test:unit:frontend

# Todos os unitários
npm run test:unit
```

### Testes de Integração:
```bash
# API
npm run test:integration:api

# Auth
npm run test:integration:auth

# Database
npm run test:integration:database

# Todos os de integração
npm run test:integration
```

### Testes E2E:
```bash
# Auth
npm run test:e2e:auth

# Admin
npm run test:e2e:admin

# User
npm run test:e2e:user

# Todos os E2E
npm run test:e2e
```

### Todos os Testes:
```bash
npm run test:all
```

## 📝 Convenções

1. **Nomenclatura:** Todos os arquivos seguem padrão `*.test.{ts,tsx,js}`
2. **Organização:** Cada teste tem uma responsabilidade específica
3. **Isolamento:** Testes são independentes entre si
4. **Fixtures:** Dados de teste são reutilizáveis
5. **Documentação:** Cada teste tem descrição clara

## 🔧 Configuração

### Setup.ts:
- Configuração global de testes
- Mocks e stubs
- Configuração de ambiente

### Vitest:
- Configuração do runner de testes
- Plugins e extensões
- Configuração de coverage

### ESLint:
- Regras específicas para testes
- Validação de qualidade
- Padrões de código

## 📊 Cobertura

### Metas de Cobertura:
- **Unitários:** >90%
- **Integração:** >80%
- **E2E:** >70%
- **Total:** >85%

### Relatórios:
- Coverage HTML
- Coverage JSON
- Relatórios de performance

## 🧹 Manutenção

- **Novos testes:** Adicionar na pasta apropriada
- **Refatoração:** Manter estrutura organizada
- **Documentação:** Atualizar este README
- **Limpeza:** Remover testes obsoletos

---

**📅 Organizado em:** Julho 2025  
**👨‍💻 Responsável:** Sistema de Organização Automática  
**🎯 Objetivo:** Facilitar manutenção e execução de testes