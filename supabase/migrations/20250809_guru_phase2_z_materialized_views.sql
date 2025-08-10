-- Fase 2 (Guru da Aprovação): Materialized Views, políticas de refresh e troca atômica
-- Objetivo: disponibilizar MVs para leituras estáveis e rápidas, com opção de refresh CONCURRENTLY
-- Estratégia: as views públicas (v_guru_*) passam a ler das MVs (mv_guru_*),
--             com filtro por auth.uid() aplicado nas views.

-- =====================================
-- Materialized View: mv_guru_simulado_activities
-- =====================================
DROP MATERIALIZED VIEW IF EXISTS public.mv_guru_simulado_activities CASCADE;
CREATE MATERIALIZED VIEW public.mv_guru_simulado_activities AS
SELECT 
  pus.id,
  pus.usuario_id,
  pus.concluido_em,
  pus.tempo_gasto_minutos,
  pus.pontuacao,
  s.titulo,
  s.dificuldade
FROM public.progresso_usuario_simulado pus
LEFT JOIN public.simulados s ON s.id = pus.simulado_id
WITH DATA;

-- Índices para refresh CONCURRENTLY e filtros comuns
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_guru_sim_activities_id ON public.mv_guru_simulado_activities(id);
CREATE INDEX IF NOT EXISTS idx_mv_guru_sim_activities_usuario_id ON public.mv_guru_simulado_activities(usuario_id);
CREATE INDEX IF NOT EXISTS idx_mv_guru_sim_activities_concluido_em ON public.mv_guru_simulado_activities(concluido_em);

-- =====================================
-- Materialized View: mv_guru_flashcard_activities
-- =====================================
DROP MATERIALIZED VIEW IF EXISTS public.mv_guru_flashcard_activities CASCADE;
CREATE MATERIALIZED VIEW public.mv_guru_flashcard_activities AS
SELECT 
  puf.id,
  puf.usuario_id,
  puf.atualizado_em AS criado_em,
  puf.status,
  puf.atualizado_em,
  cm.frente,
  cm.disciplina
FROM public.progresso_usuario_flashcard puf
LEFT JOIN public.cartoes_memorizacao cm ON cm.id = puf.flashcard_id
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_guru_flash_activities_id ON public.mv_guru_flashcard_activities(id);
CREATE INDEX IF NOT EXISTS idx_mv_guru_flash_activities_usuario_id ON public.mv_guru_flashcard_activities(usuario_id);
CREATE INDEX IF NOT EXISTS idx_mv_guru_flash_activities_atualizado_em ON public.mv_guru_flashcard_activities(atualizado_em);

-- =====================================
-- Materialized View: mv_guru_apostila_activities
-- =====================================
DROP MATERIALIZED VIEW IF EXISTS public.mv_guru_apostila_activities CASCADE;
CREATE MATERIALIZED VIEW public.mv_guru_apostila_activities AS
SELECT 
  pua.id,
  pua.usuario_id,
  pua.atualizado_em AS criado_em,
  pua.atualizado_em,
  pua.percentual_progresso,
  ca.titulo
FROM public.progresso_usuario_apostila pua
LEFT JOIN public.conteudo_apostila ca ON ca.id = pua.conteudo_apostila_id
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_guru_apostila_activities_id ON public.mv_guru_apostila_activities(id);
CREATE INDEX IF NOT EXISTS idx_mv_guru_apostila_activities_usuario_id ON public.mv_guru_apostila_activities(usuario_id);
CREATE INDEX IF NOT EXISTS idx_mv_guru_apostila_activities_atualizado_em ON public.mv_guru_apostila_activities(atualizado_em);

-- =====================================
-- Atualizar views públicas para lerem das MVs (com filtro por auth.uid())
-- =====================================
CREATE OR REPLACE VIEW public.v_guru_simulado_activities AS
SELECT 
  id,
  usuario_id,
  concluido_em,
  tempo_gasto_minutos,
  pontuacao,
  titulo,
  dificuldade
FROM public.mv_guru_simulado_activities
WHERE usuario_id = (select auth.uid());

COMMENT ON VIEW public.v_guru_simulado_activities IS 'Atividades de simulados por usuário (via MV).';

CREATE OR REPLACE VIEW public.v_guru_flashcard_activities AS
SELECT 
  id,
  usuario_id,
  criado_em,
  status,
  atualizado_em,
  frente,
  disciplina
FROM public.mv_guru_flashcard_activities
WHERE usuario_id = (select auth.uid());

COMMENT ON VIEW public.v_guru_flashcard_activities IS 'Atividades de flashcards por usuário (via MV).';

CREATE OR REPLACE VIEW public.v_guru_apostila_activities AS
SELECT 
  id,
  usuario_id,
  criado_em,
  atualizado_em,
  percentual_progresso,
  titulo
FROM public.mv_guru_apostila_activities
WHERE usuario_id = (select auth.uid());

COMMENT ON VIEW public.v_guru_apostila_activities IS 'Atividades de apostilas por usuário (via MV).';

-- =====================================
-- Função de refresh (on-demand), preferindo CONCURRENTLY quando possível
-- =====================================
CREATE OR REPLACE FUNCTION public.refresh_guru_materialized_views(p_concurrently boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_concurrently THEN
    BEGIN
      REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_guru_simulado_activities;
    EXCEPTION WHEN OTHERS THEN
      -- Fallback sem concurrently se índice único não estiver disponível por algum motivo
      REFRESH MATERIALIZED VIEW public.mv_guru_simulado_activities;
    END;

    BEGIN
      REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_guru_flashcard_activities;
    EXCEPTION WHEN OTHERS THEN
      REFRESH MATERIALIZED VIEW public.mv_guru_flashcard_activities;
    END;

    BEGIN
      REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_guru_apostila_activities;
    EXCEPTION WHEN OTHERS THEN
      REFRESH MATERIALIZED VIEW public.mv_guru_apostila_activities;
    END;
  ELSE
    REFRESH MATERIALIZED VIEW public.mv_guru_simulado_activities;
    REFRESH MATERIALIZED VIEW public.mv_guru_flashcard_activities;
    REFRESH MATERIALIZED VIEW public.mv_guru_apostila_activities;
  END IF;
END;
$$;

-- Permissões: recomendado expor via Edge Function com service_role; não conceder diretamente a usuários autenticados.
-- Para agendamento, usar Supabase Scheduled Functions ou pg_cron:
-- SELECT cron.schedule('guru_mviews_refresh', '*/10 * * * *', $$SELECT public.refresh_guru_materialized_views(true);$$);
