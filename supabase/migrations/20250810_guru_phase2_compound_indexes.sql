-- Fase 2 (Guru da Aprovação): Índices compostos alinhados às consultas
-- Objetivo: otimizar filtros/ordenações típicos usados nos endpoints do módulo guru

-- progresso_usuario_simulado: consultas por (usuario_id) ordenando por concluido_em
CREATE INDEX IF NOT EXISTS idx_pus_usuario_id_concluido_em
  ON public.progresso_usuario_simulado (usuario_id, concluido_em DESC);

-- respostas_questoes_semanais: consultas por (usuario_id) ordenando por criado_em
CREATE INDEX IF NOT EXISTS idx_rqs_usuario_id_criado_em
  ON public.respostas_questoes_semanais (usuario_id, criado_em DESC);

-- progresso_usuario_flashcard: consultas por (usuario_id, status) ordenando por atualizado_em
CREATE INDEX IF NOT EXISTS idx_puf_usuario_id_status_atualizado_em
  ON public.progresso_usuario_flashcard (usuario_id, status, atualizado_em DESC);

-- progresso_usuario_mapa_assuntos: consultas por (usuario_id, status) ordenando por atualizado_em
CREATE INDEX IF NOT EXISTS idx_puma_usuario_id_status_atualizado_em
  ON public.progresso_usuario_mapa_assuntos (usuario_id, status, atualizado_em DESC);

-- progresso_usuario_apostila: consultas por (usuario_id) ordenando por atualizado_em
CREATE INDEX IF NOT EXISTS idx_pua_usuario_id_atualizado_em
  ON public.progresso_usuario_apostila (usuario_id, atualizado_em DESC);

-- Views materializadas (se existirem) já possuem índices dedicados em 20250809_guru_phase2_z_materialized_views.sql


