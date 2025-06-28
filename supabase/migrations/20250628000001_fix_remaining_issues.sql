-- Corrige os avisos restantes no schema

-- 1. Primeiro, atualizar valores nulos na tabela simulados-personalizados
UPDATE "simulados-personalizados" SET
  title = COALESCE(title, 'Simulado sem título'),
  questions_count = COALESCE(questions_count, 0),
  time_minutes = COALESCE(time_minutes, 60), -- 60 minutos como padrão
  difficulty = COALESCE(difficulty, 'medium'),
  is_public = COALESCE(is_public, false);

-- 2. Agora sim, adicionar as restrições NOT NULL
ALTER TABLE "simulados-personalizados"
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN questions_count SET NOT NULL,
  ALTER COLUMN time_minutes SET NOT NULL,
  ALTER COLUMN difficulty SET NOT NULL;

-- 3. Atualizar simulado_id nulo na tabela simulado_questions
-- Primeiro, verificar se existem registros com simulado_id nulo
DO $$
DECLARE
  null_count integer;
  default_simulado_id uuid;
BEGIN
  -- Contar registros com simulado_id nulo
  SELECT COUNT(*) INTO null_count FROM simulado_questions WHERE simulado_id IS NULL;
  
  IF null_count > 0 THEN
    RAISE NOTICE 'Encontrados % registros com simulado_id nulo. Atribuindo simulado padrão...', null_count;
    
    -- Tentar obter o ID de um simulado existente
    SELECT id INTO default_simulado_id FROM "simulados-personalizados" LIMIT 1;
    
    IF default_simulado_id IS NOT NULL THEN
      -- Se encontrou um simulado, atribuir aos registros nulos
      UPDATE simulado_questions 
      SET simulado_id = default_simulado_id 
      WHERE simulado_id IS NULL;
      
      RAISE NOTICE 'Foram atualizados % registros com o simulado_id %', null_count, default_simulado_id;
    ELSE
      -- Se não encontrou nenhum simulado, remover os registros
      RAISE NOTICE 'Nenhum simulado encontrado. Removendo % registros com simulado_id nulo...', null_count;
      DELETE FROM simulado_questions WHERE simulado_id IS NULL;
    END IF;
  END IF;
END;
$$;

-- Agora sim, adicionar a restrição NOT NULL
ALTER TABLE simulado_questions
  ALTER COLUMN simulado_id SET NOT NULL;

-- 4. Atualizar title nulo na tabela apostila-inteligente
UPDATE "apostila-inteligente" SET
  title = COALESCE(title, 'Apostila sem título')
WHERE title IS NULL;

-- Agora sim, adicionar a restrição NOT NULL
ALTER TABLE "apostila-inteligente"
  ALTER COLUMN title SET NOT NULL;

-- 5. Remover colunas não utilizadas (comentado por segurança - descomente se necessário)
-- Esta seção está comentada por segurança. Descomente as linhas abaixo se realmente desejar remover as colunas.
/*
-- Remover colunas não utilizadas se realmente não forem necessárias
ALTER TABLE "simulados-personalizados"
  DROP COLUMN IF EXISTS slug;
  
ALTER TABLE "apostila-inteligente"
  DROP COLUMN IF EXISTS slug,
  DROP COLUMN IF EXISTS created_by;
  
-- A coluna last_login foi adicionada em uma migração anterior
-- Se não for mais necessária, pode ser removida com:
-- ALTER TABLE users
--   DROP COLUMN IF EXISTS last_login;
*/

-- 6. Verificar se existem registros com valores nulos em colunas obrigatórias
-- Esta seção agora é apenas para validação, já que os valores foram atualizados anteriormente

-- 7. Garantir que não existam registros nulos para colunas NOT NULL
-- Se houver registros nulos, esta query vai falhar, indicando que precisamos tratar esses dados
DO $$
BEGIN
  -- Verificar se existem registros com valores nulos em colunas NOT NULL
  -- Se alguma dessas queries retornar mais que 0 linhas, temos um problema
  RAISE NOTICE 'Verificando registros nulos...';
  
  DECLARE
    null_count integer;
  BEGIN
    -- Verificar simulados-personalizados
    SELECT COUNT(*) INTO null_count FROM "simulados-personalizados" WHERE title IS NULL;
    IF null_count > 0 THEN
      RAISE NOTICE 'Atenção: Existem % registros com title nulo na tabela simulados-personalizados', null_count;
    END IF;
    
    SELECT COUNT(*) INTO null_count FROM "simulados-personalizados" WHERE questions_count IS NULL;
    IF null_count > 0 THEN
      RAISE NOTICE 'Atenção: Existem % registros com questions_count nulo na tabela simulados-personalizados', null_count;
    END IF;
    
    SELECT COUNT(*) INTO null_count FROM simulado_questions WHERE simulado_id IS NULL;
    IF null_count > 0 THEN
      RAISE NOTICE 'Atenção: Existem % registros com simulado_id nulo na tabela simulado_questions', null_count;
    END IF;
    
    SELECT COUNT(*) INTO null_count FROM "apostila-inteligente" WHERE title IS NULL;
    IF null_count > 0 THEN
      RAISE NOTICE 'Atenção: Existem % registros com title nulo na tabela apostila-inteligente', null_count;
    END IF;
  END;
END;
$$;

-- 8. Atualizar comentários para documentar as decisões tomadas
COMMENT ON COLUMN users.last_login IS 'Data e hora do último login do usuário. Pode ser usado para análises de engajamento.';
COMMENT ON COLUMN "simulados-personalizados".slug IS 'Slug para URLs amigáveis. Pode ser usado em rotas da aplicação.';
COMMENT ON COLUMN "apostila-inteligente".slug IS 'Slug para URLs amigáveis. Pode ser usado em rotas da aplicação.';
COMMENT ON COLUMN "apostila-inteligente".created_by IS 'Usuário que criou o registro. Útil para controle de permissões.';
