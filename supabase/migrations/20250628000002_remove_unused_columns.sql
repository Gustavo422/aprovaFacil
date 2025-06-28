-- Migração para remover colunas não utilizadas
-- Esta migração remove colunas que existem no banco de dados mas não são mais utilizadas pelo código

-- 1. Remover last_login da tabela users
-- Esta coluna foi adicionada para rastrear o último login, mas não está sendo utilizada no momento
-- Podemos readicioná-la no futuro se necessário
ALTER TABLE users 
  DROP COLUMN IF EXISTS last_login;

-- 2. Remover slug da tabela simulados-personalizados
-- Esta coluna foi planejada para URLs amigáveis, mas não está sendo utilizada atualmente
ALTER TABLE "simulados-personalizados"
  DROP COLUMN IF EXISTS slug;

-- 3. Remover slug e created_by da tabela apostila-inteligente
-- Essas colunas foram planejadas para controle de permissões e URLs amigáveis, mas não estão sendo utilizadas
ALTER TABLE "apostila-inteligente"
  DROP COLUMN IF EXISTS slug,
  DROP COLUMN IF EXISTS created_by;

-- 4. Documentar as alterações
COMMENT ON TABLE users IS 'Tabela de usuários do sistema. Armazena informações básicas e estatísticas de uso.';
COMMENT ON TABLE "simulados-personalizados" IS 'Armazena simulados personalizados criados pelos usuários ou administradores.';
COMMENT ON TABLE "apostila-inteligente" IS 'Armazena apostilas inteligentes geradas pelo sistema.';
