-- Fase 2 (Guru da Aprovação): Qualidade – índices adicionais e RLS complementar
-- Esta migração é idempotente onde possível e não deve quebrar ambientes existentes.

-- =============================
-- Índices adicionais para consultas do módulo
-- =============================

-- preferencias_usuario_concurso
CREATE INDEX IF NOT EXISTS idx_puc_usuario_id ON public.preferencias_usuario_concurso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_puc_concurso_id ON public.preferencias_usuario_concurso(concurso_id);
CREATE INDEX IF NOT EXISTS idx_puc_ativo ON public.preferencias_usuario_concurso(ativo);
CREATE INDEX IF NOT EXISTS idx_puc_selecionado_em ON public.preferencias_usuario_concurso(selecionado_em);
CREATE INDEX IF NOT EXISTS idx_puc_criado_em ON public.preferencias_usuario_concurso(criado_em);

-- progresso_usuario_questoes_semanais
CREATE INDEX IF NOT EXISTS idx_puqs_usuario_id ON public.progresso_usuario_questoes_semanais(usuario_id);
CREATE INDEX IF NOT EXISTS idx_puqs_qs_id ON public.progresso_usuario_questoes_semanais(questoes_semanais_id);
CREATE INDEX IF NOT EXISTS idx_puqs_concluido_em ON public.progresso_usuario_questoes_semanais(concluido_em);

-- questoes_semanais (auxiliares para leitura)
CREATE INDEX IF NOT EXISTS idx_qs_concurso_id ON public.questoes_semanais(concurso_id);
CREATE INDEX IF NOT EXISTS idx_qs_data_publicacao ON public.questoes_semanais(data_publicacao);
CREATE INDEX IF NOT EXISTS idx_qs_ativo ON public.questoes_semanais(ativo);
CREATE INDEX IF NOT EXISTS idx_qs_criado_em ON public.questoes_semanais(criado_em);

-- =============================
-- RLS complementar
-- =============================
DO $$
DECLARE
  pol_exists BOOLEAN;
BEGIN
  -- preferencias_usuario_concurso (registros do próprio usuário)
  EXECUTE 'ALTER TABLE public.preferencias_usuario_concurso ENABLE ROW LEVEL SECURITY';

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'preferencias_usuario_concurso' AND policyname = 'p_puc_select_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_puc_select_own ON public.preferencias_usuario_concurso
      FOR SELECT TO authenticated
      USING (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'preferencias_usuario_concurso' AND policyname = 'p_puc_insert_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_puc_insert_own ON public.preferencias_usuario_concurso
      FOR INSERT TO authenticated
      WITH CHECK (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'preferencias_usuario_concurso' AND policyname = 'p_puc_update_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_puc_update_own ON public.preferencias_usuario_concurso
      FOR UPDATE TO authenticated
      USING (usuario_id = auth.uid()) WITH CHECK (usuario_id = auth.uid())';
  END IF;
END $$;