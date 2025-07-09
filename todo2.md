# Plano de Limpeza, Reorganização e Robustez do Projeto

## Objetivo Atual
Desenvolver uma **central web de monitoramento** para o backend, integrando:
- Health checks (status do servidor e dependências)
- Métricas de performance (requisições, uso de memória, CPU, endpoints lentos)
- Execução de testes automatizados (Vitest) via interface web
- Logs estruturados e visualização dos logs recentes
- Documentação Swagger/OpenAPI acessível pela central
- Dashboard visual com status, gráficos e ações rápidas (executar testes, abrir docs, etc.)
- (Futuro) Integração com alertas, autenticação/admin e CI/CD

## Progresso Atual
- [x] Integração inicial do dashboard web no backend
- [x] Health check e métricas básicas funcionando
- [x] Execução de testes via dashboard implementada
- [x] Visualização de logs recentes integrada
- [x] Documentação Swagger acessível pela central
- [x] Correção de todos os erros de build e lint (logger, imports, tipagem)
- [x] Dashboard visual básico funcionando
- [x] README e scripts de build/execução revisados
- [x] **NOVO: Sistema de monitoramento avançado implementado**
  - [x] Módulos de métricas do sistema (CPU, memória, uptime)
  - [x] Status do banco de dados (conexão, tabelas, performance)
  - [x] Status dos testes (arquivos, execução, cobertura)
  - [x] Status dos logs (recentes, estatísticas, arquivos)
  - [x] Dashboard web moderno com interface responsiva
  - [x] Execução de testes via interface web
  - [x] Gráficos de performance em tempo real
  - [x] Testes automatizados para o sistema de monitoramento
  - [x] Build e lint 100% limpos
- [x] **MELHORIAS IMPLEMENTADAS: Dashboard Avançado**
  - [x] Sistema de armazenamento temporário de métricas para histórico
  - [x] Gráficos históricos de CPU, memória e banco de dados (24h)
  - [x] Alertas visuais automáticos para problemas de performance
  - [x] Estatísticas avançadas (picos, médias, totais)
  - [x] Interface moderna com glass effect e animações
  - [x] Cards informativos com resumos e métricas detalhadas
  - [x] Endpoints separados para histórico e alertas
  - [x] Dark mode toggle e responsividade total

## Roadmap de Evolução da Central de Monitoramento

### 1. Dashboard realmente informativo ✅
- [x] Cards com status detalhado (uptime, dependências, banco, fila, jobs, etc.)
- [x] Gráficos históricos (últimas 24h, semana, mês)
- [x] Alertas visuais para erros, lentidão, falhas de integração

### 2. Integração profunda com Vitest
- [x] Listar todos os testes, com status (passou/falhou)
- [x] Permitir rodar testes individuais ou por arquivo
- [x] Mostrar cobertura de testes (coverage)
- [x] Histórico de execuções, logs e tempo de execução

### 3. Swagger/OpenAPI explorável
- [x] Visualização dos endpoints, schemas, exemplos e responses direto no dashboard
- [x] Busca de endpoints, filtro por tag
- [x] Testar endpoints (try it out) sem sair do dashboard
- [x] Download do JSON/YAML da especificação

### 4. Logs avançados
- [x] Filtros por nível, serviço, data/hora, busca por texto
- [x] Destaque para erros críticos e warnings
- [x] Download/export dos logs
- [x] Visualização em tempo real (streaming)

### 5. Ações rápidas e integrações
- [x] Feedback visual detalhado (loading, sucesso, erro, histórico de ações)
- [x] Exibição condicional de botões sensíveis conforme o papel do usuário (admin/dev/read-only)

### 6. Autenticação/admin
- [x] Login obrigatório para acessar a central
- [x] Permissões por usuário (admin, dev, read-only)
- [ ] Auditoria de ações

### 7. UX/UI ✅
- [x] Dark mode real, responsividade total
- [x] Layout inspirado no frontend, mas com foco em dados técnicos
- [ ] Documentação e onboarding para devs

## O que falta fazer / próximos passos
- [ ] Aplicar lógica de permissão (admin/dev/read-only) em todas as páginas sensíveis (ex: execução de testes, ações administrativas)
- [ ] Iniciar estrutura de auditoria de ações no backend (registro de execuções, downloads, etc)
- [ ] Melhorar feedback visual para ações bloqueadas (ex: toast/modal explicativo)
- [ ] Revisar e documentar roles e permissões no README/onboarding
- [ ] (Opcional) Exibir painel de auditoria para admins

---

## Plano de Ação Imediato

1. **Aplicar lógica de permissão em todas as páginas sensíveis**
   - Garantir que botões e ações administrativas só apareçam para quem tem permissão.
   - Exibir feedback visual claro para usuários sem permissão.
2. **Implementar auditoria de ações no backend**
   - Registrar ações sensíveis (execução de testes, exportação de logs, login, etc) em uma tabela de auditoria.
   - (Opcional) Exibir painel de auditoria para admins no frontend.
3. **Revisar e documentar roles e permissões**
   - Atualizar README/onboarding com exemplos de roles, permissões e fluxo de autenticação.
4. **Melhorar feedback visual para ações bloqueadas**
   - Exibir toasts, modais ou tooltips explicativos quando o usuário não tiver permissão para determinada ação.

---

> **Nota:** O dashboard está robusto, seguro e pronto para evoluir para integrações ainda mais avançadas (CI/CD, auditoria, onboarding, etc).
