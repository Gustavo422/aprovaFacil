-- ========================================
-- MIGRAÇÃO: ADICIONAR COLUNAS À TABELA USERS
-- ========================================
-- Descrição: Adiciona colunas de estatísticas que estão sendo referenciadas no código
-- Data: 2024-12-16
-- Autor: Sistema

-- Adicionar colunas de estatísticas à tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS total_questions_answered INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_correct_answers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS study_time_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_score DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Adicionar trigger se não existir
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_users_updated_at();

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_users_total_questions_answered ON users(total_questions_answered);
CREATE INDEX IF NOT EXISTS idx_users_average_score ON users(average_score);
CREATE INDEX IF NOT EXISTS idx_users_study_time_minutes ON users(study_time_minutes);

-- Comentários para documentação
COMMENT ON COLUMN users.total_questions_answered IS 'Total de questões respondidas pelo usuário';
COMMENT ON COLUMN users.total_correct_answers IS 'Total de respostas corretas do usuário';
COMMENT ON COLUMN users.study_time_minutes IS 'Tempo total de estudo em minutos';
COMMENT ON COLUMN users.average_score IS 'Pontuação média do usuário (0-100)';
COMMENT ON COLUMN users.updated_at IS 'Data da última atualização do perfil'; 