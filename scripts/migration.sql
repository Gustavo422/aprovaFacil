-- Script de migração para adicionar novas funcionalidades
-- Execute este script no seu banco Supabase para atualizar o schema

-- 1. Adicionar novas colunas às tabelas existentes

-- Tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS study_time_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_questions_answered INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_correct_answers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_score NUMERIC(5,2) DEFAULT 0;

-- Tabela simulados
ALTER TABLE simulados 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Tabela user_simulado_progress
ALTER TABLE user_simulado_progress 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Tabela questoes_semanais
ALTER TABLE questoes_semanais 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Tabela user_questoes_semanais_progress
ALTER TABLE user_questoes_semanais_progress 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Tabela mapa_assuntos
ALTER TABLE mapa_assuntos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Tabela user_mapa_assuntos_status
ALTER TABLE user_mapa_assuntos_status 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Tabela planos_estudo
ALTER TABLE planos_estudo 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Tabela flashcards
ALTER TABLE flashcards 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Tabela user_flashcard_progress
ALTER TABLE user_flashcard_progress 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Tabela apostilas
ALTER TABLE apostilas 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Tabela apostila_content
ALTER TABLE apostila_content 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Tabela user_apostila_progress
ALTER TABLE user_apostila_progress 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- 2. Criar novas tabelas

-- Tabela de cache de desempenho do usuário
CREATE TABLE IF NOT EXISTS user_performance_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cache_key TEXT NOT NULL,
  cache_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cache_key)
);

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configuração de cache
CREATE TABLE IF NOT EXISTS cache_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key TEXT UNIQUE NOT NULL,
  ttl_minutes INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de estatísticas de desempenho por disciplina
CREATE TABLE IF NOT EXISTS user_discipline_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  disciplina TEXT NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  study_time_minutes INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, disciplina)
);

-- 3. Atualizar políticas RLS existentes

-- Remover políticas antigas
DROP POLICY IF EXISTS users_policy ON users;
DROP POLICY IF EXISTS simulados_policy ON simulados;
DROP POLICY IF EXISTS questoes_semanais_policy ON questoes_semanais;
DROP POLICY IF EXISTS mapa_assuntos_policy ON mapa_assuntos;
DROP POLICY IF EXISTS flashcards_policy ON flashcards;
DROP POLICY IF EXISTS apostilas_policy ON apostilas;
DROP POLICY IF EXISTS apostila_content_policy ON apostila_content;

-- Criar novas políticas com suporte a soft delete e propriedade
CREATE POLICY users_policy ON users
  USING (id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY simulados_read_policy ON simulados
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));

CREATE POLICY simulados_write_policy ON simulados
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

CREATE POLICY questoes_semanais_read_policy ON questoes_semanais
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));

CREATE POLICY questoes_semanais_write_policy ON questoes_semanais
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

CREATE POLICY mapa_assuntos_read_policy ON mapa_assuntos
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));

CREATE POLICY mapa_assuntos_write_policy ON mapa_assuntos
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

CREATE POLICY flashcards_read_policy ON flashcards
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));

CREATE POLICY flashcards_write_policy ON flashcards
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

CREATE POLICY apostilas_read_policy ON apostilas
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));

CREATE POLICY apostilas_write_policy ON apostilas
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

CREATE POLICY apostila_content_policy ON apostila_content
  USING (deleted_at IS NULL);

-- Atualizar políticas existentes para incluir soft delete
DROP POLICY IF EXISTS user_simulado_progress_policy ON user_simulado_progress;
DROP POLICY IF EXISTS user_questoes_semanais_progress_policy ON user_questoes_semanais_progress;
DROP POLICY IF EXISTS user_mapa_assuntos_status_policy ON user_mapa_assuntos_status;
DROP POLICY IF EXISTS planos_estudo_policy ON planos_estudo;
DROP POLICY IF EXISTS user_flashcard_progress_policy ON user_flashcard_progress;
DROP POLICY IF EXISTS user_apostila_progress_policy ON user_apostila_progress;

CREATE POLICY user_simulado_progress_policy ON user_simulado_progress
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY user_questoes_semanais_progress_policy ON user_questoes_semanais_progress
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY user_mapa_assuntos_status_policy ON user_mapa_assuntos_status
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY planos_estudo_policy ON planos_estudo
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY user_flashcard_progress_policy ON user_flashcard_progress
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY user_apostila_progress_policy ON user_apostila_progress
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- 4. Criar políticas para novas tabelas

CREATE POLICY user_performance_cache_policy ON user_performance_cache
  USING (user_id = auth.uid());

CREATE POLICY audit_logs_policy ON audit_logs
  USING (user_id = auth.uid() OR auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  ));

CREATE POLICY cache_config_read_policy ON cache_config
  USING (true);

CREATE POLICY cache_config_write_policy ON cache_config
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  ));

CREATE POLICY user_discipline_stats_policy ON user_discipline_stats
  USING (user_id = auth.uid());

-- 5. Criar índices para melhor performance

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
CREATE INDEX IF NOT EXISTS idx_simulados_deleted_at ON simulados(deleted_at);
CREATE INDEX IF NOT EXISTS idx_simulados_created_by ON simulados(created_by);
CREATE INDEX IF NOT EXISTS idx_user_simulado_progress_user_id ON user_simulado_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_simulado_progress_deleted_at ON user_simulado_progress(deleted_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_performance_cache_user_id ON user_performance_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_user_performance_cache_expires_at ON user_performance_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_discipline_stats_user_id ON user_discipline_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_discipline_stats_disciplina ON user_discipline_stats(disciplina);

-- 6. Inserir configurações padrão de cache

INSERT INTO cache_config (cache_key, ttl_minutes, description) VALUES
('performance_complete', 15, 'Cache de estatísticas completas de desempenho'),
('performance_simulados', 10, 'Cache de estatísticas de simulados'),
('performance_questoes', 10, 'Cache de estatísticas de questões'),
('recent_activity', 5, 'Cache de atividades recentes'),
('discipline_stats', 30, 'Cache de estatísticas por disciplina')
ON CONFLICT (cache_key) DO NOTHING;

-- 7. Atualizar dados existentes (se necessário)

-- Atualizar created_by para recursos existentes (assumindo que foram criados por um admin)
UPDATE simulados SET created_by = (SELECT id FROM users LIMIT 1) WHERE created_by IS NULL;
UPDATE questoes_semanais SET created_by = (SELECT id FROM users LIMIT 1) WHERE created_by IS NULL;
UPDATE mapa_assuntos SET created_by = (SELECT id FROM users LIMIT 1) WHERE created_by IS NULL;
UPDATE flashcards SET created_by = (SELECT id FROM users LIMIT 1) WHERE created_by IS NULL;
UPDATE apostilas SET created_by = (SELECT id FROM users LIMIT 1) WHERE created_by IS NULL;

-- 8. Criar função para limpeza automática de cache expirado

CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM user_performance_cache 
  WHERE expires_at < NOW();
END;
$$;

-- 9. Criar trigger para atualizar updated_at automaticamente

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas que têm updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_simulados_updated_at BEFORE UPDATE ON simulados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_simulado_progress_updated_at BEFORE UPDATE ON user_simulado_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questoes_semanais_updated_at BEFORE UPDATE ON questoes_semanais FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_questoes_semanais_progress_updated_at BEFORE UPDATE ON user_questoes_semanais_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mapa_assuntos_updated_at BEFORE UPDATE ON mapa_assuntos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_mapa_assuntos_status_updated_at BEFORE UPDATE ON user_mapa_assuntos_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planos_estudo_updated_at BEFORE UPDATE ON planos_estudo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_flashcard_progress_updated_at BEFORE UPDATE ON user_flashcard_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_apostilas_updated_at BEFORE UPDATE ON apostilas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_apostila_content_updated_at BEFORE UPDATE ON apostila_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_apostila_progress_updated_at BEFORE UPDATE ON user_apostila_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_performance_cache_updated_at BEFORE UPDATE ON user_performance_cache FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cache_config_updated_at BEFORE UPDATE ON cache_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_discipline_stats_updated_at BEFORE UPDATE ON user_discipline_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Configurar job para limpeza automática (se disponível no Supabase)

-- Nota: No Supabase, você pode configurar um cron job para executar:
-- SELECT cleanup_expired_cache();
-- Isso pode ser feito através do dashboard do Supabase ou usando pg_cron se habilitado 