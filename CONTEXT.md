# 🧠 Preambulo de Contextualização do Projeto AprovaJá

Este documento serve para contextualizar inteligências artificiais e desenvolvedores sobre o projeto **AprovaJá**, garantindo que qualquer sugestão, código ou feature gerada seja totalmente compatível, consistente e integrada ao ecossistema atual do sistema.

---

## 1. Visão Geral

O AprovaJá é uma plataforma moderna, open source, para preparação de concursos públicos, desenvolvida com foco em modularidade, escalabilidade e experiência do usuário. O projeto segue princípios de DDD (Domain-Driven Design), separando responsabilidades por domínio e camada.

---

## 2. Estrutura de Pastas (atual)

```
aprovaJa-main/
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

---

## 3. Dependências e Stacks

### Principais Dependências (diretas e dev)

- **Next.js 15** (`next`)
- **React 19** (`react`, `react-dom`)
- **TypeScript** (`typescript`)
- **Tailwind CSS** (`tailwindcss`, `tailwind-merge`, `tailwindcss-animate`)
- **Radix UI** (todos os pacotes `@radix-ui/*`)
- **React Hook Form** (`react-hook-form`, `@hookform/resolvers`)
- **Zod** (`zod`)
- **Lucide React** (`lucide-react`)
- **Supabase** (`@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `@supabase/ssr`)
- **date-fns**
- **clsx**, **class-variance-authority**
- **cmdk**
- **embla-carousel-react**
- **input-otp**
- **next-themes**
- **react-day-picker**
- **react-resizable-panels**
- **recharts**
- **sonner**
- **vaul**
- **ws**

#### DevDependencies
- **Vitest** (`vitest`, `@vitest/ui`, `@vitest/coverage-istanbul`)
- **Testing Library** (`@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`)
- **ESLint** e plugins (`eslint`, `eslint-config-next`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `@typescript-eslint/*`, `@eslint/js`)
- **PostCSS**, **Autoprefixer**
- **jsdom**
- **dotenv**
- **@vitejs/plugin-react**
- **supabase** (CLI)

> **Nota:** O projeto **NÃO** utiliza `react-router-dom` (usa o roteamento nativo do Next.js/App Router).

---

## 4. Patterns e Boas Práticas

- DDD (Domain-Driven Design): separação clara por domínio e responsabilidade.
- Componentização: componentes reutilizáveis, baseados em Radix UI, com foco em acessibilidade.
- Hooks customizados: para lógica de autenticação, erros, mobile, toast, etc.
- Server Actions: uso de Server Actions do Next.js para lógica no backend.
- Repositórios: camada de acesso a dados separada (legado e nova).
- Cache: sistema de cache em memória e persistente para performance.
- Logger: logging centralizado e estruturado.
- Middlewares: para autenticação, controle de acesso, tratamento de erros.
- Validação: uso de Zod para schemas e validação de dados.
- Arquitetura modular: fácil expansão e manutenção.

---

## 5. Estilo de Design e UI/UX

- Design responsivo (mobile-first)
- Tema claro/escuro
- Componentes Radix UI customizados para acessibilidade
- Tailwind CSS para estilização rápida e consistente
- Ícones Lucide React
- Layout: sidebar para navegação, dashboard unificado, páginas administrativas separadas
- Paleta baseada em Tailwind, adaptável via configuração

---

## 6. Convenções de Código e Nomenclatura

- TypeScript em todo o projeto
- Inglês para código, português para textos e comentários quando necessário
- Commits: padrão Conventional Commits (feat:, fix:, chore:, refactor:)
- Kebab-case para arquivos, PascalCase para componentes, camelCase para funções e variáveis
- Testes: `<nome>.test.ts(x)` ou `<nome>-smoke.test.tsx`

---

## 7. Estrutura de Rotas e APIs

- Rotas App Router organizadas por domínio em `app/`
- Rotas REST em `app/api/`, organizadas por recurso/domínio
- Rotas administrativas em `app/admin/`
- Rotas de autenticação em `app/api/auth/` e páginas dedicadas
- Rotas de dashboard em `app/dashboard/`
- Rotas de teste: `/teste-sistema`, `/teste-selecao`, `/test-auth`

---

## 8. Banco de Dados

- Supabase/PostgreSQL
- Tabelas, triggers e índices definidos em scripts SQL na pasta `docs/database/`
- Principais tabelas: concursos, categorias, simulados, flashcards, apostilas, progresso de usuário, logs de auditoria, cache de performance
- Scripts: schema, setup completo, dados de exemplo, triggers e índices

---

## 9. Testes

- Cobertura: páginas, componentes, hooks, utilitários, integrações principais
- Tipos: unitários, smoke, e2e
- Setup global em `tests/setup.ts`

---

## 10. Observações e Recomendações

- Consistência: sempre seguir os patterns, estilos e convenções já adotados
- Expansão: novas features devem ser criadas em pastas/domínios próprios, seguindo a modularização
- Acessibilidade: priorizar componentes acessíveis (Radix UI, ARIA, etc)
- Performance: utilizar cache e lazy loading quando possível
- Documentação: atualizar este arquivo e o README conforme novas features
- Prompt adaptável: este preâmbulo deve ser atualizado sempre que houver mudanças relevantes

---

**IMPORTANTE:**
Qualquer código, componente, rota, API ou funcionalidade sugerida deve:
- Seguir a estrutura, padrões e tecnologias acima
- Ser integrada de forma natural ao ecossistema do AprovaJá
- Evitar dependências desnecessárias ou que conflitem com a stack atual
- Priorizar clareza, performance, acessibilidade e manutenibilidade

---

**Este arquivo deve ser usado como preâmbulo/contexto para qualquer IA ou desenvolvedor que vá contribuir ou gerar código para o AprovaJá.**

---

## 11. Detalhes Visuais: Cabeçalho, Cores, Bordas e Design System

### Cabeçalho (Header)
- O cabeçalho principal (`<header>`) é sticky (fixo no topo), com z-index alto (`z-40`), fundo semi-transparente (`bg-background/95`), efeito de blur (`backdrop-blur`), borda inferior (`border-b border-border`) e suporta backdrop-filter.
- Layout: logo centralizada, menu lateral (mobile) à esquerda, navegação do usuário à direita.
- Botão de menu: `Button` com variante `icon`, cor de fundo `bg-accent`, texto `text-accent-foreground`.
- Logo: imagem + texto com fonte bold, cor principal `text-[#1e40af]`.
- Navegação do usuário: componente `UserNav`.
- Sidebar (mobile): fundo, bordas e cores seguem tokens do sidebar definidos no CSS.

### Cores (Tokens e Paleta)
- Todas as cores são baseadas em tokens CSS custom properties, definidos em `:root` no `globals.css` e expandidos no `tailwind.config.ts`.
- Principais tokens:
  - `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, `--radius`.
  - Sidebar: `--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, etc.
- Exemplo de cor principal: `--primary: 217.2 91.2% 59.8%` (azul vibrante, usado em botões, destaques e gradientes).
- Cores são usadas via Tailwind (`bg-primary`, `text-primary`, `border-border`, etc) e via utilitários customizados.
- Gradientes: `.gradient-bg` usa `linear-gradient` com a cor primária.
- Cores adaptam-se ao tema claro/escuro via classes e tokens.

### Bordas e Radius
- Bordas: padrão `border` com cor `border-border` (token), aplicadas globalmente via `* { @apply border-border; }`.
- Radius: padrão global `--radius: 0.75rem;` (12px), usado em cards, botões, sidebar, etc.
- Variantes de radius em Tailwind: `rounded-lg`, `rounded-md`, `rounded-sm` são mapeados para `--radius`, `calc(--radius - 2px)`, `calc(--radius - 4px)`.
- Cards: `rounded-xl border bg-card text-card-foreground shadow-sm`.
- Botões: `rounded-lg` (ou `rounded-md`, `rounded-sm` conforme o tamanho).
- Sidebar: links com `rounded-lg`.

### Sombreamento e Efeitos
- Cards e botões usam `shadow-sm` por padrão, com hover em cards: `hover:shadow-lg hover:shadow-primary/5`.
- Efeito glass: `.glass-effect` aplica `backdrop-blur-sm bg-background/80 border border-border/50`.
- Focus ring: `.focus-ring` aplica `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

### Tipografia
- Fonte principal: `Inter`, fallback para `system-ui`, `sans-serif`.
- Títulos: `font-semibold tracking-tight`, tamanhos responsivos (`text-3xl`, `text-4xl`, etc).
- Textos secundários: `text-muted-foreground`.

### Utilitários Customizados
- `.container-padding`: padding responsivo horizontal.
- `.card-hover`: transição, sombra e leve elevação no hover.
- `.text-balance`: balanceamento de texto.
- Scrollbar customizada: cor de fundo `--muted`, thumb `--muted-foreground`, hover `--primary`.
- Animações: pulse, fade-in, slide-in, accordion-down/up.

### Exemplo de Header (Landing Page)
```jsx
<header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
  <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
    <Button size="icon" className="bg-accent text-accent-foreground" />
    <div className="absolute left-1/2 transform -translate-x-1/2">
      <Image src="/aprova_facil_logo.png" ... />
      <span className="text-xl font-black text-[#1e40af]">AprovaFácil</span>
    </div>
    <UserNav />
  </div>
</header>
``` 

---

## 12. Contextualização Hierárquica da Estrutura de Pastas e Arquivos

A seguir, uma explicação detalhada da estrutura do projeto, contextualizando cada pasta e arquivo importante, do nível mais alto até os arquivos de domínio, para facilitar a compreensão e integração de novas features ou manutenção.

### Raiz do Projeto
- **app/**: Diretório principal do App Router do Next.js. Contém todas as rotas, páginas, layouts e server actions do frontend e backend (API routes).
  - **page.tsx**: Landing page do sistema. Exibe a home, recursos principais e navegação inicial. Utiliza componentes como Header, Sidebar, UserNav e Cards para apresentar as features.
  - **layout.tsx**: Layout global do app, define wrappers e providers comuns a todas as páginas.
  - **client-layout.tsx**: Layout específico para páginas que exigem lógica de cliente.
  - **globals.css**: Estilos globais, tokens de cor, borda, radius, utilitários e customizações do design system.
  - **not-found.tsx**: Página 404 customizada.
  - **loading.tsx**: Tela de loading global.
  - **error.tsx**: Página de erro global.
  - **actions/**: Server Actions do Next.js, lógica de backend acionada por formulários ou interações do usuário.
  - **api/**: Rotas de API REST, organizadas por domínio (ex: /api/simulados, /api/auth, etc).
  - **admin/**: Páginas administrativas (monitoramento, validação, limpeza de cache, etc).
  - **dashboard/**: Área principal do usuário, com subpastas para cada domínio de estudo.
    - **simulados/**: Gerenciamento e execução de simulados.
      - **simulados-client.tsx**: Componente React responsável por exibir, filtrar e listar simulados disponíveis. Utiliza Cards, Badges, Inputs e Selects para UI.
      - **page.tsx**: Página principal da rota /dashboard/simulados. Busca dados no Supabase e renderiza SimuladosClient.
      - **[slug]/**: Rota dinâmica para cada simulado individual.
        - **page.tsx**: Página do simulado selecionado, renderiza o componente SimuladoClient com base no slug.
        - **simulado-client.tsx**: Componente que gerencia a lógica e UI de um simulado específico.
        - **resultado/**: Exibe o resultado do simulado resolvido.
          - **page.tsx**: Página de resultado, busca dados do usuário, respostas e questões, e renderiza ResultadoSimuladoClient.
          - **resultado-client.tsx**: Componente que exibe o detalhamento do resultado do simulado.
    - **apostilas/**, **plano-estudos/**, **questoes-semanais/**, **mapa-assuntos/**, **flashcards/**, **configuracoes/**: Cada subpasta representa um domínio funcional do dashboard, com páginas, componentes e lógica próprios.

- **components/**: Componentes React reutilizáveis e globais.
  - **sidebar-nav.tsx**: Componente de navegação lateral, exibe links para as principais áreas do dashboard. Usa ícones Lucide, estilização com Tailwind e tokens de cor.
  - **user-nav.tsx**: Menu do usuário, exibe avatar, opções de perfil, logout, etc.
  - **session-monitor.tsx**: Monitora a sessão do usuário e exibe alertas de expiração.
  - **ui/**: Componentes base customizados (ex: Card, Button, Input, Badge, etc), todos estilizados com Tailwind, tokens e variantes.
    - **card.tsx**: Componente base para cartões, com subcomponentes (CardHeader, CardTitle, CardContent, etc). Usado em toda a UI para exibir blocos de informação.
    - **button.tsx**: Componente base de botão, com variantes (default, outline, ghost, etc) e tamanhos.
    - **sheet.tsx**, **dialog.tsx**, **select.tsx**, **tabs.tsx**, etc: Componentes de UI baseados em Radix UI, customizados para o design system do projeto.

- **lib/**: Funções utilitárias, configuração de serviços e lógica compartilhada.
  - **logger.ts**: Logger centralizado, com suporte a diferentes níveis de log (debug, info, warn, error). Em desenvolvimento, loga no console com cores; em produção, pode enviar logs para serviços externos.
  - **supabase.ts**: Configuração e criação dos clientes Supabase (browser, server, route handler). Centraliza a conexão com o backend e banco de dados.
  - **cache.ts**: Gerenciador de cache, com métodos para get/set/delete/clear cache de performance do usuário, usando Supabase como backend.
  - **utils.ts**: Funções utilitárias diversas.

- **contexts/**: Contextos React para gerenciamento de estado global (ex: ConcursoContext para seleção de concurso).

- **docs/**: Documentação do projeto, scripts SQL do banco, guias de desenvolvimento e arquitetura.
  - **database/**: Scripts de schema, triggers, índices e dados de exemplo do banco PostgreSQL.
  - **development/**: Guias de arquitetura, padrões e reestruturação do sistema.

- **public/**: Arquivos estáticos (imagens, logos, etc).

- **scripts/**: Scripts de automação e manutenção (ex: limpeza de cache, setup de banco, geração de dados de exemplo).

- **src/**: Código fonte organizado por domínio e core.
  - **core/**: Lógica central (erros, database, utils, repositórios base).
  - **features/**: Funcionalidades de domínio (apostilas, auth, dashboard, flashcards, simulados, etc), cada uma com seus próprios serviços, hooks e componentes.

- **styles/**: Estilos globais e customizações do Tailwind.

- **tests/**: Testes automatizados (unitários, smoke, e2e), organizados por domínio e camada.

- **types/**: Tipos TypeScript globais e por domínio.

- **supabase/**: Configurações e migrações do Supabase.

- **package.json, tsconfig.json, tailwind.config.ts, etc**: Arquivos de configuração do projeto, dependências, scripts e setup de ferramentas.

---

> **Dica:** Para expandir a documentação, siga o padrão:
> - Explique o papel da pasta no contexto do projeto.
> - Para cada arquivo, escreva um comentário explicando sua função e como ele se encaixa na hierarquia.
> - Para subpastas, explique o domínio ou funcionalidade que ela representa. 