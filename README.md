# 📚 AprovaFacil - Plataforma de Estudos para Concursos

Uma plataforma completa, moderna e open source para preparação de concursos públicos, desenvolvida com Next.js 15, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

### ✨ Recursos Principais

- **Dashboard Unificado**: Visão geral do seu progresso, atividades recentes e estatísticas consolidadas.
- **Simulados Personalizados**: Crie simulados por matéria, com timer, correção automática e relatórios detalhados.
- **Questões Semanais**: Pratique com questões selecionadas semanalmente, com feedback imediato e estatísticas de acerto.
- **Plano de Estudos Inteligente**: Geração automática e dinâmica de planos, baseado no seu tempo disponível e progresso.
- **Flashcards com Repetição Espaçada**: Memorize conteúdos com algoritmo inteligente, categorização e progresso individual.
- **Mapa de Assuntos**: Visualize e acompanhe o domínio dos tópicos mais importantes.
- **Apostilas Modulares**: Materiais de estudo completos, organizados por disciplina e concurso.
- **Configurações Avançadas**: Personalize sua experiência, preferências e notificações.
- **Monitoramento e Validação do Banco**: Ferramentas administrativas para análise de uso, integridade e performance do banco de dados.
- **Cache Inteligente**: Sistema de cache em memória e persistente para performance otimizada.
- **Logs e Auditoria**: Registro centralizado de eventos, erros e ações administrativas.

### 🎨 Interface Moderna

- Design responsivo e acessível
- Tema claro/escuro
- Interface intuitiva e moderna
- Componentes reutilizáveis com Radix UI

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Lucide React** - Ícones modernos

### Backend & Banco de Dados

- **Supabase** - Backend-as-a-Service
  - Autenticação
  - Banco de dados PostgreSQL
  - Storage para arquivos
  - Edge Functions

### Ferramentas de Desenvolvimento

- **ESLint** - Linting de código
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos
- **CacheManager** - Cache em memória e persistente
- **Logger** - Logging estruturado

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm, yarn ou pnpm
- Conta no Supabase

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd AprovaFacil-main
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# Next.js
NEXTAUTH_SECRET=seu_secret_para_nextauth
NEXTAUTH_URL=http://localhost:3000
```

### 4. Configure o banco de dados

Execute os scripts SQL na ordem correta:

```bash
# 1. Schema do banco (obrigatório)
psql -h seu_host -U seu_usuario -d seu_banco -f docs/database/database_schema.sql

# 2. Triggers e índices (obrigatório)
psql -h seu_host -U seu_usuario -d seu_banco -f docs/database/add_triggers_and_indexes.sql

# 3. Dados de exemplo (opcional)
psql -h seu_host -U seu_usuario -d seu_banco -f docs/database/sample_data.sql
```

**Alternativa usando Supabase Dashboard:**
1. Acesse [supabase.com](https://supabase.com)
2. Abra o SQL Editor do seu projeto
3. Execute o arquivo `docs/database/database_setup_complete.sql` (contém todos os scripts)

### 5. Execute o projeto

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o projeto.

## 🏗️ Estrutura do Projeto

```
AprovaFacil-main/
├── app/                       # App Router (Next.js 15)
│   ├── actions/               # Server Actions
│   ├── admin/                 # Páginas administrativas (monitoramento, validação, etc)
│   ├── api/                   # Rotas de API (REST)
│   ├── dashboard/             # Dashboard do usuário (apostilas, simulados, flashcards, etc)
│   ├── forgot-password/       # Recuperação de senha
│   ├── login/                 # Login
│   ├── register/              # Registro
│   ├── reset-password/        # Redefinição de senha
│   ├── selecionar-concurso/   # Seleção de concurso
│   ├── client-layout.tsx      # Layout de cliente
│   ├── globals.css            # Estilos globais
│   ├── layout.tsx             # Layout principal
│   ├── loading.tsx            # Tela de loading
│   ├── not-found.tsx          # Página 404
│   └── page.tsx               # Landing page
├── components/                # Componentes React reutilizáveis
│   ├── ui/                    # Componentes base (Radix UI customizados)
│   ├── onboarding/            # Componentes de onboarding
│   ├── auth-guard.tsx         # Proteção de rotas
│   ├── auth-status.tsx        # Status de autenticação
│   ├── error-boundary.tsx     # Boundary de erro
│   ├── flashcard.tsx          # Flashcard
│   ├── question-player.tsx    # Player de questões
│   ├── rate-limit-info.tsx    # Info de rate limit
│   ├── session-monitor.tsx    # Monitor de sessão
│   ├── sidebar-nav.tsx        # Navegação lateral
│   └── user-nav.tsx           # Navegação do usuário
├── contexts/                  # Contextos React (ex: ConcursoContext)
├── docs/                      # Documentação
│   ├── database/              # Scripts SQL e docs do banco
│   └── development/           # Guias de desenvolvimento e arquitetura
├── lib/                       # Utilitários, tipos e configuração
│   ├── repositories/          # Repositórios de acesso a dados (legado)
│   ├── supabase.ts            # Cliente Supabase
│   ├── database.types.ts      # Tipos do banco
│   ├── utils.ts               # Funções utilitárias
│   ├── cache.ts               # CacheManager
│   ├── logger.ts              # Logger centralizado
│   └── ...                    # Outros helpers
├── middleware/                # Middlewares customizados
├── public/                    # Arquivos estáticos (imagens, etc)
├── scripts/                   # Scripts de automação e manutenção
│   └── maintenance/           # Scripts de limpeza/manutenção de cache
├── src/                       # Código fonte organizado por domínio
│   ├── core/                  # Lógica central (erros, database, utils)
│   └── features/              # Funcionalidades de domínio (apostilas, auth, dashboard, flashcards, simulados, etc)
├── styles/                    # Estilos globais
├── tests/                     # Testes automatizados (unitários, smoke, e2e)
│   ├── app/                   # Testes de páginas e rotas do app
│   ├── components/            # Testes de componentes
│   ├── lib/                   # Testes de utilitários
│   ├── src/                   # Testes do core/features
│   └── setup.ts               # Setup global de testes
├── package.json               # Dependências e scripts
├── tsconfig.json              # Configuração TypeScript
└── README.md                  # Este arquivo
```

- **Observação:**
  - O projeto está modularizado por domínio e responsabilidade (DDD).
  - Os testes cobrem páginas, componentes, hooks, utilitários e integrações principais.
  - Ferramentas administrativas e de monitoramento estão disponíveis na área /admin.
  - A estrutura pode crescer conforme novas features forem adicionadas.

## 🎯 Funcionalidades Detalhadas

### Autenticação e Segurança
- Registro e login com email/senha
- Autenticação via Supabase Auth
- Proteção de rotas e middleware de autenticação
- Políticas de acesso por tipo de conteúdo

### Dashboard Principal
- Visão geral do progresso consolidado
- Estatísticas de estudo por domínio (simulados, flashcards, apostilas)
- Atividades recentes e progresso diário
- Gráficos de desempenho e evolução

### Simulados
- Criação e resolução de simulados personalizados
- Timer configurável e correção automática
- Relatórios detalhados e histórico de tentativas
- Estatísticas por disciplina e desempenho

### Questões Semanais
- 100 questões selecionadas semanalmente
- Dificuldade progressiva e feedback imediato
- Estatísticas de acerto e progresso

### Plano de Estudos
- Geração automática de planos de estudo
- Ajuste dinâmico conforme progresso
- Lembretes e notificações

### Flashcards
- Algoritmo de repetição espaçada
- Categorização por matéria e tema
- Progresso individual e modo de revisão
- Estatísticas de acerto e revisão

### Apostilas
- Materiais completos por disciplina e concurso
- Progresso de leitura e acompanhamento
- Conteúdo modular e atualizado

### Mapa de Assuntos
- Visualização dos tópicos cobrados
- Acompanhamento do domínio por tema
- Integração com plano de estudos

### Configurações
- Preferências de usuário
- Notificações e personalização

### Ferramentas Administrativas
- Monitoramento e validação do banco de dados
- Limpeza e manutenção de cache
- Logs de auditoria e erros
- Estatísticas do sistema (em breve)
- Gerenciamento de usuários (em breve)
- Configurações globais (em breve)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Produção
npm run build        # Build para produção
npm run start        # Inicia o servidor de produção

# Qualidade de código
npm run lint         # Executa o ESLint
npm run lint:fix     # Corrige problemas de linting automaticamente

# Testes
npm run test         # Executa os testes
npm run test:watch   # Executa testes em modo watch
```

## 🧪 Testando o Sistema

### Páginas de Teste Disponíveis

- **`/teste-sistema`** - Testa conexão com banco e APIs
- **`/teste-selecao`** - Testa contexto global de concursos
- **`/test-auth`** - Testa sistema de autenticação

### Verificações Importantes

1. **Banco de Dados**: Verifique se todas as tabelas foram criadas
2. **APIs**: Teste os endpoints principais
3. **Autenticação**: Teste login/logout
4. **Contexto**: Verifique se o sistema de concursos funciona

## 🗄️ Banco de Dados

### Tabelas Principais

- **`concurso_categorias`** - Categorias de concursos
- **`concursos`** - Concursos específicos
- **`categoria_disciplinas`** - Disciplinas por categoria
- **`simulados`** - Simulados de questões
- **`simulado_questions`** - Questões dos simulados
- **`flashcards`** - Flashcards de estudo
- **`apostilas`** - Apostilas de estudo
- **`user_simulado_progress`** - Progresso em simulados
- **`user_flashcard_progress`** - Progresso em flashcards
- **`user_apostila_progress`** - Progresso em apostilas
- **`mapa_assuntos`** - Tópicos e temas
- **`user_performance_cache`** - Cache de performance
- **`audit_logs`** - Logs de auditoria

### Scripts SQL Disponíveis

- `docs/database/database_schema.sql` - Schema completo
- `docs/database/database_setup_complete.sql` - Setup completo
- `docs/database/sample_data.sql` - Dados de exemplo
- `docs/database/add_triggers_and_indexes.sql` - Triggers e índices

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras plataformas

- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com banco**
   - Verifique as variáveis de ambiente
   - Confirme se o Supabase está online
   - Execute os scripts SQL necessários

2. **Tabelas não existem**
   - Execute `docs/database/database_setup_complete.sql`
   - Verifique se as foreign keys foram criadas

3. **Erro de autenticação**
   - Verifique as chaves do Supabase
   - Confirme se o email foi confirmado
   - Teste em `/test-auth`

### Logs e Debug

- Use `npm run dev` para ver logs detalhados
- Verifique o console do navegador
- Use as páginas de teste para diagnóstico
- Consulte logs de auditoria na área administrativa

## 📚 Documentação Adicional

- **`docs/development/`** - Guias de desenvolvimento e arquitetura
- **`docs/database/`** - Documentação do banco de dados
- **`docs/deployment/`** - Guias de deploy

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/SuaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: SuaFeature'`)
4. Push para a branch (`git push origin feature/SuaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- 📧 Email: [seu-email@exemplo.com]
- 💬 Discord: [link-do-discord]
- 🐛 Issues: [GitHub Issues]

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [Lucide](https://lucide.dev/) - Ícones

---

**Desenvolvido com ❤️ para ajudar na preparação de concursos públicos**