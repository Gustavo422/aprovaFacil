# TODO-REFATORAÇÃO

## Contexto
Esta refatoração visa alinhar toda a navegação, imports, rotas e integrações do sistema para que cada feature principal seja acessível por uma rota de primeiro nível (ex: `/simulados`, `/cronograma`, etc.), e não mais aninhada sob `/guru-da-aprovacao`. Também removemos páginas e rotas obsoletas.

---

## O que já foi feito
- **Remoção das páginas:**
  - `guru-da-aprovacao/login/page.tsx` (login administrativo do dashboard)
  - `guru-da-aprovacao/logs/page.tsx` (logs do dashboard)
- **Reorganização das features:**
  - Todas as features principais agora estão em pastas de primeiro nível em `/app` (ex: `/app/cronograma`, `/app/simulados`, etc.)
  - A pasta `/app/guru-da-aprovacao` agora contém apenas o dashboard e suas subpáginas internas (docs, monitor, etc.)
- **Verificação de referências:**
  - Não há mais imports, links ou navegação para as páginas removidas.
  - Lint e TypeScript (`tsc`) passam sem erros.

---

## O que ainda precisa ser feito

### 1. **Frontend**
- [x] Atualizar todos os menus, sidebars e navegação para apontar para as novas rotas de primeiro nível. (Menus, sidebars e todos os hrefs do menu inicial (/) e menu lateral revisados e atualizados para as rotas de primeiro nível)
- [ ] Garantir que não há mais links, redirecionamentos ou imports para `/guru-da-aprovacao/login` e `/guru-da-aprovacao/logs`.
- [ ] Criar um layout compartilhado para as rotas de primeiro nível (ex: (main-layout)/layout.tsx), movendo as rotas para dentro desse grupo, garantindo header e sidebar consistentes. (Em andamento - resolverá ausência de cabeçalho e navegação lateral nas páginas de primeiro nível)
- [ ] Revisar todos os componentes de navegação (ex: sidebar, header, cards de dashboard) para garantir que as rotas estejam corretas. (Revisão dos hrefs em andamento)
- [ ] Atualizar testes automatizados de navegação e integração para refletir as novas rotas.
- [ ] Remover ou ajustar breadcrumbs, se existirem, para refletir a nova hierarquia.

### 2. **Backend/API**
- [ ] Garantir que as rotas de API estejam alinhadas com a nova estrutura de frontend.
- [ ] Remover endpoints de autenticação/admin que só faziam sentido para o login do dashboard, se existirem.
- [ ] Revisar middlewares de autenticação/autorização para garantir que não dependem de rotas antigas.
- [ ] Atualizar documentação de API (Swagger/OpenAPI) para refletir as rotas atuais.

### 3. **Supabase**
- [ ] Revisar triggers, policies e funções que possam depender de rotas antigas.
- [ ] Garantir que não há dependências quebradas por conta da mudança de navegação.

### 4. **Documentação**
- [ ] Atualizar README e documentação interna para explicar a nova estrutura de rotas.
- [ ] Adicionar instruções para desenvolvedores sobre como criar novas features seguindo o novo padrão.

---

## Observações
- Após cada etapa, rodar `npm run lint` e `npx tsc --noEmit` para garantir que não há erros.
- Rodar testes automatizados para garantir que a navegação e integrações continuam funcionando.
- Se necessário, envolver o time de backend para alinhar mudanças de API.

---

**Este arquivo deve ser atualizado conforme avançamos na refatoração!** 