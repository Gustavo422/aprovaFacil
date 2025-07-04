# Scripts de Migração do Banco de Dados - Aprova Fácil

Este diretório contém os scripts SQL necessários para configurar o banco de dados do Aprova Fácil. Os scripts foram divididos em duas partes para facilitar a execução e evitar problemas com tamanho de arquivo.

## Arquivos de Migração

1. `migration_completa_part1.sql` - Contém a criação de todas as tabelas do sistema.
2. `migration_completa_part2.sql` - Contém índices, funções, triggers e dados iniciais.

## Como Executar

### No Supabase Studio

1. Acesse o [Supabase Dashboard](https://app.supabase.com/)
2. Selecione seu projeto
3. No menu lateral esquerdo, vá em "SQL Editor"
4. Clique em "New Query"
5. Copie e cole o conteúdo de `migration_completa_part1.sql` e execute
6. Repita o processo para `migration_completa_part2.sql`

### Usando a CLI do Supabase

```bash
# Execute o primeiro script
psql -h db.[project-ref].supabase.co -p 5432 -U postgres -d postgres -f migration_completa_part1.sql

# Execute o segundo script
psql -h db.[project-ref].supabase.co -p 5432 -U postgres -d postgres -f migration_completa_part2.sql
```

Substitua `[project-ref]` pela referência do seu projeto no Supabase.

## Estrutura do Banco de Dados

### Tabelas Principais

- `concurso_categorias` - Categorias de concursos (ex: Bancos, Fiscal, Polícia)
- `concursos` - Detalhes dos concursos
- `users` - Usuários da plataforma
- `user_concurso_preferences` - Preferências de concursos dos usuários
- `categoria_disciplinas` - Disciplinas por categoria de concurso
- `apostilas` e `apostila_content` - Conteúdo de estudo
- `flashcards` e `user_flashcard_progress` - Cartões de estudo e progresso
- `mapa_assuntos` e `user_mapa_assuntos_status` - Mapeamento de assuntos e progresso
- `planos_estudo` e `plano_estudo_itens` - Planos de estudo personalizados
- `questoes_semanais` e `user_questoes_semanais_progress` - Questões semanais e progresso
- `simulados`, `simulado_questoes` e `user_simulado_progress` - Simulados e resultados
- `user_discipline_stats` - Estatísticas de desempenho por disciplina
- `audit_logs` - Logs de auditoria
- `cache_config` e `user_performance_cache` - Configuração de cache

## Dados Iniciais

O script `migration_completa_part2.sql` inclui alguns dados iniciais para teste:

- 3 categorias de concurso (Bancos, Fiscal, Polícia)
- 3 concursos de exemplo (Banco do Brasil, Receita Federal, PC-DF)
- Disciplinas padrão para cada categoria

## Próximos Passos

1. Execute os scripts de migração em ordem
2. Configure as permissões RLS (Row Level Security) conforme necessário
3. Importe os dados iniciais necessários
4. Teste as funcionalidades principais

## Solução de Problemas

- **Erro de permissão**: Verifique se o usuário do banco de dados tem permissões adequadas
- **Erro de chave estrangeira**: Certifique-se de executar os scripts na ordem correta
- **Erro de sintaxe**: Verifique se está usando uma versão compatível do PostgreSQL (12+)

Para mais informações, consulte a documentação do Supabase ou entre em contato com a equipe de desenvolvimento.
