# Guia de Implantação

Este guia fornece instruções detalhadas para configurar e implantar o AprovAí em um ambiente de produção.

## Pré-requisitos

- Node.js 18+ e npm 9+
- PostgreSQL 14+
- Conta no [Sentry](https://sentry.io) para monitoramento de erros
- Acesso ao servidor de produção
- Permissões de administrador no servidor

## Configuração do Ambiente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/aprova-ja.git
   cd aprova-ja
   ```

2. **Instale as dependências**
   ```bash
   npm ci --production=false
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Copie o arquivo de exemplo
   cp .env.production.example .env.production
   
   # Ou use o script interativo
   npm run setup:prod
   ```
   
   O script irá guiá-lo através da configuração das seguintes variáveis:
   - `NEXT_PUBLIC_SENTRY_DSN`: DSN do Sentry para o cliente
   - `SENTRY_AUTH_TOKEN`: Token de autenticação do Sentry
   - `SENTRY_ORG`: Nome da organização no Sentry
   - `SENTRY_PROJECT`: Nome do projeto no Sentry
   - `NEXT_PUBLIC_SITE_URL`: URL completa do site (ex: https://seu-site.com)

## Construção e Implantação

1. **Construa a aplicação**
   ```bash
   npm run build
   ```

2. **Execute as migrações do banco de dados**
   ```bash
   npx prisma migrate deploy
   ```

3. **Inicie o servidor**
   ```bash
   npm start
   ```

   Ou usando PM2 para gerenciar o processo:
   ```bash
   npm install -g pm2
   pm2 start npm --name "aprova-ja" -- start
   pm2 save
   pm2 startup
   ```

## Configuração do Nginx (Recomendado)

```nginx
server {
    listen 80;
    server_name seu-site.com www.seu-site.com;

    # Redirecionar HTTP para HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-site.com www.seu-site.com;

    # Configuração SSL
    ssl_certificate /caminho/para/seu/certificado.crt;
    ssl_certificate_key /caminho/para/sua/chave-privada.key;
    
    # Otimizações de desempenho
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Configuração de cache
    client_max_body_size 10m;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Configurações de segurança
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
    }

    # Otimização de cache para assets estáticos
    location /_next/static {
        alias /caminho/para/seu/projeto/.next/static;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

## Monitoramento

### Sentry
O Sentry já está configurado para monitorar erros em produção. Para acessar:

1. Acesse [Sentry](https://sentry.io)
2. Selecione seu projeto
3. Configure alertas e notificações conforme necessário

### Logs
Os logs da aplicação podem ser acessados via PM2:
```bash
# Ver logs em tempo real
pm2 logs

# Ver os últimos 1000 logs
pm2 logs --lines 1000
```

## Atualizações

Para atualizar a aplicação:

```bash
# Pare a aplicação
pm2 stop aprova-ja

# Atualize o código
git pull origin main

# Instale novas dependências
npm ci --production=false

# Execute migrações do banco de dados
npx prisma migrate deploy

# Reconstrua a aplicação
npm run build

# Inicie a aplicação novamente
pm2 start aprova-ja
```

## Backup

Configure backups regulares para:

1. **Banco de dados**: Use `pg_dump` para PostgreSQL
2. **Arquivos de mídia**: Faça backup do diretório `public/uploads`
3. **Variáveis de ambiente**: Mantenha uma cópia segura do arquivo `.env.production`

## Segurança

- Mantenha todas as dependências atualizadas
- Nunca exponha arquivos `.env`
- Use HTTPS em produção
- Configure um WAF (Web Application Firewall)
- Monitore logs de segurança regularmente

## Solução de Problemas

### Erros comuns

1. **Erro ao conectar ao banco de dados**
   - Verifique as credenciais no `.env.production`
   - Confirme se o servidor PostgreSQL está rodando
   - Verifique se o usuário tem permissões adequadas

2. **Erros de build**
   - Limpe o cache: `rm -rf .next`
   - Reinstale as dependências: `rm -rf node_modules && npm ci`

3. **Problemas de memória**
   - Aumente a memória do Node.js: `export NODE_OPTIONS=--max_old_space_size=4096`
   - Verifique vazamentos de memória

## Suporte

Para suporte, entre em contato com a equipe de desenvolvimento ou abra uma issue no repositório do projeto.
