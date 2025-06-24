-- Tabela de lookup para Disciplinas
CREATE TABLE IF NOT EXISTS public.disciplinas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT disciplinas_pkey PRIMARY KEY (id)
);

-- Tabela de lookup para Temas
CREATE TABLE IF NOT EXISTS public.temas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying NOT NULL UNIQUE,
  disciplina_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT temas_pkey PRIMARY KEY (id),
  CONSTRAINT temas_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES public.disciplinas(id)
);

-- Tabela de lookup para Subtemas
CREATE TABLE IF NOT EXISTS public.subtemas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying NOT NULL UNIQUE,
  tema_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT subtemas_pkey PRIMARY KEY (id),
  CONSTRAINT subtemas_tema_id_fkey FOREIGN KEY (tema_id) REFERENCES public.temas(id)
);

-- Alterar tabelas existentes para usar as novas chaves estrangeiras

ALTER TABLE public.flashcards
ADD COLUMN disciplina_id uuid,
ADD COLUMN tema_id uuid,
ADD COLUMN subtema_id uuid;

ALTER TABLE public.flashcards
ADD CONSTRAINT flashcards_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES public.disciplinas(id),
ADD CONSTRAINT flashcards_tema_id_fkey FOREIGN KEY (tema_id) REFERENCES public.temas(id),
ADD CONSTRAINT flashcards_subtema_id_fkey FOREIGN KEY (subtema_id) REFERENCES public.subtemas(id);

-- Migrar dados existentes (se houver) e remover colunas antigas
-- (Este script de migração de dados seria mais complexo e exigiria lógica para mapear strings existentes para IDs de lookup)
-- Por simplicidade, para este refactoring, assumimos que os dados serão migrados manualmente ou em um processo separado.

ALTER TABLE public.flashcards
DROP COLUMN IF EXISTS disciplina,
DROP COLUMN IF EXISTS tema,
DROP COLUMN IF EXISTS subtema;

ALTER TABLE public.mapa_assuntos
ADD COLUMN disciplina_id uuid,
ADD COLUMN tema_id uuid,
ADD COLUMN subtema_id uuid;

ALTER TABLE public.mapa_assuntos
ADD CONSTRAINT mapa_assuntos_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES public.disciplinas(id),
ADD CONSTRAINT mapa_assuntos_tema_id_fkey FOREIGN KEY (tema_id) REFERENCES public.temas(id),
ADD CONSTRAINT mapa_assuntos_subtema_id_fkey FOREIGN KEY (subtema_id) REFERENCES public.subtemas(id);

ALTER TABLE public.mapa_assuntos
DROP COLUMN IF EXISTS disciplina,
DROP COLUMN IF EXISTS tema,
DROP COLUMN IF EXISTS subtema;

ALTER TABLE public.simulado_questions
ADD COLUMN subject_id uuid;

ALTER TABLE public.simulado_questions
ADD CONSTRAINT simulado_questions_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.disciplinas(id);

ALTER TABLE public.simulado_questions
DROP COLUMN IF EXISTS subject;

ALTER TABLE public.user_discipline_stats
ADD COLUMN disciplina_id uuid;

ALTER TABLE public.user_discipline_stats
ADD CONSTRAINT user_discipline_stats_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES public.disciplinas(id);

ALTER TABLE public.user_discipline_stats
DROP COLUMN IF EXISTS disciplina;

-- Adicionar índices para otimização de consultas

CREATE INDEX IF NOT EXISTS idx_apostila_content_concurso_id ON public.apostila_content (concurso_id);
CREATE INDEX IF NOT EXISTS idx_apostilas_concurso_id ON public.apostilas (concurso_id);
CREATE INDEX IF NOT EXISTS idx_apostilas_categoria_id ON public.apostilas (categoria_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_concurso_id ON public.flashcards (concurso_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_categoria_id ON public.flashcards (categoria_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_disciplina_id ON public.flashcards (disciplina_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_tema_id ON public.flashcards (tema_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_subtema_id ON public.flashcards (subtema_id);
CREATE INDEX IF NOT EXISTS idx_mapa_assuntos_concurso_id ON public.mapa_assuntos (concurso_id);
CREATE INDEX IF NOT EXISTS idx_mapa_assuntos_categoria_id ON public.mapa_assuntos (categoria_id);
CREATE INDEX IF NOT EXISTS idx_mapa_assuntos_disciplina_id ON public.mapa_assuntos (disciplina_id);
CREATE INDEX IF NOT EXISTS idx_mapa_assuntos_tema_id ON public.mapa_assuntos (tema_id);
CREATE INDEX IF NOT EXISTS idx_mapa_assuntos_subtema_id ON public.mapa_assuntos (subtema_id);
CREATE INDEX IF NOT EXISTS idx_planos_estudo_user_id ON public.planos_estudo (user_id);
CREATE INDEX IF NOT EXISTS idx_planos_estudo_concurso_id ON public.planos_estudo (concurso_id);
CREATE INDEX IF NOT EXISTS idx_questoes_semanais_concurso_id ON public.questoes_semanais (concurso_id);
CREATE INDEX IF NOT EXISTS idx_simulado_questions_simulado_id ON public.simulado_questions (simulado_id);
CREATE INDEX IF NOT EXISTS idx_simulado_questions_concurso_id ON public.simulado_questions (concurso_id);
CREATE INDEX IF NOT EXISTS idx_simulado_questions_categoria_id ON public.simulado_questions (categoria_id);
CREATE INDEX IF NOT EXISTS idx_simulado_questions_subject_id ON public.simulado_questions (subject_id);
CREATE INDEX IF NOT EXISTS idx_simulados_concurso_id ON public.simulados (concurso_id);
CREATE INDEX IF NOT EXISTS idx_simulados_categoria_id ON public.simulados (categoria_id);
CREATE INDEX IF NOT EXISTS idx_user_apostila_progress_user_id ON public.user_apostila_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_apostila_progress_apostila_content_id ON public.user_apostila_progress (apostila_content_id);
CREATE INDEX IF NOT EXISTS idx_user_concurso_preferences_user_id ON public.user_concurso_preferences (user_id);
CREATE INDEX IF NOT EXISTS idx_user_concurso_preferences_concurso_id ON public.user_concurso_preferences (concurso_id);
CREATE INDEX IF NOT EXISTS idx_user_discipline_stats_user_id ON public.user_discipline_stats (user_id);
CREATE INDEX IF NOT EXISTS idx_user_discipline_stats_disciplina_id ON public.user_discipline_stats (disciplina_id);
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_user_id ON public.user_flashcard_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_flashcard_id ON public.user_flashcard_progress (flashcard_id);
CREATE INDEX IF NOT EXISTS idx_user_mapa_assuntos_status_user_id ON public.user_mapa_assuntos_status (user_id);
CREATE INDEX IF NOT EXISTS idx_user_mapa_assuntos_status_mapa_assunto_id ON public.user_mapa_assuntos_status (mapa_assunto_id);
CREATE INDEX IF NOT EXISTS idx_user_performance_cache_user_id ON public.user_performance_cache (user_id);
CREATE INDEX IF NOT EXISTS idx_user_performance_cache_cache_key ON public.user_performance_cache (cache_key);
CREATE INDEX IF NOT EXISTS idx_user_questoes_semanais_progress_user_id ON public.user_questoes_semanais_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_questoes_semanais_progress_questoes_semanais_id ON public.user_questoes_semanais_progress (questoes_semanais_id);
CREATE INDEX IF NOT EXISTS idx_user_simulado_progress_user_id ON public.user_simulado_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_simulado_progress_simulado_id ON public.user_simulado_progress (simulado_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- Adiciona o campo slug à tabela apostilas
ALTER TABLE public.apostilas ADD COLUMN IF NOT EXISTS slug VARCHAR UNIQUE;
-- Opcional: criar índice para busca rápida
CREATE UNIQUE INDEX IF NOT EXISTS idx_apostilas_slug ON public.apostilas(slug);