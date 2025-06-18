-- ========================================
-- PREPARAÇÃO PARA REESTRUTURAÇÃO DO BANCO
-- ========================================
-- Cria todas as tabelas do sistema de concursos (exceto users, cache_config, user_performance_cache)
-- Primeiro cria as tabelas vazias, depois adiciona as colunas e constraints

-- 1. CRIAÇÃO DAS TABELAS (SEM COLUNAS)
CREATE TABLE IF NOT EXISTS concurso_categorias ();
CREATE TABLE IF NOT EXISTS categoria_disciplinas ();
CREATE TABLE IF NOT EXISTS concursos ();
CREATE TABLE IF NOT EXISTS simulados ();
CREATE TABLE IF NOT EXISTS simulado_questions ();
CREATE TABLE IF NOT EXISTS flashcards ();
CREATE TABLE IF NOT EXISTS apostilas ();
CREATE TABLE IF NOT EXISTS apostila_content ();
CREATE TABLE IF NOT EXISTS user_concurso_preferences ();
CREATE TABLE IF NOT EXISTS user_simulado_progress ();
CREATE TABLE IF NOT EXISTS user_flashcard_progress ();
CREATE TABLE IF NOT EXISTS user_apostila_progress ();

-- 2. ADIÇÃO DAS COLUNAS E CONSTRAINTS

-- concurso_categorias
ALTER TABLE concurso_categorias
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN nome character varying NOT NULL,
  ADD COLUMN slug character varying NOT NULL UNIQUE,
  ADD COLUMN descricao text,
  ADD COLUMN is_active boolean DEFAULT true,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;

-- categoria_disciplinas
ALTER TABLE categoria_disciplinas
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN categoria_id uuid NOT NULL,
  ADD COLUMN nome character varying NOT NULL,
  ADD COLUMN peso integer DEFAULT 1,
  ADD COLUMN horas_semanais integer DEFAULT 2,
  ADD COLUMN ordem integer DEFAULT 0,
  ADD COLUMN is_active boolean DEFAULT true,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT categoria_disciplinas_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES concurso_categorias(id);

-- concursos
ALTER TABLE concursos
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN nome character varying NOT NULL,
  ADD COLUMN categoria_id uuid,
  ADD COLUMN ano integer NOT NULL,
  ADD COLUMN banca character varying NOT NULL,
  ADD COLUMN is_active boolean DEFAULT true,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT concursos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES concurso_categorias(id);

-- simulados
ALTER TABLE simulados
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN title character varying NOT NULL,
  ADD COLUMN description text,
  ADD COLUMN questions_count integer NOT NULL DEFAULT 0,
  ADD COLUMN time_minutes integer NOT NULL DEFAULT 60,
  ADD COLUMN difficulty character varying NOT NULL CHECK (difficulty::text = ANY (ARRAY['Fácil','Médio','Difícil']::text[])),
  ADD COLUMN is_public boolean DEFAULT true,
  ADD COLUMN categoria_id uuid,
  ADD COLUMN concurso_id uuid,
  ADD COLUMN created_by uuid,
  ADD COLUMN deleted_at timestamp with time zone,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT simulados_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES concurso_categorias(id),
  ADD CONSTRAINT simulados_concurso_id_fkey FOREIGN KEY (concurso_id) REFERENCES concursos(id);

-- simulado_questions
ALTER TABLE simulado_questions
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN simulado_id uuid NOT NULL,
  ADD COLUMN question_text text NOT NULL,
  ADD COLUMN option_a text NOT NULL,
  ADD COLUMN option_b text NOT NULL,
  ADD COLUMN option_c text NOT NULL,
  ADD COLUMN option_d text NOT NULL,
  ADD COLUMN option_e text,
  ADD COLUMN correct_answer character NOT NULL CHECK (correct_answer = ANY (ARRAY['A','B','C','D','E'])),
  ADD COLUMN explanation text,
  ADD COLUMN difficulty character varying CHECK (difficulty::text = ANY (ARRAY['Fácil','Médio','Difícil']::text[])),
  ADD COLUMN disciplina character varying,
  ADD COLUMN deleted_at timestamp with time zone,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT simulado_questions_simulado_id_fkey FOREIGN KEY (simulado_id) REFERENCES simulados(id);

-- flashcards
ALTER TABLE flashcards
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN front text NOT NULL,
  ADD COLUMN back text NOT NULL,
  ADD COLUMN disciplina character varying NOT NULL,
  ADD COLUMN tema character varying NOT NULL,
  ADD COLUMN nivel_dificuldade character varying NOT NULL CHECK (nivel_dificuldade::text = ANY (ARRAY['facil','medio','dificil']::text[])),
  ADD COLUMN categoria_id uuid,
  ADD COLUMN concurso_id uuid,
  ADD COLUMN created_by uuid,
  ADD COLUMN is_active boolean DEFAULT true,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT flashcards_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES concurso_categorias(id),
  ADD CONSTRAINT flashcards_concurso_id_fkey FOREIGN KEY (concurso_id) REFERENCES concursos(id);

-- apostilas
ALTER TABLE apostilas
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN titulo character varying NOT NULL,
  ADD COLUMN descricao text,
  ADD COLUMN categoria_id uuid,
  ADD COLUMN concurso_id uuid,
  ADD COLUMN is_active boolean DEFAULT true,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT apostilas_concurso_id_fkey FOREIGN KEY (concurso_id) REFERENCES concursos(id),
  ADD CONSTRAINT apostilas_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES concurso_categorias(id);

-- apostila_content
ALTER TABLE apostila_content
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN apostila_id uuid NOT NULL,
  ADD COLUMN concurso_id uuid,
  ADD COLUMN titulo character varying NOT NULL,
  ADD COLUMN conteudo text NOT NULL,
  ADD COLUMN ordem integer DEFAULT 0,
  ADD COLUMN materia character varying,
  ADD COLUMN is_active boolean DEFAULT true,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT apostila_content_apostila_id_fkey FOREIGN KEY (apostila_id) REFERENCES apostilas(id),
  ADD CONSTRAINT apostila_content_concurso_id_fkey FOREIGN KEY (concurso_id) REFERENCES concursos(id);

-- user_concurso_preferences
ALTER TABLE user_concurso_preferences
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN user_id uuid NOT NULL,
  ADD COLUMN concurso_id uuid NOT NULL,
  ADD COLUMN selected_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN expires_at timestamp with time zone,
  ADD COLUMN is_active boolean DEFAULT true,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT user_concurso_preferences_concurso_id_fkey FOREIGN KEY (concurso_id) REFERENCES concursos(id);

-- user_simulado_progress
ALTER TABLE user_simulado_progress
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN user_id uuid NOT NULL,
  ADD COLUMN simulado_id uuid NOT NULL,
  ADD COLUMN score integer CHECK (score >= 0 AND score <= 100),
  ADD COLUMN time_taken_minutes integer CHECK (time_taken_minutes >= 0),
  ADD COLUMN completed_at timestamp with time zone,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT user_simulado_progress_simulado_id_fkey FOREIGN KEY (simulado_id) REFERENCES simulados(id);

-- user_flashcard_progress
ALTER TABLE user_flashcard_progress
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN user_id uuid NOT NULL,
  ADD COLUMN flashcard_id uuid NOT NULL,
  ADD COLUMN tentativas integer DEFAULT 0 CHECK (tentativas >= 0),
  ADD COLUMN acertos integer DEFAULT 0 CHECK (acertos >= 0),
  ADD COLUMN tempo_resposta integer CHECK (tempo_resposta >= 0 OR tempo_resposta IS NULL),
  ADD COLUMN ultima_tentativa timestamp with time zone,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT user_flashcard_progress_flashcard_id_fkey FOREIGN KEY (flashcard_id) REFERENCES flashcards(id);

-- user_apostila_progress
ALTER TABLE user_apostila_progress
  ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN user_id uuid NOT NULL,
  ADD COLUMN apostila_content_id uuid NOT NULL,
  ADD COLUMN progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  ADD COLUMN completed_at timestamp with time zone,
  ADD COLUMN created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT user_apostila_progress_apostila_content_id_fkey FOREIGN KEY (apostila_content_id) REFERENCES apostila_content(id); 