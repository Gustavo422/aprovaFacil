-- Guru da Aprovação – Retenção de dados para tabelas volumosas de atividade
-- Estratégia: manter somente os últimos N dias (padrão: 365) e limpar dados antigos periodicamente
-- Observação: agendamento deve ser feito via Supabase Scheduled Functions ou pg_cron (ver comentários ao final)

CREATE OR REPLACE FUNCTION public.purge_old_guru_activity(p_retain_days integer DEFAULT 365)
RETURNS TABLE(
  tabela text,
  removidos bigint
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_cutoff timestamptz := now() - (p_retain_days || ' days')::interval;
  v_count bigint;
BEGIN
  -- progresso_usuario_simulado (usa concluido_em)
  DELETE FROM public.progresso_usuario_simulado
  WHERE concluido_em IS NOT NULL AND concluido_em < v_cutoff;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  tabela := 'progresso_usuario_simulado';
  removidos := v_count;
  RETURN NEXT;

  -- respostas_questoes_semanais (usa criado_em)
  DELETE FROM public.respostas_questoes_semanais
  WHERE criado_em < v_cutoff;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  tabela := 'respostas_questoes_semanais';
  removidos := v_count;
  RETURN NEXT;

  -- progresso_usuario_flashcard (usa atualizado_em)
  DELETE FROM public.progresso_usuario_flashcard
  WHERE atualizado_em < v_cutoff;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  tabela := 'progresso_usuario_flashcard';
  removidos := v_count;
  RETURN NEXT;

  -- progresso_usuario_mapa_assuntos (usa atualizado_em)
  DELETE FROM public.progresso_usuario_mapa_assuntos
  WHERE atualizado_em < v_cutoff;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  tabela := 'progresso_usuario_mapa_assuntos';
  removidos := v_count;
  RETURN NEXT;

  -- progresso_usuario_apostila (usa atualizado_em)
  DELETE FROM public.progresso_usuario_apostila
  WHERE atualizado_em < v_cutoff;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  tabela := 'progresso_usuario_apostila';
  removidos := v_count;
  RETURN NEXT;

  RETURN;
END;
$$;

COMMENT ON FUNCTION public.purge_old_guru_activity(integer) IS
'Remove registros antigos das tabelas de atividade do módulo Guru, mantendo apenas os últimos N dias (padrão 365).';

-- Dica de agendamento (NÃO executa automaticamente nesta migration):
-- 1) Com pg_cron (se habilitado no projeto Supabase):
--    SELECT cron.schedule('guru_activity_retention_daily', '30 3 * * *', $$SELECT * FROM public.purge_old_guru_activity(365);$$);
-- 2) Com Supabase Scheduled Functions: criar uma Edge Function que chame esta função SQL (via service_role)
--    e programar sua execução diária pelo painel de Scheduled Functions.


