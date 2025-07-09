# 📋 TODO - AprovaFácil 2.0 — Guia Completo de Evolução e Boas Práticas

> **Este documento é o centro de comando do projeto. Use-o para acompanhar, planejar, revisar e aprender. Cada seção traz contexto, critérios de aceitação, dicas e links úteis.**

---

## 🤝 ALINHAMENTO TOTAL: FRONTEND, BACKEND E BANCO DE DADOS

> **Todos os módulos do sistema devem "falar a mesma língua" e ir na mesma direção.**

- **Contratos e Tipos Compartilhados:**
  - Garanta que os tipos TypeScript, DTOs, schemas de validação e contratos de API estejam sincronizados entre frontend, backend e banco.
  - Use geração automática de tipos a partir do schema do banco sempre que possível.
  - **Critério de aceitação:** Mudanças no banco refletem nos tipos do backend e frontend sem divergências.

- **Padronização de Respostas e Erros:**
  - Todas as APIs devem retornar respostas padronizadas (ex: `{ success, data, error }`).
  - Mensagens de erro e status HTTP devem ser consistentes em toda a stack.

- **Nomenclatura e Semântica:**
  - Use nomes de campos, tabelas, endpoints e variáveis consistentes em todos os módulos.
  - Documente convenções de nomenclatura (camelCase, snake_case, PascalCase) e siga-as rigorosamente.

- **Direção Única de Evolução:**
  - Antes de criar novas features, alinhe requisitos e contratos entre as equipes de frontend, backend e banco.
  - Use reuniões rápidas de alinhamento e PRs de documentação para evitar retrabalho.

---

## 🎨 UX/UI E PADRONIZAÇÃO DO FRONTEND

- **Experiência do Usuário (UX):**
  - Priorize feedback visual claro (spinners, skeletons, toasts, mensagens de erro).
  - Teste fluxos críticos em dispositivos reais e simuladores (mobile, tablet, desktop).
  - Use componentes reutilizáveis e acessíveis (ex: Radix UI, Headless UI).
  - **Critério de aceitação:** Usuário nunca fica sem feedback em ações assíncronas.

- **Padronização Visual e de Código:**
  - Siga um design system (cores, espaçamentos, tipografia, ícones).
  - Use ESLint, Prettier e Storybook para garantir padronização de código e UI.
  - Documente padrões de componentes e estilos.

---

## 🔑 FLUXO DE LOGIN — ESTABILIZAÇÃO E PADRONIZAÇÃO

> **O login é a porta de entrada do sistema. Instabilidades ou inconsistências afetam toda a experiência.**

- **Problema Atual:**
  - O fluxo de login apresenta instabilidades (ex: erros intermitentes, mensagens pouco claras, UX inconsistente).

- **Ações para estabilizar:**
  1. **Padronizar contratos de autenticação:**
     - Backend deve sempre retornar `{ success, data, error }` com status HTTP correto.
     - Mensagens de erro devem ser claras e amigáveis.
  2. **Sincronizar tipos e validação:**
     - Use Zod ou Yup para validar dados no frontend e backend.
     - Tipos de usuário, tokens e erros devem ser idênticos em toda a stack.
  3. **UX/UI do login:**
     - Adicione loading states, feedback de erro, e bloqueio de múltiplos submits.
     - Mensagens de erro devem ser exibidas de forma destacada e acessível.
     - Teste o fluxo em diferentes navegadores e dispositivos.
  4. **Testes automatizados:**
     - Crie testes E2E cobrindo login válido, inválido, bloqueio por rate limit, e recuperação de senha.
  5. **Documentação:**
     - Documente o fluxo de login, exemplos de resposta e possíveis erros.

- **Critérios de aceitação para o login:**
  - Login nunca falha silenciosamente.
  - Mensagens de erro são claras e padronizadas.
  - Não há divergência de tipos entre frontend, backend e banco.
  - Testes automatizados cobrem todos os cenários principais.
  - Usuário recebe feedback imediato em qualquer situação.

---

## 📊 PROGRESSO DO PROJETO

- **APIs principais:** 100% concluídas
- **Cobertura de testes:** ~60% (meta: 80%)
- **Integração frontend-backend:** ~80% (resta eliminar acesso direto ao Supabase)
- **RLS e segurança:** ~60% (migração criada, falta aplicar e validar)
- **Monitoramento e observabilidade:** 70%
- **Documentação:** 60%
- **Infraestrutura/CI/CD:** 40%
- **UX e frontend:** 80%
- **Média geral estimada:** **~69% concluído**

> **Falta aproximadamente 31% para o projeto atingir o nível de "MVP robusto e seguro".**

---

## 🚀 COMANDOS ÚTEIS PARA DESENVOLVEDORES

### Testes automatizados

- **Rodar todos os testes unitários/integrados:**
  ```bash
  # Backend
  cd backend && npm run test
  # Frontend
  cd frontend && npm run test
  ```
- **Cobertura de testes:**
  ```bash
  # Backend
  cd backend && npm run test:coverage
  # Frontend
  cd frontend && npm run test:coverage
  ```
- **Testes E2E:**
  ```bash
  # Frontend (Playwright)
  cd frontend && npm run test:playwright
  # Backend (Vitest E2E)
  cd backend && npm run test:e2e
  ```
- **Modo watch:**
  ```bash
  npm run test:watch
  ```

### Lint e formatação

- **Checar lint:**
  ```bash
  # Backend
  cd backend && npm run lint
  # Frontend
  cd frontend && npm run lint
  ```
- **Corrigir lint automaticamente:**
  ```bash
  npm run lint:fix
  ```
- **Checar formatação Prettier:**
  ```bash
  npm run format
  ```

### Typecheck (TypeScript)

- **Checar tipos sem emitir arquivos:**
  ```bash
  # Backend
  cd backend && npx tsc --noEmit
  # Frontend
  cd frontend && npx tsc --noEmit
  ```

### Outras dicas

- **Executar build de produção:**
  ```bash
  npm run build
  ```
- **Rodar localmente:**
  ```bash
  npm run dev
  ```
- **Verificar status de endpoints e monitoramento:**
  ```bash
  # Backend
  cd backend && npm run status
  ```

---

## 🚨 **PROBLEMAS CRÍTICOS & DIRETRIZES DE ARQUITETURA**

### 1. **Arquitetura e Integração (Prioridade Máxima)**
- [ ] **CRÍTICO**: Eliminar duplicidade de acesso ao Supabase
  - **Por quê?** Garante segurança, centralização de regras de negócio, logging e políticas de acesso.
  - **Como resolver:**
    - Refatore todos os serviços do frontend para consumir apenas endpoints do backend (Express/Next.js API routes).
    - Use hooks customizados para abstrair chamadas HTTP.
    - **Ferramentas:** TanStack Query, React Query, SWR.
    - **Critério de aceitação:** Nenhum arquivo do frontend deve importar ou instanciar o client do Supabase diretamente.
- [ ] **CRÍTICO**: Aplicar migração de RLS no Supabase e validar políticas
  - **Por quê?** RLS (Row Level Security) é essencial para garantir que cada usuário só acesse seus próprios dados.
  - **Como resolver:**
    - Execute a migração SQL no painel do Supabase ou via CLI.
    - Teste todas as queries com diferentes perfis de usuário.
    - **Links úteis:** [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
    - **Critério de aceitação:** Nenhuma query retorna dados de outro usuário; testes automatizados cobrem cenários de acesso negado.
- [ ] **CRÍTICO**: Garantir que todas as features do frontend usem APIs do backend
  - **Checklist:**
    - [ ] CRUD de concursos, apostilas, simulados, flashcards, plano de estudos, etc.
    - [ ] Autenticação, preferências, progresso, estatísticas.
    - [ ] Upload/download de arquivos (usar endpoints do backend para proxy se necessário).

---

## 🔧 **INTEGRAÇÃO BACKEND-FRONTEND-BANCO**

### 2. **Configuração do Backend**
- [x] Supabase configurado no backend Express.js
- [x] Middleware de autenticação JWT implementado
- [x] Sistema de validação de dados (Zod)
- [x] Logging estruturado (Winston)
- [x] CORS configurado
- [x] Health check e graceful shutdown
- **Dica:** Use middlewares para logging, validação e autenticação em todas as rotas. Centralize erros com um error handler global.

### 3. **Sincronização de Tipos**
- [x] DTOs do backend atualizados conforme schema real
- [x] Tipos compartilhados entre frontend e backend
- [x] Validação com Zod
- [ ] Gerar tipos automaticamente do schema do banco (automatizar via script)
  - **Ferramentas:** [openapi-typescript](https://github.com/drwpow/openapi-typescript), [supabase gen types](https://supabase.com/docs/guides/database/api/generating-types)
  - **Critério de aceitação:** Mudanças no schema do banco refletem automaticamente nos tipos do backend e frontend.

### 4. **API Routes**
- [x] Rotas do backend refatoradas e descomentadas
- [x] CRUD completo para entidades principais
- [x] Paginação e filtros avançados
- [ ] Adicionar cache de resposta (backend e frontend)
  - **Dica:** Use Redis para cache de queries frequentes e TanStack Query para cache no frontend.
  - **Critério de aceitação:** Endpoints críticos retornam em <200ms para dados já cacheados.

---

## 🗄️ **BANCO DE DADOS & SEGURANÇA**

### 5. **Segurança e Políticas**
- [x] Migração de RLS criada (20241217000000_enable_rls_policies.sql)
- [ ] Aplicar migração de RLS no Supabase
- [ ] Validar e revisar políticas RLS para todas as tabelas
- [ ] Adicionar triggers de auditoria
  - **Dica:** Use triggers para popular tabela `audit_logs` em inserts/updates/deletes críticos.
  - **Critério de aceitação:** Toda alteração sensível gera um log de auditoria.

### 6. **Performance e Otimização**
- [ ] Revisar índices existentes (use EXPLAIN ANALYZE nas queries mais lentas)
- [ ] Implementar cache de consultas frequentes (ex: Redis)
- [ ] Otimizar queries complexas (evite N+1, use joins e views)
- [ ] Configurar autovacuum
  - **Links úteis:** [Postgres Indexing Best Practices](https://www.cybertec-postgresql.com/en/indexing-in-postgresql/)

---

## 🧪 **TESTES E QUALIDADE**

### 7. **Testes Automatizados**
- [x] Testes unitários e integração (Vitest)
- [x] Testes E2E (Playwright, Vitest)
- [ ] Cobertura de código > 80%
- [ ] Testes de performance e carga (ex: k6, Artillery)
- [ ] Testes de segurança (autorização, RLS, XSS, CSRF)
  - **Dica:** Use scripts de seed para popular o banco em ambiente de teste.
  - **Critério de aceitação:** PRs só são aceitos se não reduzirem cobertura e todos os testes passarem no CI.

---

## 🔒 **SEGURANÇA AVANÇADA**

### 8. **Autenticação e Autorização**
- [x] Autenticação JWT e validação de sessão
- [ ] Implementar refresh tokens (expiração curta + refresh seguro)
- [ ] Adicionar 2FA (autenticação de dois fatores)
- [ ] Rate limiting por usuário (ex: express-rate-limit)
- [ ] Headers de segurança adicionais (ex: helmet, CORS restritivo)
  - **Critério de aceitação:** Testes automatizados cobrem tentativas de acesso não autorizado e brute force.

### 9. **Auditoria e Logs**
- [x] Logging estruturado backend (Winston, JSON logs)
- [ ] Implementar auditoria completa (audit_logs)
- [ ] Limpeza automática de logs antigos (ex: cron job)
- [ ] Dashboard de auditoria (visualização dos logs, alertas)
  - **Dica:** Use dashboards como Grafana, Kibana ou até um painel customizado.

---

## 📊 **MONITORAMENTO E OBSERVABILIDADE**

### 10. **Observabilidade**
- [x] Dashboard web de monitoramento (backend)
- [x] Endpoints de métricas e health
- [ ] APM (Application Performance Monitoring) — ex: Sentry, Datadog, NewRelic
- [ ] Alertas automáticos (ex: UptimeRobot, StatusCake)
- [ ] Monitoramento de queries lentas (pg_stat_statements, logs do Supabase)
  - **Critério de aceitação:** Alertas automáticos para downtime, lentidão e erros críticos.

---

## 🚀 **DEPLOYMENT & INFRAESTRUTURA**

### 11. **Infraestrutura**
- [ ] Configurar CI/CD pipeline (ex: GitHub Actions, GitLab CI)
- [ ] Deploy automatizado para produção (verificar rollback)
- [ ] Ambiente de staging (espelho da produção para testes)
- [ ] Rollback automático (ex: via CI/CD ou scripts)
- [ ] Backup automático de dados (cron jobs, Supabase backups)
  - **Links úteis:** [GitHub Actions Docs](https://docs.github.com/en/actions)

### 12. **Documentação**
- [x] Documentação Swagger/OpenAPI gerada
- [ ] Guia de desenvolvimento atualizado (exemplos de uso, setup local, troubleshooting)
- [ ] Documentação de deploy (passo a passo, variáveis de ambiente, scripts)
- [ ] Troubleshooting guide (FAQ, erros comuns, links de suporte)
  - **Critério de aceitação:** Qualquer dev novo consegue rodar o projeto e entender a arquitetura em 1h.

---

## 🎨 **FRONTEND, UX & ACESSIBILIDADE**

### 13. **Interface e Experiência**
- [x] Loading states e feedback visual (spinners, skeletons, toasts)
- [x] Error boundaries (tratamento global de erros)
- [x] Responsividade (testar em mobile/tablet/desktop)
- [ ] Otimizar performance do frontend (lazy loading, code splitting, compressão)
- [ ] Implementar cache no cliente (TanStack Query, SWR)
- [ ] Adicionar PWA features (manifest, offline, push)
  - **Critério de aceitação:** Lighthouse score >90 em performance e acessibilidade.

### 14. **Funcionalidades Avançadas**
- [ ] Busca avançada (filtros, autocomplete)
- [ ] Filtros dinâmicos (por categoria, status, etc)
- [ ] Exportação de dados (PDF, Excel)
- [ ] Notificações em tempo real (WebSocket, Supabase Realtime)
- [ ] Gamificação (pontos, badges, rankings)
  - **Dica:** Use bibliotecas como react-pdf, xlsx, socket.io.

---

## 📝 **CÓDIGO, PADRÕES E QUALIDADE**

### 15. **Refatoração e Qualidade**
- [x] ESLint e Prettier configurados (padronização automática)
- [x] Husky hooks (pre-commit, pre-push)
- [ ] Remover código duplicado (DRY)
- [ ] Padronizar nomenclatura (camelCase, PascalCase, snake_case onde apropriado)
- [ ] Implementar design patterns (Service, Repository, Factory, etc)
- [ ] Code review automático (ex: SonarCloud, CodeClimate)
  - **Critério de aceitação:** Nenhum code smell crítico, PRs revisados por pelo menos 1 dev.

---

## 🔄 **PRÓXIMOS PASSOS IMEDIATOS**

1. [ ] Aplicar migração de RLS no Supabase e validar políticas
2. [ ] Eliminar acesso direto ao Supabase no frontend (usar apenas backend)
3. [ ] Aumentar cobertura de testes (>80%) e incluir testes de segurança
4. [ ] Implementar cache de resposta e otimizações de performance
5. [ ] Configurar CI/CD e deploy automatizado
6. [ ] Atualizar documentação e guias de desenvolvimento

---

## 📈 **MÉTRICAS DE SUCESSO**

- [x] 100% das APIs principais implementadas
- [ ] Cobertura de testes > 80%
- [ ] Tempo de resposta < 200ms para 95% das requisições
- [ ] Uptime > 99.9%
- [ ] Zero vulnerabilidades de segurança críticas
- [ ] Documentação 100% completa
- [ ] Onboarding de devs em <1h

---

**Status:** Backend e monitoramento avançados, integração frontend-backend em progresso, RLS pendente de aplicação, testes e cobertura parciais, documentação Swagger disponível.

> **Dica final:** Revise este documento a cada sprint. Use-o como referência para onboarding, retrospectivas e planejamento. Marque o que for concluído, adicione links, exemplos e aprendizados ao longo do tempo. O TODO.md é vivo! 