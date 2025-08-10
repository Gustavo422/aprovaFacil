-- Fase 2 (Guru da Aprovação): Views de leitura para desacoplar joins e estabilizar contratos
-- Observações:
--  - Views herdam RLS das tabelas base no Postgres/Supabase
--  - Sem MVs neste passo (opcional futuramente com política de refresh)

-- =====================================
-- View: v_guru_simulado_activities
-- =====================================
DROP VIEW IF EXISTS public.v_guru_simulado_activities CASCADE;
CREATE VIEW public.v_guru_simulado_activities AS
SELECT 
  pus.id,
  pus.usuario_id,
  pus.concluido_em,
  pus.tempo_gasto_minutos,
  pus.pontuacao,
  s.titulo,
  s.dificuldade
FROM public.progresso_usuario_simulado pus
LEFT JOIN public.simulados s ON s.id = pus.simulado_id;

COMMENT ON VIEW public.v_guru_simulado_activities IS 'Atividades de simulados por usuário, com metadados do simulado.';

-- Índices são herdados das tabelas base; avaliar MVs se necessário para alto volume

-- =====================================
-- View: v_guru_flashcard_activities
-- =====================================
DROP VIEW IF EXISTS public.v_guru_flashcard_activities CASCADE;
CREATE VIEW public.v_guru_flashcard_activities AS
SELECT 
  puf.id,
  puf.usuario_id,
  -- Algumas instâncias do código esperam criado_em; alinhar como alias de atualizado_em
  puf.atualizado_em AS criado_em,
  puf.status,
  puf.atualizado_em,
  cm.frente,
  cm.disciplina
FROM public.progresso_usuario_flashcard puf
LEFT JOIN public.cartoes_memorizacao cm ON cm.id = puf.flashcard_id;

COMMENT ON VIEW public.v_guru_flashcard_activities IS 'Atividades de flashcards por usuário, com frente/disciplinas.';

-- =====================================
-- View: v_guru_apostila_activities
-- =====================================
DROP VIEW IF EXISTS public.v_guru_apostila_activities CASCADE;
CREATE VIEW public.v_guru_apostila_activities AS
SELECT 
  pua.id,
  pua.usuario_id,
  -- Alias para compatibilidade com consumidores que esperam criado_em
  pua.atualizado_em AS criado_em,
  pua.atualizado_em,
  pua.percentual_progresso,
  ca.titulo
FROM public.progresso_usuario_apostila pua
LEFT JOIN public.conteudo_apostila ca ON ca.id = pua.conteudo_apostila_id;

COMMENT ON VIEW public.v_guru_apostila_activities IS 'Atividades de apostilas por usuário, com título do conteúdo.';


