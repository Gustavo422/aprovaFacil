-- ========================================
-- TRIGGERS E ÍNDICES PARA O SISTEMA DE CONCURSOS
-- ========================================
-- Execute este script após prepare_restructure.sql

-- 1. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Triggers para updated_at em todas as tabelas
CREATE TRIGGER trg_concurso_categorias_updated_at
    BEFORE UPDATE ON concurso_categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_categoria_disciplinas_updated_at
    BEFORE UPDATE ON categoria_disciplinas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_concursos_updated_at
    BEFORE UPDATE ON concursos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_simulados_updated_at
    BEFORE UPDATE ON simulados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_simulado_questions_updated_at
    BEFORE UPDATE ON simulado_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_flashcards_updated_at
    BEFORE UPDATE ON flashcards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_apostilas_updated_at
    BEFORE UPDATE ON apostilas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_apostila_content_updated_at
    BEFORE UPDATE ON apostila_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_concurso_preferences_updated_at
    BEFORE UPDATE ON user_concurso_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_simulado_progress_updated_at
    BEFORE UPDATE ON user_simulado_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_flashcard_progress_updated_at
    BEFORE UPDATE ON user_flashcard_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_apostila_progress_updated_at
    BEFORE UPDATE ON user_apostila_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Índices para performance
-- Índices para foreign keys
CREATE INDEX IF NOT EXISTS idx_concursos_categoria_id ON concursos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_simulados_categoria_id ON simulados(categoria_id);
CREATE INDEX IF NOT EXISTS idx_simulados_concurso_id ON simulados(concurso_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_categoria_id ON flashcards(categoria_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_concurso_id ON flashcards(concurso_id);
CREATE INDEX IF NOT EXISTS idx_apostilas_categoria_id ON apostilas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_apostilas_concurso_id ON apostilas(concurso_id);
CREATE INDEX IF NOT EXISTS idx_apostila_content_apostila_id ON apostila_content(apostila_id);
CREATE INDEX IF NOT EXISTS idx_apostila_content_concurso_id ON apostila_content(concurso_id);

-- Índices para campos de busca
CREATE INDEX IF NOT EXISTS idx_concursos_is_active ON concursos(is_active);
CREATE INDEX IF NOT EXISTS idx_simulados_is_public ON simulados(is_public);
CREATE INDEX IF NOT EXISTS idx_flashcards_is_active ON flashcards(is_active);
CREATE INDEX IF NOT EXISTS idx_apostilas_is_active ON apostilas(is_active);
CREATE INDEX IF NOT EXISTS idx_apostila_content_is_active ON apostila_content(is_active);

-- Índices para progresso do usuário
CREATE INDEX IF NOT EXISTS idx_user_simulado_progress_user_id ON user_simulado_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_simulado_progress_simulado_id ON user_simulado_progress(simulado_id);
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_user_id ON user_flashcard_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_flashcard_id ON user_flashcard_progress(flashcard_id);
CREATE INDEX IF NOT EXISTS idx_user_apostila_progress_user_id ON user_apostila_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_apostila_progress_content_id ON user_apostila_progress(apostila_content_id);
CREATE INDEX IF NOT EXISTS idx_user_concurso_preferences_user_id ON user_concurso_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_concurso_preferences_concurso_id ON user_concurso_preferences(concurso_id); 