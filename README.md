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
├── scripts/             # Scripts de automação
├── docs/                # Documentação
│   ├── database/        # Scripts e documentação do banco
│   ├── development/     # Guias de desenvolvimento
│   └── deployment/      # Guias de deploy
└── src/                 # Código fonte organizado
    ├── core/            # Lógica central
    └── features/        # Funcionalidades específicas
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

## 📚 Documentação Adicional

- **`docs/development/`** - Guias de desenvolvimento
- **`docs/database/`** - Documentação do banco de dados
- **`docs/deployment/`** - Guias de deploy

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

# Study App - Sistema de Administração

Interface web para inserir dados no banco Supabase via JSON.

## 🚀 Como Usar

1. **Abra o arquivo `admin-interface.html`** em um servidor local
2. **Cole seu JSON** no campo de texto
3. **Clique em "Inserir Dados"** para salvar no banco

## 📋 Tipos de Conteúdo Suportados

### 1. Simulados (Metadados Apenas)

```json
{
  "title": "Simulado de Matemática",
  "description": "Questões de álgebra e geometria",
  "questions_count": 20,
  "time_minutes": 60,
  "difficulty": "Médio",
  "is_public": true
}
```

### 2. Simulados com Questões (NOVO!)

```json
{
  "title": "Simulado de Direito Constitucional",
  "description": "Questões de concursos recentes",
  "time_minutes": 60,
  "difficulty": "Médio",
  "is_public": true,
  "questions": [
    {
      "question_number": 1,
      "question_text": "Qual é o princípio fundamental que garante a inviolabilidade do direito à vida?",
      "alternatives": {
        "A": "Princípio da dignidade da pessoa humana",
        "B": "Princípio da igualdade",
        "C": "Princípio da legalidade",
        "D": "Princípio da separação dos poderes",
        "E": "Princípio da soberania"
      },
      "correct_answer": "A",
      "explanation": "O princípio da dignidade da pessoa humana é o fundamento da República.",
      "discipline": "Direito Constitucional",
      "topic": "Princípios Fundamentais",
      "difficulty": "Fácil"
    }
  ]
}
```

### 3. Questões Semanais

```json
{
  "title": "Questões da Semana 1",
  "description": "Questões de revisão semanal",
  "week_number": 1,
  "year": 2024,
  "is_public": true
}
```

### 4. Flashcards

```json
{
  "front": "O que é Direito Constitucional?",
  "back": "Ramo do direito que estuda a Constituição e suas normas",
  "disciplina": "Direito Constitucional",
  "tema": "Conceitos Básicos",
  "subtema": "Definição",
  "is_public": true
}
```

### 5. Apostilas

```json
{
  "title": "Apostila de Direito Administrativo",
  "description": "Material completo para concursos",
  "concurso_id": "uuid-do-concurso",
  "is_public": true
}
```

### 6. Mapa de Assuntos

```json
{
  "disciplina": "Direito Constitucional",
  "tema": "Princípios Fundamentais",
  "subtema": "Dignidade da Pessoa Humana",
  "concurso_id": "uuid-do-concurso",
  "is_public": true
}
```

## 🔧 Configuração

### 1. Credenciais do Supabase

Edite as variáveis no arquivo `admin-interface.html`:

```javascript
const SUPABASE_URL = 'sua-url-do-supabase';
const SUPABASE_KEY = 'sua-chave-anon-do-supabase';
```

### 2. Tabela de Questões (NOVO!)

Para usar simulados com questões, execute o script SQL:

```sql
-- Execute o arquivo scripts/create-questions-table.sql no seu Supabase
```

## ✅ Validações

O sistema valida automaticamente:

- ✅ Campos obrigatórios
- ✅ Tipos de dados corretos
- ✅ Valores permitidos (ex: dificuldades)
- ✅ Estrutura das questões (alternativas, respostas corretas)
- ✅ Números de questões sequenciais

## 🎯 Exemplos Prontos

Veja os arquivos na pasta `exemplos/`:

- `simulado-com-questoes.json` - Exemplo completo de simulado com questões
- Outros exemplos para cada tipo de conteúdo

## 🔒 Segurança

- ✅ Validação rigorosa antes da inserção
- ✅ Políticas de segurança do Supabase ativas
- ✅ Apenas dados válidos são aceitos
- ✅ Logs de auditoria automáticos

## 📝 Notas

- **Simulados com questões**: Cria automaticamente o simulado e todas as questões relacionadas
- **Validação em tempo real**: O botão só fica ativo quando o JSON é válido
- **Detecção automática**: O sistema identifica o tipo de conteúdo automaticamente
- **Feedback visual**: Status claro sobre sucesso ou erros
