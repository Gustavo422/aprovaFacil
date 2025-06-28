# Configuração do Ambiente de Desenvolvimento

Este guia explica como configurar seu ambiente de desenvolvimento local para trabalhar no projeto AprovAí, incluindo as ferramentas de monitoramento de desempenho e segurança.

## Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- PostgreSQL 15
- Git

## Configuração Inicial

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/seu-usuario/aprova-ja.git
   cd aprova-ja
   ```

2. **Instalar dependências**
   ```bash
   npm ci
   ```

3. **Configurar variáveis de ambiente**
   - Copie o arquivo `.env.example` para `.env.local`
   - Preencha as variáveis necessárias (consulte a seção de variáveis de ambiente abaixo)

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"

# Autenticação
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Monitoramento (opcional para desenvolvimento)
NEXT_PUBLIC_SENTRY_DSN=""
```

## Executando o Projeto

### Ambiente de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

### Executando Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes E2E
npm run test:e2e

# Executar testes de desempenho
npm run test:perf
```

## Ferramentas de Desenvolvimento

### Monitoramento de Desempenho

O projeto inclui integração com o Sentry para monitoramento de erros e desempenho:

- **Sentry**: Para acessar os relatórios, visite [Sentry.io](https://sentry.io)
- **Lighthouse CI**: Para análise de desempenho da aplicação

### Verificação de Segurança

```bash
# Verificar vulnerabilidades nas dependências
npm run security:check

# Corrigir vulnerabilidades automaticamente
npm run security:fix

# Monitorar dependências com Snyk (requer configuração)
npm run security:monitor
```

## Dicas de Desenvolvimento

1. **Antes de enviar um PR**:
   - Execute todos os testes: `npm run test:all`
   - Verifique a cobertura de código: `npm run test:coverage`
   - Execute a verificação de segurança: `npm run security:check`

2. **Depuração**:
   - Utilize as ferramentas de desenvolvedor do navegador
   - Verifique os logs do servidor no terminal
   - Consulte os relatórios do Sentry para erros em produção

3. **Performance**:
   - Use `npm run test:perf` para verificar métricas de desempenho
   - Considere executar o Lighthouse em builds locais

## Solução de Problemas Comuns

### Problemas de Banco de Dados

```bash
# Reiniciar o container do PostgreSQL (se estiver usando Docker)
docker-compose down
docker-compose up -d

# Executar migrações
npx prisma migrate dev
```

### Problemas de Cache

```bash
# Limpar cache do Next.js
npm run cache:clear-next

# Limpar cache do banco de dados
npm run cache:clear-db
```

## Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do Sentry](https://docs.sentry.io/)
- [Documentação do Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
