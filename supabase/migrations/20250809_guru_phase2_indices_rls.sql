-- Fase 2 (Guru da Aprovação): Índices, RLS e Triggers de atualizado_em
-- Esta migração é idempotente onde possível e não deve quebrar ambientes existentes.

-- =============================
-- Índices para consultas do módulo
-- =============================
-- progresso_usuario_simulado
CREATE INDEX IF NOT EXISTS idx_pus_usuario_id ON public.progresso_usuario_simulado(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pus_concluido_em ON public.progresso_usuario_simulado(concluido_em);
CREATE INDEX IF NOT EXISTS idx_pus_simulado_id ON public.progresso_usuario_simulado(simulado_id);

-- respostas_questoes_semanais
CREATE INDEX IF NOT EXISTS idx_rqs_usuario_id ON public.respostas_questoes_semanais(usuario_id);
CREATE INDEX IF NOT EXISTS idx_rqs_criado_em ON public.respostas_questoes_semanais(criado_em);
CREATE INDEX IF NOT EXISTS idx_rqs_questao_semanal_id ON public.respostas_questoes_semanais(questao_semanal_id);

-- progresso_usuario_flashcard
CREATE INDEX IF NOT EXISTS idx_puf_usuario_id ON public.progresso_usuario_flashcard(usuario_id);
CREATE INDEX IF NOT EXISTS idx_puf_status ON public.progresso_usuario_flashcard(status);
CREATE INDEX IF NOT EXISTS idx_puf_atualizado_em ON public.progresso_usuario_flashcard(atualizado_em);
CREATE INDEX IF NOT EXISTS idx_puf_flashcard_id ON public.progresso_usuario_flashcard(flashcard_id);

-- progresso_usuario_mapa_assuntos
CREATE INDEX IF NOT EXISTS idx_puma_usuario_id ON public.progresso_usuario_mapa_assuntos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_puma_status ON public.progresso_usuario_mapa_assuntos(status);
CREATE INDEX IF NOT EXISTS idx_puma_atualizado_em ON public.progresso_usuario_mapa_assuntos(atualizado_em);
CREATE INDEX IF NOT EXISTS idx_puma_mapa_assunto_id ON public.progresso_usuario_mapa_assuntos(mapa_assunto_id);

-- progresso_usuario_apostila
CREATE INDEX IF NOT EXISTS idx_pua_usuario_id ON public.progresso_usuario_apostila(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pua_atualizado_em ON public.progresso_usuario_apostila(atualizado_em);
CREATE INDEX IF NOT EXISTS idx_pua_conteudo_apostila_id ON public.progresso_usuario_apostila(conteudo_apostila_id);

-- Conteúdo relacionado (leitura)
CREATE INDEX IF NOT EXISTS idx_simulados_concurso_id ON public.simulados(concurso_id);
CREATE INDEX IF NOT EXISTS idx_conteudo_apostila_apostila_id ON public.conteudo_apostila(apostila_id);
CREATE INDEX IF NOT EXISTS idx_cartoes_memorizacao_concurso_id ON public.cartoes_memorizacao(concurso_id);

-- =============================
-- RLS: habilitar e criar policies mínimas
-- =============================
-- Função utilitária para criar policies somente se não existirem
DO $$
DECLARE
  pol_exists BOOLEAN;
BEGIN
  -- progresso_usuario_simulado
  EXECUTE 'ALTER TABLE public.progresso_usuario_simulado ENABLE ROW LEVEL SECURITY';

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_simulado' AND policyname = 'p_pus_select_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_pus_select_own ON public.progresso_usuario_simulado
      FOR SELECT TO authenticated
      USING (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_simulado' AND policyname = 'p_pus_insert_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_pus_insert_own ON public.progresso_usuario_simulado
      FOR INSERT TO authenticated
      WITH CHECK (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_simulado' AND policyname = 'p_pus_update_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_pus_update_own ON public.progresso_usuario_simulado
      FOR UPDATE TO authenticated
      USING (usuario_id = auth.uid()) WITH CHECK (usuario_id = auth.uid())';
  END IF;

  -- respostas_questoes_semanais (somente leitura para dashboard)
  EXECUTE 'ALTER TABLE public.respostas_questoes_semanais ENABLE ROW LEVEL SECURITY';

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'respostas_questoes_semanais' AND policyname = 'p_rqs_select_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_rqs_select_own ON public.respostas_questoes_semanais
      FOR SELECT TO authenticated
      USING (usuario_id = auth.uid())';
  END IF;

  -- progresso_usuario_flashcard
  EXECUTE 'ALTER TABLE public.progresso_usuario_flashcard ENABLE ROW LEVEL SECURITY';

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_flashcard' AND policyname = 'p_puf_select_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_puf_select_own ON public.progresso_usuario_flashcard
      FOR SELECT TO authenticated
      USING (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_flashcard' AND policyname = 'p_puf_insert_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_puf_insert_own ON public.progresso_usuario_flashcard
      FOR INSERT TO authenticated
      WITH CHECK (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_flashcard' AND policyname = 'p_puf_update_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_puf_update_own ON public.progresso_usuario_flashcard
      FOR UPDATE TO authenticated
      USING (usuario_id = auth.uid()) WITH CHECK (usuario_id = auth.uid())';
  END IF;

  -- progresso_usuario_mapa_assuntos
  EXECUTE 'ALTER TABLE public.progresso_usuario_mapa_assuntos ENABLE ROW LEVEL SECURITY';

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_mapa_assuntos' AND policyname = 'p_puma_select_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_puma_select_own ON public.progresso_usuario_mapa_assuntos
      FOR SELECT TO authenticated
      USING (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_mapa_assuntos' AND policyname = 'p_puma_insert_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_puma_insert_own ON public.progresso_usuario_mapa_assuntos
      FOR INSERT TO authenticated
      WITH CHECK (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_mapa_assuntos' AND policyname = 'p_puma_update_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_puma_update_own ON public.progresso_usuario_mapa_assuntos
      FOR UPDATE TO authenticated
      USING (usuario_id = auth.uid()) WITH CHECK (usuario_id = auth.uid())';
  END IF;

  -- progresso_usuario_apostila
  EXECUTE 'ALTER TABLE public.progresso_usuario_apostila ENABLE ROW LEVEL SECURITY';

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_apostila' AND policyname = 'p_pua_select_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_pua_select_own ON public.progresso_usuario_apostila
      FOR SELECT TO authenticated
      USING (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_apostila' AND policyname = 'p_pua_insert_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_pua_insert_own ON public.progresso_usuario_apostila
      FOR INSERT TO authenticated
      WITH CHECK (usuario_id = auth.uid())';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progresso_usuario_apostila' AND policyname = 'p_pua_update_own'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_pua_update_own ON public.progresso_usuario_apostila
      FOR UPDATE TO authenticated
      USING (usuario_id = auth.uid()) WITH CHECK (usuario_id = auth.uid())';
  END IF;

  -- Tabelas de somente leitura usadas por relacionamentos
  -- simulados
  EXECUTE 'ALTER TABLE public.simulados ENABLE ROW LEVEL SECURITY';
  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'simulados' AND policyname = 'p_simulados_select_auth'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_simulados_select_auth ON public.simulados
      FOR SELECT TO authenticated USING (true)';
  END IF;

  -- cartoes_memorizacao
  EXECUTE 'ALTER TABLE public.cartoes_memorizacao ENABLE ROW LEVEL SECURITY';
  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'cartoes_memorizacao' AND policyname = 'p_cartoes_select_auth'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_cartoes_select_auth ON public.cartoes_memorizacao
      FOR SELECT TO authenticated USING (true)';
  END IF;

  -- conteudo_apostila
  EXECUTE 'ALTER TABLE public.conteudo_apostila ENABLE ROW LEVEL SECURITY';
  SELECT EXISTS(
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'conteudo_apostila' AND policyname = 'p_conteudo_apostila_select_auth'
  ) INTO pol_exists;
  IF NOT pol_exists THEN
    EXECUTE 'CREATE POLICY p_conteudo_apostila_select_auth ON public.conteudo_apostila
      FOR SELECT TO authenticated USING (true)';
  END IF;
END $$;

-- =============================
-- Trigger: atualizar automaticamente coluna atualizado_em
-- =============================
CREATE OR REPLACE FUNCTION public.set_atualizado_em()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$;

-- Criar triggers somente quando a coluna existir
DO $$
BEGIN
  -- progresso_usuario_flashcard
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'progresso_usuario_flashcard' 
      AND column_name = 'atualizado_em'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'trg_puf_set_atualizado_em'
    ) THEN
      EXECUTE 'CREATE TRIGGER trg_puf_set_atualizado_em
        BEFORE UPDATE ON public.progresso_usuario_flashcard
        FOR EACH ROW
        EXECUTE FUNCTION public.set_atualizado_em()';
    END IF;
  END IF;

  -- progresso_usuario_apostila
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'progresso_usuario_apostila' 
      AND column_name = 'atualizado_em'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'trg_pua_set_atualizado_em'
    ) THEN
      EXECUTE 'CREATE TRIGGER trg_pua_set_atualizado_em
        BEFORE UPDATE ON public.progresso_usuario_apostila
        FOR EACH ROW
        EXECUTE FUNCTION public.set_atualizado_em()';
    END IF;
  END IF;

  -- progresso_usuario_mapa_assuntos
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'progresso_usuario_mapa_assuntos' 
      AND column_name = 'atualizado_em'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'trg_puma_set_atualizado_em'
    ) THEN
      EXECUTE 'CREATE TRIGGER trg_puma_set_atualizado_em
        BEFORE UPDATE ON public.progresso_usuario_mapa_assuntos
        FOR EACH ROW
        EXECUTE FUNCTION public.set_atualizado_em()';
    END IF;
  END IF;
END $$;


