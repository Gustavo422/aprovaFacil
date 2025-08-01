# Sistema de Debug - AprovaFácil

Este documento descreve o sistema de debug completo implementado no AprovaFácil para rastrear todas as requisições entre frontend, backend e Supabase.

## 🚀 Como Usar

### Backend

#### Modo Debug Completo
```bash
cd backend
npm run dev:debug
```

Este comando irá:
- Executar o preflight check
- Iniciar o backend em modo debug
- Iniciar o frontend em modo debug
- Habilitar logs detalhados de todas as requisições

#### Modo Normal (sem debug)
```bash
cd backend
npm run dev
```

### Frontend

#### Modo Debug Individual
```bash
cd frontend
npm run dev:debug
```

#### Modo Normal
```bash
cd frontend
npm run dev
```

#### Ativar Debug via URL
Adicione `?debug=true` à URL do frontend:
```
http://localhost:3000?debug=true
```

## 📊 O que é Logado

### Backend (Terminal)

#### Requisições HTTP
- **Método**: GET, POST, PUT, DELETE, etc.
- **URL**: Endpoint completo
- **Código de Status**: 200, 404, 500, etc.
- **Duração**: Tempo de resposta em ms
- **Request ID**: Identificador único da requisição
- **Timestamp**: Data e hora exata

#### Supabase
- **Endpoint**: Método chamado (select, insert, update, delete)
- **Parâmetros**: Dados enviados
- **Headers**: Headers da requisição (sem dados sensíveis)
- **Resposta**: Estrutura dos dados retornados
- **Erros**: Detalhes completos de erros
- **Duração**: Tempo de execução

#### Frontend (Console do Navegador)

#### Requisições HTTP
- **Método**: GET, POST, PUT, DELETE, etc.
- **URL**: Endpoint consumido
- **Payload**: Dados enviados (sem dados sensíveis)
- **Código de Status**: 200, 404, 500, etc.
- **Duração**: Tempo de resposta
- **Erros**: Detalhes de erros de rede/parsing

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend
```env
NODE_ENV=development
DEBUG=true
```

#### Frontend
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

### Bibliotecas Utilizadas

#### Backend
- `debug`: Sistema de logging com namespaces
- `morgan`: Logging de requisições HTTP
- `express`: Middleware de interceptação

#### Frontend
- `axios`: Interceptors para requisições HTTP
- `react`: Hooks personalizados para debug

## 📝 Exemplos de Logs

### Backend - Requisição HTTP
```
🔄 Backend Request: {
  "type": "BACKEND_REQUEST",
  "requestId": "req_1703123456789_abc123",
  "method": "POST",
  "url": "/api/auth/login",
  "timestamp": "2023-12-21T10:30:45.123Z"
}
```

### Backend - Resposta HTTP
```
✅ Backend Response: {
  "type": "BACKEND_RESPONSE",
  "requestId": "req_1703123456789_abc123",
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 200,
  "duration": 150
}
```

### Supabase - Requisição
```
🚀 Supabase Request: {
  "type": "SUPABASE_REQUEST",
  "timestamp": "2023-12-21T10:30:45.123Z",
  "endpoint": "select",
  "method": "SUPABASE",
  "params": ["usuarios", {"id": "eq.123"}],
  "duration": "0ms"
}
```

### Supabase - Resposta
```
✅ Supabase Response: {
  "type": "SUPABASE_RESPONSE",
  "timestamp": "2023-12-21T10:30:45.456Z",
  "endpoint": "select",
  "method": "SUPABASE",
  "response": {
    "count": 1,
    "sample": [{"id": "123", "nome": "João"}],
    "structure": {"id": "string", "nome": "string"}
  },
  "duration": "333ms"
}
```

### Frontend - Requisição
```
📤 Frontend Request: {
  "type": "FRONTEND_REQUEST",
  "timestamp": "2023-12-21T10:30:45.123Z",
  "method": "POST",
  "url": "/api/auth/login",
  "payload": {"email": "user@example.com", "password": "[REDACTED]"}
}
```

### Frontend - Resposta
```
✅ Frontend Response: {
  "type": "FRONTEND_RESPONSE",
  "timestamp": "2023-12-21T10:30:45.456Z",
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 200,
  "duration": "333ms",
  "response": {"success": true, "token": "[REDACTED]"}
}
```

## 🛡️ Segurança

### Dados Sanitizados
O sistema automaticamente remove dados sensíveis dos logs:

- **Headers**: `authorization`, `cookie`, `set-cookie`, `x-api-key`
- **Payload**: `password`, `token`, `secret`, `key`
- **Respostas**: Tokens de autenticação

### Exemplo de Sanitização
```javascript
// Antes da sanitização
{
  "email": "user@example.com",
  "password": "senha123",
  "token": "jwt_token_here"
}

// Após sanitização
{
  "email": "user@example.com",
  "password": "[REDACTED]",
  "token": "[REDACTED]"
}
```

## 🎯 Componentes de Debug

### Backend
- `DebugLogger`: Classe principal para logging
- `debugRequestMiddleware`: Middleware para interceptar requisições HTTP
- `createSupabaseDebugWrapper`: Wrapper para interceptar chamadas do Supabase

### Frontend
- `useDebug`: Hook para gerenciar estado de debug
- `useHttpDebug`: Hook para monitorar requisições HTTP
- `DebugPanel`: Componente visual para debug
- `FloatingDebugButton`: Botão flutuante para toggle de debug

## 🔍 Troubleshooting

### Debug não aparece
1. Verifique se `NODE_ENV=development`
2. Verifique se `DEBUG=true` (backend) ou `NEXT_PUBLIC_DEBUG=true` (frontend)
3. Adicione `?debug=true` à URL do frontend
4. Verifique o console do navegador (F12)

### Logs muito verbosos
- Use namespaces específicos: `DEBUG=app:supabase` ou `DEBUG=app:backend`
- Desabilite temporariamente: `DEBUG=false`

### Performance
- O sistema de debug tem impacto mínimo em produção
- Logs são desabilitados automaticamente em `NODE_ENV=production`
- Dados grandes são truncados para evitar sobrecarga

## 📈 Monitoramento

### Métricas Disponíveis
- **Requisições**: Total de requisições HTTP
- **Respostas**: Total de respostas bem-sucedidas
- **Erros**: Total de erros de rede/parsing
- **Duração**: Tempo médio de resposta
- **Última atividade**: Timestamp da última requisição

### Painel de Debug
O componente `DebugPanel` mostra:
- Status do debug (ativo/inativo)
- Contadores de requisições/respostas/erros
- Informações do navegador
- Últimas atividades

## 🚀 Próximos Passos

1. **Logs Persistidos**: Salvar logs em arquivo para análise posterior
2. **Métricas Avançadas**: Dashboard com gráficos de performance
3. **Alertas**: Notificações para erros críticos
4. **Filtros**: Filtrar logs por tipo, endpoint, status code
5. **Exportação**: Exportar logs para análise externa

## 📞 Suporte

Para dúvidas ou problemas com o sistema de debug:
1. Verifique esta documentação
2. Consulte os logs de erro
3. Teste com `npm run dev:debug`
4. Abra uma issue no repositório 