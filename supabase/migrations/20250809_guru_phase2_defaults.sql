-- Fase 2 (Guru da Aprovação): Qualidade – Defaults e NOT NULL seguros
-- Observação: operações condicionais para evitar quebra em ambientes com dados existentes.

-- =============================
-- Defaults seguros (idempotentes via checagem de information_schema)
-- =============================
DO $$
DECLARE
  col_default TEXT;
  has_nulls BOOLEAN;
BEGIN
  -- progresso_usuario_simulado.pontuacao DEFAULT 0
  SELECT column_default INTO col_default
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'progresso_usuario_simulado' AND column_name = 'pontuacao';
  IF col_default IS NULL THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_simulado ALTER COLUMN pontuacao SET DEFAULT 0';
  END IF;

  -- progresso_usuario_simulado.tempo_gasto_minutos DEFAULT 0
  SELECT column_default INTO col_default
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'progresso_usuario_simulado' AND column_name = 'tempo_gasto_minutos';
  IF col_default IS NULL THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_simulado ALTER COLUMN tempo_gasto_minutos SET DEFAULT 0';
  END IF;

  -- progresso_usuario_simulado.respostas DEFAULT '{}'
  SELECT column_default INTO col_default
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'progresso_usuario_simulado' AND column_name = 'respostas';
  IF col_default IS NULL THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_simulado ALTER COLUMN respostas SET DEFAULT ''{}''::jsonb';
  END IF;

  -- progresso_usuario_questoes_semanais.pontuacao DEFAULT 0
  SELECT column_default INTO col_default
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'progresso_usuario_questoes_semanais' AND column_name = 'pontuacao';
  IF col_default IS NULL THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_questoes_semanais ALTER COLUMN pontuacao SET DEFAULT 0';
  END IF;

  -- progresso_usuario_questoes_semanais.respostas DEFAULT '{}'
  SELECT column_default INTO col_default
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'progresso_usuario_questoes_semanais' AND column_name = 'respostas';
  IF col_default IS NULL THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_questoes_semanais ALTER COLUMN respostas SET DEFAULT ''{}''::jsonb';
  END IF;
END $$;

-- =============================
-- NOT NULL seguros (aplicar somente se não houver valores nulos)
-- =============================
DO $$
DECLARE
  has_nulls BOOLEAN;
BEGIN
  -- progresso_usuario_simulado.pontuacao
  SELECT EXISTS (SELECT 1 FROM public.progresso_usuario_simulado WHERE pontuacao IS NULL) INTO has_nulls;
  IF has_nulls IS FALSE THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_simulado ALTER COLUMN pontuacao SET NOT NULL';
  END IF;

  -- progresso_usuario_simulado.tempo_gasto_minutos
  SELECT EXISTS (SELECT 1 FROM public.progresso_usuario_simulado WHERE tempo_gasto_minutos IS NULL) INTO has_nulls;
  IF has_nulls IS FALSE THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_simulado ALTER COLUMN tempo_gasto_minutos SET NOT NULL';
  END IF;

  -- progresso_usuario_simulado.respostas
  SELECT EXISTS (SELECT 1 FROM public.progresso_usuario_simulado WHERE respostas IS NULL) INTO has_nulls;
  IF has_nulls IS FALSE THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_simulado ALTER COLUMN respostas SET NOT NULL';
  END IF;

  -- progresso_usuario_questoes_semanais.pontuacao
  SELECT EXISTS (SELECT 1 FROM public.progresso_usuario_questoes_semanais WHERE pontuacao IS NULL) INTO has_nulls;
  IF has_nulls IS FALSE THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_questoes_semanais ALTER COLUMN pontuacao SET NOT NULL';
  END IF;

  -- progresso_usuario_questoes_semanais.respostas
  SELECT EXISTS (SELECT 1 FROM public.progresso_usuario_questoes_semanais WHERE respostas IS NULL) INTO has_nulls;
  IF has_nulls IS FALSE THEN
    EXECUTE 'ALTER TABLE public.progresso_usuario_questoes_semanais ALTER COLUMN respostas SET NOT NULL';
  END IF;
END $$;


