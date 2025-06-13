# 📚 Concursos Study App

Uma plataforma completa e moderna para preparação de concursos públicos, desenvolvida com Next.js 15, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

### ✨ Recursos Principais
- **📝 Simulados Personalizados**: Simulados completos com timer e correção automática
- **🎯 Questões Semanais**: 100 questões selecionadas para prática semanal
- **📋 Plano de Estudos**: Plano inteligente baseado no seu tempo disponível
- **🗂️ Flashcards**: Sistema de memorização baseado nos seus pontos fracos
- **🗺️ Mapa de Assuntos**: Visualização organizada dos conteúdos
- **📖 Apostilas**: Material de estudo organizado por matéria
- **⚙️ Configurações**: Personalização da experiência de estudo

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

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm, yarn ou pnpm
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd study-app
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
# 1. Schema do banco
psql -h seu_host -U seu_usuario -d seu_banco -f scripts/schema.sql

# 2. Dados iniciais (opcional)
psql -h seu_host -U seu_usuario -d seu_banco -f scripts/seed.sql
```

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
study-app/
├── app/                    # App Router (Next.js 15)
│   ├── actions/           # Server Actions
│   ├── api/              # API Routes
│   ├── dashboard/        # Páginas do dashboard
│   │   ├── flashcards/   # Sistema de flashcards
│   │   ├── simulados/    # Simulados
│   │   ├── questoes-semanais/ # Questões semanais
│   │   ├── plano-estudos/     # Plano de estudos
│   │   ├── mapa-assuntos/     # Mapa de assuntos
│   │   └── configuracoes/     # Configurações
│   ├── login/            # Página de login
│   ├── register/         # Página de registro
│   └── layout.tsx        # Layout principal
├── components/           # Componentes React
│   ├── ui/              # Componentes base (Radix UI)
│   └── ...              # Componentes customizados
├── lib/                 # Utilitários e configurações
│   ├── supabase.ts      # Cliente Supabase
│   ├── utils.ts         # Funções utilitárias
│   └── database.types.ts # Tipos do banco de dados
├── hooks/               # Custom hooks
├── styles/              # Estilos globais
├── public/              # Arquivos estáticos
└── scripts/             # Scripts SQL
```

## 🎯 Funcionalidades Detalhadas

### Sistema de Autenticação
- Registro e login com email/senha
- Autenticação via Supabase Auth
- Proteção de rotas
- Middleware de autenticação

### Dashboard Principal
- Visão geral do progresso
- Estatísticas de estudo
- Acesso rápido às funcionalidades
- Gráficos de desempenho

### Simulados
- Simulados personalizados por matéria
- Timer configurável
- Correção automática
- Relatórios detalhados
- Histórico de tentativas

### Questões Semanais
- 100 questões selecionadas
- Dificuldade progressiva
- Feedback imediato
- Estatísticas de acerto

### Plano de Estudos
- Geração automática de planos
- Baseado no tempo disponível
- Ajuste dinâmico conforme progresso
- Lembretes e notificações

### Flashcards
- Sistema de repetição espaçada
- Categorização por matéria
- Progresso individual
- Modo de revisão

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Produção
npm run build        # Build para produção
npm run start        # Inicia o servidor de produção

# Qualidade de código
npm run lint         # Executa o ESLint
```

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

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
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