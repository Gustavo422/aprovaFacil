-- Fase 2 (Guru da Aprovação): Ajustes de RLS e índices duplicados
-- Objetivo: atender às recomendações do linter do Supabase (initplan e índices duplicados)

-- =============================
-- RLS: usar (select auth.uid()) para evitar reavaliação por linha (initplan)
-- =============================
DO $$
DECLARE
  pol_exists BOOLEAN;
BEGIN
  -- SELECT
  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'preferencias_usuario_concurso' AND policyname = 'p_puc_select_own'
  ) INTO pol_exists;
  IF pol_exists THEN
    EXECUTE 'ALTER POLICY p_puc_select_own ON public.preferencias_usuario_concurso USING (usuario_id = (select auth.uid()))';
  ELSE
    EXECUTE 'CREATE POLICY p_puc_select_own ON public.preferencias_usuario_concurso FOR SELECT TO authenticated USING (usuario_id = (select auth.uid()))';
  END IF;

  -- INSERT
  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'preferencias_usuario_concurso' AND policyname = 'p_puc_insert_own'
  ) INTO pol_exists;
  IF pol_exists THEN
    EXECUTE 'ALTER POLICY p_puc_insert_own ON public.preferencias_usuario_concurso WITH CHECK (usuario_id = (select auth.uid()))';
  ELSE
    EXECUTE 'CREATE POLICY p_puc_insert_own ON public.preferencias_usuario_concurso FOR INSERT TO authenticated WITH CHECK (usuario_id = (select auth.uid()))';
  END IF;

  -- UPDATE
  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'preferencias_usuario_concurso' AND policyname = 'p_puc_update_own'
  ) INTO pol_exists;
  IF pol_exists THEN
    EXECUTE 'ALTER POLICY p_puc_update_own ON public.preferencias_usuario_concurso USING (usuario_id = (select auth.uid())) WITH CHECK (usuario_id = (select auth.uid()))';
  ELSE
    EXECUTE 'CREATE POLICY p_puc_update_own ON public.preferencias_usuario_concurso FOR UPDATE TO authenticated USING (usuario_id = (select auth.uid())) WITH CHECK (usuario_id = (select auth.uid()))';
  END IF;

  -- Remover política permissiva duplicada se existir (evitar múltiplas policies por ação)
  EXECUTE 'DROP POLICY IF EXISTS p_puc_all_own ON public.preferencias_usuario_concurso';
END $$;

-- =============================
-- Índices: remover duplicados apenas quando coexistirem
-- =============================
DO $$
DECLARE
  has_old boolean;
  has_new boolean;
BEGIN
  -- preferencias_usuario_concurso (concurso_id)
  SELECT to_regclass('public.idx_preferencias_usuario_concurso_concurso_id') IS NOT NULL INTO has_old;
  SELECT to_regclass('public.idx_puc_concurso_id') IS NOT NULL INTO has_new;
  IF has_old AND has_new THEN
    EXECUTE 'DROP INDEX IF EXISTS public.idx_puc_concurso_id';
  END IF;

  -- preferencias_usuario_concurso (usuario_id)
  SELECT to_regclass('public.idx_preferencias_usuario_concurso_usuario_id') IS NOT NULL INTO has_old;
  SELECT to_regclass('public.idx_puc_usuario_id') IS NOT NULL INTO has_new;
  IF has_old AND has_new THEN
    EXECUTE 'DROP INDEX IF EXISTS public.idx_puc_usuario_id';
  END IF;

  -- progresso_usuario_questoes_semanais (questoes_semanais_id)
  SELECT to_regclass('public.idx_puqs_questoes_semanais_id') IS NOT NULL INTO has_old;
  SELECT to_regclass('public.idx_puqs_qs_id') IS NOT NULL INTO has_new;
  IF has_old AND has_new THEN
    EXECUTE 'DROP INDEX IF EXISTS public.idx_puqs_qs_id';
  END IF;

  -- questoes_semanais (concurso_id)
  SELECT to_regclass('public.idx_questoes_semanais_concurso_id') IS NOT NULL INTO has_old;
  SELECT to_regclass('public.idx_qs_concurso_id') IS NOT NULL INTO has_new;
  IF has_old AND has_new THEN
    EXECUTE 'DROP INDEX IF EXISTS public.idx_qs_concurso_id';
  END IF;
END $$;


