# Guia de Referência do CI/CD

Este documento fornece uma visão geral do pipeline de CI/CD configurado para o projeto AprovAí, incluindo monitoramento de desempenho, verificação de segurança e estratégias de rollback.

## Visão Geral do Fluxo

O pipeline está configurado no arquivo `.github/workflows/ci-cd.yml` e é acionado por:

- **Push** para os branches `main` ou `develop`
- **Pull Requests** para os branches `main` ou `develop`
- **Disparo manual** através do GitHub Actions com opções de ambiente

### Novas Funcionalidades

1. **Testes de Desempenho**
   - Análise de performance com Lighthouse CI
   - Relatórios detalhados de métricas de desempenho
   - Verificação contínua de desempenho

2. **Verificação de Segurança**
   - Auditoria de dependências com `npm audit`
   - Análise de vulnerabilidades com Snyk
   - Relatórios de segurança detalhados

3. **Rollback Automático**
   - Reversão automática em caso de falha na implantação
   - Notificações detalhadas de status de implantação
   - Configuração flexível de rollback

## Jobs do Workflow

### 1. Testes (`test`)
- **Quando**: Executado em todos os eventos
- **O que faz**:
  - Configura um banco de dados PostgreSQL
  - Executa testes unitários
  - Executa testes E2E com Cypress
  - Executa auditoria de segurança das dependências
- **Ambiente**: Ubuntu com Node.js 18 e PostgreSQL 15

### 2. Testes de Desempenho (`performance`)
- **Quando**: Após os testes unitários e E2E
- **O que faz**:
  - Executa análise de desempenho com Lighthouse CI
  - Gera relatórios de métricas de desempenho
  - Armazena relatórios para análise contínua
- **Métricas Analisadas**:
  - Performance
  - Acessibilidade
  - Melhores Práticas
  - SEO
  - PWA

### 3. Build (`build`)
- **Quando**: Após os testes e análise de desempenho
- **O que faz**:
  - Instala dependências de produção
  - Constrói a aplicação com `npm run build`
  - Armazena os artefatos para implantação
- **Saída**: 
  - Artefatos de build no formato `.zip`
  - Relatórios de desempenho
  - Relatórios de segurança

### 4. Implantação em Staging (`deploy-staging`)
- **Quando**: Push para `develop` ou disparo manual
- **O que faz**:
  - Baixa os artefatos de build
  - Implanta no ambiente de staging
  - Executa verificações pós-implantação
- **Ambiente**: Configurado no GitHub como `staging`
- **Notificações**: Envia status para o canal do Slack

### 5. Implantação em Produção (`deploy-production`)
- **Quando**: 
  - Push para `main` (após aprovação)
  - Disparo manual com confirmação
- **O que faz**:
  - Baixa os artefatos de build
  - Cria backup do ambiente atual
  - Implanta a nova versão
  - Executa verificações de saúde
  - Em caso de falha, executa rollback automático
- **Rollback**:
  - Reverte para a versão estável anterior
  - Notifica a equipe sobre a falha
  - Gera relatório de incidente
- **Notificações**: Envia status detalhado para o Slack
- **Ambiente**: Configurado no GitHub como `production`

## Comandos Úteis

### Execução Local

```bash
# Executar todos os testes
npm run test:all

# Executar testes de desempenho
npm run test:perf

# Verificar segurança das dependências
npm run security:check

# Corrigir vulnerabilidades de segurança
npm run security:fix

# Iniciar servidor de relatórios do Lighthouse
npm run test:perf:server
```

### Implantação Manual

```bash
# Implantar em staging
github-cli workflow run ci-cd.yml -f environment=staging

# Implantar em produção (requer confirmação)
github-cli workflow run ci-cd.yml -f environment=production
```

## Monitoramento e Alertas

### Métricas de Desempenho
- **Lighthouse CI**: Relatórios detalhados de desempenho
- **Sentry**: Monitoramento de erros em tempo real
- **Logs**: Acesso aos logs de execução

### Configuração de Alertas
1. Acesse as configurações do repositório no GitHub
2. Navegue até "Secrets" > "Actions"
3. Adicione as seguintes variáveis:
   - `SLACK_WEBHOOK_URL`: Webhook para notificações do Slack
   - `SNYK_TOKEN`: Token de API do Snyk
   - `LHCI_GITHUB_APP_TOKEN`: Token para integração com GitHub

## Variáveis de Ambiente Necessárias

### Secrets do GitHub
| Nome | Descrição | Obrigatório |
|------|-----------|-------------|
| `CYPRESS_RECORD_KEY` | Chave para gravação de testes no Cypress Dashboard | Não |
| `STAGING_DEPLOY_KEY` | Chave SSH para deploy no ambiente de staging | Sim |
| `PRODUCTION_DEPLOY_KEY` | Chave SSH para deploy em produção | Sim |
| `SLACK_WEBHOOK_URL` | URL do webhook do Slack para notificações | Não |

### Variáveis de Ambiente do Banco de Dados
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=aprova_ja_ci
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aprova_ja_ci?schema=public
```

## Como Adicionar Novos Testes

1. **Testes Unitários**: Adicione arquivos `*.test.ts` ou `*.test.tsx` na pasta `__tests__`
2. **Testes E2E**: Adicione arquivos `*.cy.js` na pasta `cypress/e2e/`
3. **Testes de Integração**: Adicione arquivos `*.int.test.ts` na pasta `__tests__/integration/`

## Solução de Problemas Comuns

### Testes Falhando
1. Verifique os logs do GitHub Actions
2. Execute os testes localmente: `npm test` ou `npm run test:e2e`
3. Verifique se todas as variáveis de ambiente necessárias estão configuradas

### Falha no Build
1. Verifique erros de TypeScript: `npm run type-check`
2. Verifique erros de lint: `npm run lint`
3. Tente limpar o cache: `rm -rf .next`

### Problemas de Deploy
1. Verifique as permissões da chave SSH
2. Confirme se o servidor de destino está acessível
3. Verifique os logs de deploy no servidor

## Segurança

- Nunca comite credenciais no código-fonte
- Use sempre variáveis de ambiente para informações sensíveis
- Revise regularmente as permissões do GitHub Actions
- Monitore os logs de execução do workflow

## Personalização

### Adicionando Novos Ambientes
1. Adicione um novo job seguindo o padrão `deploy-<ambiente>`
2. Defina as condições de execução apropriadas
3. Configure as variáveis de ambiente específicas do ambiente

### Notificações Adicionais
Para adicionar mais notificações, você pode:
1. Usar a ação `rtCamp/action-slack-notify@v2`
2. Configurar webhooks adicionais
3. Usar a ação `actions/github-script` para integrações personalizadas

## Monitoramento

- Verifique o status dos workflows em `Actions` no GitHub
- Configure alertas para falhas de pipeline
- Monitore os ambientes de staging e produção após cada deploy

## Melhorias Futuras

- [ ] Adicionar testes de desempenho
- [ ] Implementar revisão de código automatizada
- [ ] Adicionar verificação de segurança de dependências
- [ ] Implementar rollback automático em caso de falha

## Suporte

Para problemas com o pipeline de CI/CD, entre em contato com a equipe de DevOps ou abra uma issue no repositório.
