# AprovaFácil - Sistema de Estudos para Concursos Públicos

## 🎯 Versão 2.0 - Refatoração Completa

Este projeto foi completamente refatorado seguindo os princípios SOLID e boas práticas de desenvolvimento, com foco em escalabilidade, manutenibilidade e organização do código.

## 🏗️ Arquitetura

### Backend (Pasta `/backend`)
- **Arquitetura em Camadas**: Separação clara entre controladores, serviços, repositórios e utilitários
- **Princípios SOLID**: Cada classe tem uma responsabilidade única e bem definida
- **Injeção de Dependências**: Facilita testes e manutenção
- **Sistema de Cache**: Cache em memória e persistente para otimização
- **Logs Estruturados**: Sistema completo de auditoria e monitoramento
- **Tratamento de Erros**: Classes de erro personalizadas e tratamento centralizado

### Frontend (Pasta `/frontend`)
- Mantém a estrutura original
- Pronto para integração com o novo backend

## 🚀 Principais Funcionalidades Implementadas

### 🎓 Guru da Aprovação
Sistema inteligente que analisa o progresso do usuário e fornece:
- **Métricas Detalhadas**: Questões respondidas, proficiência em flashcards, progresso em apostilas
- **Prognóstico de Aprovação**: Estimativa de tempo para aprovação baseada no desempenho
- **Recomendações Personalizadas**: Sugestões específicas para melhorar o desempenho
- **Análise por Disciplina**: Identificação de pontos fortes e fracos

### 🛠️ Painel Administrativo Consolidado
Sistema completo para gestão de todo o conteúdo:

#### Gestão de Estrutura
- **Categorias de Concursos**: Organização hierárquica dos concursos
- **Disciplinas por Categoria**: Mapeamento de disciplinas específicas
- **Concursos**: CRUD completo com metadados avançados

#### Gestão de Conteúdo
- **Simulados**: Criação, edição e gestão de simulados
- **Questões de Simulados**: Gestão individual de questões
- **Questões Semanais**: Sistema de questões periódicas
- **Flashcards**: Gestão de cartões de memorização
- **Apostilas**: Sistema completo de apostilas modulares
- **Conteúdo de Apostilas**: Gestão de módulos e conteúdo

#### Funcionalidades Avançadas
- **Operações em Lote**: Importação e exportação de dados
- **Validação de JSON**: Validação automática de estruturas de dados
- **Sistema de Backup**: Backup e restauração completos
- **Relatórios**: Estatísticas detalhadas do sistema
- **Monitoramento**: Logs, métricas e testes automatizados

### 🔐 Sistema de Autenticação Robusto
- **JWT com Refresh Tokens**: Segurança avançada
- **Recuperação de Senha**: Sistema completo de reset
- **Middleware de Autorização**: Controle granular de acesso
- **Auditoria de Acesso**: Log de todas as ações de usuários

### 📊 Sistema de Cache Inteligente
- **Cache em Memória**: Para dados frequentemente acessados
- **Cache Persistente**: Para dados que precisam sobreviver a reinicializações
- **Invalidação Automática**: Limpeza inteligente do cache
- **Configuração Dinâmica**: Configurações de cache via admin

## 📁 Estrutura de Arquivos

```
aprovaFacil-main/
├── backend/                    # Backend refatorado
│   ├── src/
│   │   ├── core/              # Núcleo do sistema
│   │   │   ├── database/      # Configuração do Supabase
│   │   │   ├── errors/        # Classes de erro personalizadas
│   │   │   ├── interfaces/    # Interfaces e contratos
│   │   │   └── utils/         # Utilitários (logs, cache)
│   │   ├── modules/           # Módulos de negócio
│   │   │   ├── auth/          # Autenticação
│   │   │   ├── usuarios/      # Gestão de usuários
│   │   │   ├── guru-aprovacao/ # Sistema Guru da Aprovação
│   │   │   └── admin/         # Painel administrativo
│   │   ├── routes/            # Rotas da API
│   │   ├── shared/            # Tipos compartilhados
│   │   ├── app.ts             # Aplicação principal
│   │   └── index.ts           # Ponto de entrada
│   ├── package.json           # Dependências atualizadas
│   └── tsconfig.json          # Configuração TypeScript
├── frontend/                   # Frontend original
├── novo_schema.sql            # Novo schema em português
├── dados_exemplo.sql          # Dados de exemplo
├── schema_original.sql        # Schema original para referência
└── README.md                  # Esta documentação
```

## 🗄️ Banco de Dados

### Novo Schema (novo_schema.sql)
O banco de dados foi completamente reestruturado em português com:
- **Nomenclatura Clara**: Todos os nomes em português
- **Relacionamentos Otimizados**: Foreign keys bem definidas
- **Índices Estratégicos**: Para melhor performance
- **Campos de Auditoria**: created_at, updated_at em todas as tabelas
- **Soft Delete**: Exclusão lógica com campo 'ativo'

### Principais Tabelas
- `usuarios` - Gestão de usuários
- `categorias_concursos` - Categorização de concursos
- `concursos` - Concursos disponíveis
- `simulados` - Simulados e provas
- `questoes_simulado` - Questões dos simulados
- `questoes_semanais` - Questões semanais
- `cartoes_memorizacao` - Flashcards
- `apostilas` - Apostilas de estudo
- `conteudo_apostila` - Conteúdo modular das apostilas
- `progresso_usuario_*` - Tabelas de progresso do usuário

## 🚀 Como Executar

### Backend
```bash
cd backend
npm install
npm run dev        # Executa com tsx
npm run dev:ts-node # Executa com ts-node (alternativa)

# Para ativar logs de debug
# No Windows (CMD)
set DEBUG=app:backend:* & npm run dev

# No Windows (PowerShell)
$env:DEBUG="app:backend:*"; npm run dev

# No Linux/macOS
DEBUG=app:backend:* npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start

# Para ativar logs de debug no navegador, abra o console e execute:
localStorage.debug = 'app:frontend:*'
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico

# JWT
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=24h

# Admin
ADMIN_EMAILS=admin@aprovafacil.com,outro@admin.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Servidor
PORT=5000
NODE_ENV=development

# Debug (opcional)
DEBUG=app:backend:*  # Ativa todos os logs de debug no backend
```

### Ferramentas de Debugging

O projeto inclui várias ferramentas para facilitar o desenvolvimento, debugging e testes:

- **Biblioteca `debug`**: Logs detalhados e categorizados para backend e frontend
  - Permite ativar/desativar categorias específicas de log via variáveis de ambiente ou localStorage
  - Estrutura de namespaces hierárquica (`app:backend:*` e `app:frontend:*`)
  - Suporte para diferentes níveis de log (info, warn, error)

- **Ferramenta `ts-node`**: Execução direta de arquivos TypeScript sem compilação prévia
  - Alternativa ao `tsx` com melhor suporte para debugging
  - Configurada para respeitar as opções do tsconfig.json
  - Scripts npm dedicados: `npm run dev:ts-node`

- **Plugin `eslint-plugin-vitest`**: Regras de linting específicas para testes Vitest
  - Detecta problemas comuns em testes antes da execução
  - Garante boas práticas como asserções em todos os testes
  - Previne testes focados acidentalmente (it.only, describe.only)

Estas ferramentas foram adicionadas como dependências de desenvolvimento e configuradas para trabalhar em harmonia com as ferramentas existentes, permitindo que os desenvolvedores escolham as abordagens que melhor se adequam ao seu fluxo de trabalho.

Para documentação detalhada sobre como usar cada uma dessas ferramentas, incluindo exemplos práticos e melhores práticas, consulte a [documentação completa de debugging](docs/debugging-tools.md).

## 📋 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/recuperar-senha` - Recuperação de senha
- `POST /api/auth/redefinir-senha` - Redefinição de senha
- `POST /api/auth/alterar-senha` - Alteração de senha

### Usuário (Protegidas)
- `GET /api/protected/usuario/perfil` - Perfil do usuário
- `PUT /api/protected/usuario/perfil` - Atualizar perfil
- `GET /api/protected/usuario/estatisticas` - Estatísticas do usuário
- `POST /api/protected/usuario/configuracao-inicial` - Configuração inicial

### Guru da Aprovação (Protegidas)
- `GET /api/protected/guru/metricas` - Métricas do usuário
- `GET /api/protected/guru/prognostico` - Prognóstico de aprovação
- `GET /api/protected/guru/analise-detalhada` - Análise detalhada
- `POST /api/protected/guru/atualizar` - Atualizar métricas

### Administrativas (Requer Admin)
- `GET /api/admin/estatisticas` - Estatísticas do sistema
- `POST /api/admin/concursos` - Criar concurso
- `POST /api/admin/simulados` - Criar simulado
- `POST /api/admin/questoes-semanais` - Criar questões semanais
- `POST /api/admin/flashcards` - Criar flashcards
- `POST /api/admin/apostilas` - Criar apostila
- `GET /api/admin/usuarios` - Listar usuários
- `POST /api/admin/usuarios` - Criar usuário
- E muitas outras...

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Executar testes com interface visual (Vitest UI)
npm run test:ui
```

O projeto utiliza o `eslint-plugin-vitest` para garantir a qualidade dos testes. Para mais informações, consulte a [documentação de debugging](docs/debugging-tools.md#plugin-eslint-plugin-vitest).

## 📊 Monitoramento

### Health Check
- `GET /api/health` - Status do sistema

### Métricas
- `GET /api/admin/metricas` - Métricas detalhadas
- `GET /api/admin/logs` - Logs do sistema

## 🔒 Segurança

- **Helmet**: Proteção de cabeçalhos HTTP
- **CORS**: Configuração adequada de CORS
- **Rate Limiting**: Limitação de requisições
- **JWT**: Tokens seguros com expiração
- **Bcrypt**: Hash seguro de senhas
- **Validação**: Validação rigorosa de entrada

## 🎯 Principais Melhorias Implementadas

1. **Arquitetura SOLID**: Código mais limpo e manutenível
2. **Painel Admin Consolidado**: Todos os inserts centralizados
3. **Guru da Aprovação**: Sistema inteligente de análise
4. **Cache Inteligente**: Performance otimizada
5. **Logs Estruturados**: Monitoramento completo
6. **Tratamento de Erros**: Respostas consistentes
7. **Validação Robusta**: Dados sempre íntegros
8. **Documentação**: Código bem documentado

## 📝 Próximos Passos

1. **Testes Unitários**: Implementar cobertura completa
2. **Documentação API**: Swagger/OpenAPI
3. **CI/CD**: Pipeline de deploy automatizado
4. **Monitoramento**: Métricas em tempo real
5. **Performance**: Otimizações adicionais

## 👥 Equipe

Desenvolvido pela equipe AprovaFácil com foco em qualidade, escalabilidade e experiência do usuário.

---

**Versão**: 2.0.0  
**Data**: 2025  
**Licença**: MIT



