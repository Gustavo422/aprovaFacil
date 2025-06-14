-- Migration: 001_initial_schema.sql
-- Descrição: Schema inicial com constraints de integridade
-- Data: 2024-01-01
-- Autor: Sistema

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Constraints para enum de dificuldade
ALTER TABLE simulados 
ADD CONSTRAINT check_difficulty 
CHECK (difficulty IN ('Fácil', 'Médio', 'Difícil'));

ALTER TABLE simulado_questions 
ADD CONSTRAINT check_question_difficulty 
CHECK (difficulty IN ('Fácil', 'Médio', 'Difícil'));

-- Constraints para enum de nível de dificuldade de flashcards
ALTER TABLE flashcards 
ADD CONSTRAINT check_nivel_dificuldade 
CHECK (nivel_dificuldade IN ('facil', 'medio', 'dificil'));

-- Constraints para valores numéricos
ALTER TABLE user_simulado_progress 
ADD CONSTRAINT check_score 
CHECK (score >= 0 AND score <= 100);

ALTER TABLE user_simulado_progress 
ADD CONSTRAINT check_time_taken 
CHECK (time_taken_minutes >= 0);

ALTER TABLE user_flashcard_progress 
ADD CONSTRAINT check_tentativas 
CHECK (tentativas >= 0);

ALTER TABLE user_flashcard_progress 
ADD CONSTRAINT check_tempo_resposta 
CHECK (tempo_resposta >= 0 OR tempo_resposta IS NULL);

ALTER TABLE user_apostila_progress 
ADD CONSTRAINT check_progress_percentage 
CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Constraints para campos obrigatórios
ALTER TABLE simulados 
ALTER COLUMN title SET NOT NULL;

ALTER TABLE simulados 
ALTER COLUMN questions_count SET NOT NULL;

ALTER TABLE simulados 
ALTER COLUMN time_minutes SET NOT NULL;

ALTER TABLE simulados 
ALTER COLUMN difficulty SET NOT NULL;

ALTER TABLE simulado_questions 
ALTER COLUMN question_text SET NOT NULL;

ALTER TABLE simulado_questions 
ALTER COLUMN correct_answer SET NOT NULL;

ALTER TABLE flashcards 
ALTER COLUMN pergunta SET NOT NULL;

ALTER TABLE flashcards 
ALTER COLUMN resposta SET NOT NULL;

ALTER TABLE flashcards 
ALTER COLUMN materia SET NOT NULL;

ALTER TABLE flashcards 
ALTER COLUMN assunto SET NOT NULL;

ALTER TABLE flashcards 
ALTER COLUMN nivel_dificuldade SET NOT NULL;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_simulados_concurso_id ON simulados(concurso_id);
CREATE INDEX IF NOT EXISTS idx_simulados_created_by ON simulados(created_by);
CREATE INDEX IF NOT EXISTS idx_simulados_is_public ON simulados(is_public);
CREATE INDEX IF NOT EXISTS idx_simulados_deleted_at ON simulados(deleted_at);

CREATE INDEX IF NOT EXISTS idx_simulado_questions_simulado_id ON simulado_questions(simulado_id);
CREATE INDEX IF NOT EXISTS idx_simulado_questions_deleted_at ON simulado_questions(deleted_at);

CREATE INDEX IF NOT EXISTS idx_user_simulado_progress_user_id ON user_simulado_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_simulado_progress_simulado_id ON user_simulado_progress(simulado_id);

CREATE INDEX IF NOT EXISTS idx_flashcards_concurso_id ON flashcards(concurso_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_materia ON flashcards(materia);
CREATE INDEX IF NOT EXISTS idx_flashcards_assunto ON flashcards(assunto);

CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_user_id ON user_flashcard_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_flashcard_id ON user_flashcard_progress(flashcard_id);

CREATE INDEX IF NOT EXISTS idx_apostilas_concurso_id ON apostilas(concurso_id);

CREATE INDEX IF NOT EXISTS idx_apostila_content_apostila_id ON apostila_content(apostila_id);
CREATE INDEX IF NOT EXISTS idx_apostila_content_concurso_id ON apostila_content(concurso_id);

CREATE INDEX IF NOT EXISTS idx_user_apostila_progress_user_id ON user_apostila_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_apostila_progress_content_id ON user_apostila_progress(apostila_content_id);

-- Comentários para documentação
COMMENT ON TABLE simulados IS 'Tabela de simulados disponíveis para estudo';
COMMENT ON TABLE simulado_questions IS 'Questões de cada simulado';
COMMENT ON TABLE user_simulado_progress IS 'Progresso do usuário em simulados';
COMMENT ON TABLE flashcards IS 'Flashcards para estudo';
COMMENT ON TABLE user_flashcard_progress IS 'Progresso do usuário em flashcards';
COMMENT ON TABLE apostilas IS 'Apostilas de estudo';
COMMENT ON TABLE apostila_content IS 'Conteúdo modular das apostilas';
COMMENT ON TABLE user_apostila_progress IS 'Progresso do usuário em apostilas';

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_simulados_updated_at 
    BEFORE UPDATE ON simulados 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_simulado_questions_updated_at 
    BEFORE UPDATE ON simulado_questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at 
    BEFORE UPDATE ON flashcards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_flashcard_progress_updated_at 
    BEFORE UPDATE ON user_flashcard_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_apostila_progress_updated_at 
    BEFORE UPDATE ON user_apostila_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 