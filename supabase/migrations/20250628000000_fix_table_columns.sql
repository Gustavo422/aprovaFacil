-- Corrige as colunas das tabelas para corresponder ao esperado pelo código

-- 1. Corrigir tabela simulados-personalizados
-- Primeiro, renomear colunas existentes para nomes temporários
DO $$
BEGIN
  -- Verificar e renomear colunas existentes para backup
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'simulados-personalizados' AND column_name = 'titulo') THEN
    ALTER TABLE "simulados-personalizados" RENAME COLUMN titulo TO old_titulo;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'simulados-personalizados' AND column_name = 'descricao') THEN
    ALTER TABLE "simulados-personalizados" RENAME COLUMN descricao TO old_descricao;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'simulados-personalizados' AND column_name = 'configuracoes') THEN
    ALTER TABLE "simulados-personalizados" RENAME COLUMN configuracoes TO old_configuracoes;
  END IF;
END;
$$;

-- Adicionar novas colunas
ALTER TABLE "simulados-personalizados"
  ADD COLUMN IF NOT EXISTS title character varying,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS questions_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS time_minutes integer,
  ADD COLUMN IF NOT EXISTS difficulty character varying,
  ADD COLUMN IF NOT EXISTS concurso_id uuid,
  ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS created_by uuid,
  ADD COLUMN IF NOT EXISTS categoria_id uuid,
  ADD COLUMN IF NOT EXISTS disciplinas jsonb,
  ADD COLUMN IF NOT EXISTS slug character varying UNIQUE;

-- Copiar dados das colunas antigas para as novas
DO $$
BEGIN
  -- Copiar dados das colunas renomeadas para as novas colunas
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'simulados-personalizados' AND column_name = 'old_titulo') THEN
    UPDATE "simulados-personalizados" SET
      title = old_titulo,
      slug = lower(regexp_replace(old_titulo, '[^\w\s-]', '', 'g'))
    WHERE title IS NULL;
    
    ALTER TABLE "simulados-personalizados" DROP COLUMN old_titulo;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'simulados-personalizados' AND column_name = 'old_descricao') THEN
    UPDATE "simulados-personalizados" SET description = old_descricao WHERE description IS NULL;
    ALTER TABLE "simulados-personalizados" DROP COLUMN old_descricao;
  END IF;
  
  -- Remover coluna user_id se existir (não é mais necessária)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'simulados-personalizados' AND column_name = 'user_id') THEN
    ALTER TABLE "simulados-personalizados" DROP COLUMN user_id;
  END IF;
  
  -- Remover configuracoes se existir (não é mais necessária)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'simulados-personalizados' AND column_name = 'old_configuracoes') THEN
    ALTER TABLE "simulados-personalizados" DROP COLUMN old_configuracoes;
  END IF;
END;
$$;

-- 2. Corrigir tabela simulado_questions
ALTER TABLE public.simulado_questions
  ADD COLUMN IF NOT EXISTS simulado_id uuid,
  ADD CONSTRAINT fk_simulado_questions_simulado 
    FOREIGN KEY (simulado_id) 
    REFERENCES public."simulados-personalizados"(id)
    ON DELETE CASCADE;

-- 3. Corrigir tabela apostila-inteligente
-- Primeiro, renomear colunas existentes para nomes temporários
DO $$
BEGIN
  -- Verificar e renomear colunas existentes para backup
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'apostila-inteligente' AND column_name = 'titulo') THEN
    ALTER TABLE "apostila-inteligente" RENAME COLUMN titulo TO old_titulo;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'apostila-inteligente' AND column_name = 'conteudo') THEN
    ALTER TABLE "apostila-inteligente" RENAME COLUMN conteudo TO old_conteudo;
  END IF;
END;
$$;

-- Adicionar novas colunas
ALTER TABLE "apostila-inteligente"
  ADD COLUMN IF NOT EXISTS title character varying,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS concurso_id uuid,
  ADD COLUMN IF NOT EXISTS categoria_id uuid,
  ADD COLUMN IF NOT EXISTS disciplinas jsonb,
  ADD COLUMN IF NOT EXISTS slug character varying UNIQUE,
  ADD COLUMN IF NOT EXISTS created_by uuid;

-- Copiar dados das colunas antigas para as novas
DO $$
BEGIN
  -- Copiar título
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'apostila-inteligente' AND column_name = 'old_titulo') THEN
    UPDATE "apostila-inteligente" SET
      title = old_titulo,
      slug = lower(regexp_replace(old_titulo, '[^\w\s-]', '', 'g'))
    WHERE title IS NULL;
    
    ALTER TABLE "apostila-inteligente" DROP COLUMN old_titulo;
  END IF;
  
  -- Copiar conteúdo para description
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'apostila-inteligente' AND column_name = 'old_conteudo') THEN
    UPDATE "apostila-inteligente" SET 
      description = jsonb_pretty(old_conteudo::jsonb) 
    WHERE description IS NULL;
    
    ALTER TABLE "apostila-inteligente" DROP COLUMN old_conteudo;
  END IF;
  
  -- Remover user_id se existir (substituído por created_by)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'apostila-inteligente' AND column_name = 'user_id') THEN
    UPDATE "apostila-inteligente" SET created_by = user_id WHERE created_by IS NULL;
    ALTER TABLE "apostila-inteligente" DROP COLUMN user_id;
  END IF;
  
  -- Remover updated_at se existir (não é mais necessário)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'apostila-inteligente' AND column_name = 'updated_at') THEN
    ALTER TABLE "apostila-inteligente" DROP COLUMN updated_at;
  END IF;
END;
$$;

-- 4. Adicionar restrições de chave estrangeira
DO $$
BEGIN
  -- Para simulados-personalizados
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_simulados_concurso'
  ) THEN
    ALTER TABLE "simulados-personalizados"
      ADD CONSTRAINT fk_simulados_concurso
      FOREIGN KEY (concurso_id) 
      REFERENCES public.concursos(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_simulados_categoria'
  ) THEN
    ALTER TABLE "simulados-personalizados"
      ADD CONSTRAINT fk_simulados_categoria
      FOREIGN KEY (categoria_id) 
      REFERENCES public.concurso_categorias(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_simulados_created_by'
  ) THEN
    ALTER TABLE "simulados-personalizados"
      ADD CONSTRAINT fk_simulados_created_by
      FOREIGN KEY (created_by) 
      REFERENCES public.users(id);
  END IF;
  
  -- Para apostila-inteligente
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_apostila_concurso'
  ) THEN
    ALTER TABLE "apostila-inteligente"
      ADD CONSTRAINT fk_apostila_concurso
      FOREIGN KEY (concurso_id) 
      REFERENCES public.concursos(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_apostila_categoria'
  ) THEN
    ALTER TABLE "apostila-inteligente"
      ADD CONSTRAINT fk_apostila_categoria
      FOREIGN KEY (categoria_id) 
      REFERENCES public.concurso_categorias(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_apostila_created_by'
  ) THEN
    ALTER TABLE "apostila-inteligente"
      ADD CONSTRAINT fk_apostila_created_by
      FOREIGN KEY (created_by) 
      REFERENCES public.users(id);
  END IF;
END;
$$;

-- 5. Criar índices para melhorar desempenho
CREATE INDEX IF NOT EXISTS idx_simulados_slug ON "simulados-personalizados"(slug);
CREATE INDEX IF NOT EXISTS idx_apostila_slug ON "apostila-inteligente"(slug);
CREATE INDEX IF NOT EXISTS idx_simulado_questions_simulado_id ON simulado_questions(simulado_id);

-- 6. Atualizar a função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar triggers para atualizar updated_at
DO $$
BEGIN
  -- Para simulados-personalizados
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'update_simulados_updated_at'
  ) THEN
    CREATE TRIGGER update_simulados_updated_at
    BEFORE UPDATE ON "simulados-personalizados"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Para apostila-inteligente (se for necessário)
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'update_apostila_updated_at'
  ) THEN
    CREATE TRIGGER update_apostila_updated_at
    BEFORE UPDATE ON "apostila-inteligente"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;
