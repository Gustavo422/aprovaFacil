# AprovaFácil – Monorepo

Plataforma de estudos para concursos públicos. Monorepo com `frontend` (Next.js 15, React 19), `backend` (Express + TypeScript) e `supabase` (migrations, functions).

## Visão geral
- Frontend: Next.js (App Router), TanStack Query 5, Zustand, Tailwind, Radix UI
- Backend: Express, autenticação JWT/cookies, CORS, rate-limit, logs estruturados, OpenAPI/Swagger
- Banco: Supabase (Postgres + Auth). Tipos TS gerados para frontend e backend

## Estrutura
```
.
├── backend/         # API Express + TS (Vitest, ESLint)
├── frontend/        # Next.js 15 + React 19 + Tailwind
├── supabase/        # config.toml, functions/, migrations/
├── scripts/         # utilitários (start-full, updates Supabase, etc.)
└── README.md
```

## Requisitos
- Node.js 18+
- npm
- Projeto no Supabase (CLI opcional)

## Como rodar (desenvolvimento)
- Raiz
  - `npm run dev`: sobe apenas o frontend (`frontend/`)
  - `npm run dev:full`: inicia backend e frontend em paralelo (`scripts/start-full.js`)

- Backend (`/backend`)
  - `npm run dev`: executa `src/index.ts` com `tsx` (porta padrão 5000)
  - `npm run build` e `npm start`
  - `npm run preflight`: valida ambiente, checa versões, schema Supabase e gera relatório em `backend/logs/`

- Frontend (`/frontend`)
  - `npm run dev` (porta padrão 3000)
  - `npm run build` e `npm start`

## Variáveis de ambiente
- Frontend (`/frontend`)
  - `NEXT_PUBLIC_BACKEND_API_URL` (obrigatória; ex.: `http://localhost:5000`)
  - `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (opcionais)

- Backend (`/backend`)
  - Obrigatórias: `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `DATABASE_URL`, `PGPASSWORD`
  - Opcionais: `PORT` (padrão 5000), `FRONTEND_URL` (p/ CORS; padrão `http://localhost:3000`)
  - O backend valida formato/tamanho no startup (ver `backend/src/config/environment.ts`)

Mantenha `.env*` fora do Git (regras em `.gitignore`).

## Supabase
- Migrations: `supabase/migrations/`
- Functions Edge: `supabase/functions/`
- Tipos TypeScript (raiz):
  - Powershell (recomendado):
    - `npm run supabase:types:backend`  (usa `$env:SUPABASE_PROJECT_REF`)
    - `npm run supabase:types:frontend` (usa `$env:SUPABASE_PROJECT_REF`)
    - `npm run supabase:types:all`
  - Local (sem projeto remoto):
    - `npm run supabase:types:backend:local`
    - `npm run supabase:types:frontend:local`

## Documentação da API (OpenAPI/Swagger)
- Servida em tempo de execução: `http://localhost:5000/api/docs`
- Export estático: `cd backend && npm run openapi:export` (gera `backend/openapi.json` – ignorado pelo Git)

## Quality CI

- O repositório possui um workflow `quality-ci.yml` que executa:
  - Backend: typecheck (`npm run typecheck`), lint (`npm run lint`), testes (`npm run test:run`) e contratos (`npm run contracts:test`).
  - Frontend: typecheck (`npm run type-check`), lint (`npm run lint`) e testes (`npm run test:ci`).
  - Knip: análise de código morto em `backend/` e `frontend/` com relatórios anexados como artifacts.

Knip: para varredura local, rode:

```bash
cd backend && npx knip
cd ../frontend && npx knip
```
- Validação do contrato: `npm run contracts:test` no `backend`

## Testes
- Backend: Vitest (`npm run test`, `npm run test:coverage`, `npm run test:ui`)
- Frontend: Vitest + Playwright/Cypress (`npm run test`, `npm run test:playwright` etc.)

## Fluxo de desenvolvimento sugerido
1) Configure `.env` no `backend/` e `.env.local` no `frontend/`
2) Gere tipos do Supabase (raiz): `npm run supabase:types:all`
3) Rode o preflight do backend: `cd backend && npm run preflight`
4) Inicie tudo: `npm run dev:full`

## Endpoints e integração
- Backend expõe endpoints sob `/api` (ex.: `/api/health`, `/api/auth/*`, `/api/simulados/*` etc.)
- Frontend possui rotas API em `frontend/app/api/*` que fazem proxy para o backend via `lib/api-utils.ts` (`getBackendUrl()`)

## Observabilidade e logs
- Backend: logs estruturados, rate-limit e validação de ambiente; relatórios do preflight em `backend/logs/*.json`
- Frontend: React Query Devtools habilitado no `ReactQueryProvider`

## Licença
MIT