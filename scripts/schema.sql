-- Criação das tabelas principais

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  study_time_minutes INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  total_correct_answers INTEGER DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0
);

-- Tabela de simulados
CREATE TABLE IF NOT EXISTS simulados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  questions_count INTEGER NOT NULL,
  time_minutes INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  concurso_id UUID,
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT true
);

-- Tabela de progresso do usuário em simulados
CREATE TABLE IF NOT EXISTS user_simulado_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  simulado_id UUID NOT NULL REFERENCES simulados(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_taken_minutes INTEGER NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, simulado_id)
);

-- Tabela de questões semanais
CREATE TABLE IF NOT EXISTS questoes_semanais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT true,
  UNIQUE(week_number, year)
);

-- Tabela de progresso do usuário em questões semanais
CREATE TABLE IF NOT EXISTS user_questoes_semanais_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questoes_semanais_id UUID NOT NULL REFERENCES questoes_semanais(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, questoes_semanais_id)
);

-- Tabela de mapa de assuntos
CREATE TABLE IF NOT EXISTS mapa_assuntos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disciplina TEXT NOT NULL,
  tema TEXT NOT NULL,
  subtema TEXT,
  concurso_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT true
);

-- Tabela de status do usuário no mapa de assuntos
CREATE TABLE IF NOT EXISTS user_mapa_assuntos_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mapa_assunto_id UUID NOT NULL REFERENCES mapa_assuntos(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'estudado', 'a_revisar', 'nao_sei_nada', 'nao_estudado'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, mapa_assunto_id)
);

-- Tabela de planos de estudo
CREATE TABLE IF NOT EXISTS planos_estudo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concurso_id UUID,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  schedule JSONB NOT NULL
);

-- Tabela de flashcards
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  tema TEXT NOT NULL,
  subtema TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT true
);

-- Tabela de progresso do usuário em flashcards
CREATE TABLE IF NOT EXISTS user_flashcard_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'novo', 'aprendendo', 'revisando', 'dominado'
  next_review TIMESTAMP WITH TIME ZONE,
  review_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, flashcard_id)
);

-- Tabela de apostilas
CREATE TABLE IF NOT EXISTS apostilas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  concurso_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT true
);

-- Tabela de conteúdo das apostilas
CREATE TABLE IF NOT EXISTS apostila_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  apostila_id UUID NOT NULL REFERENCES apostilas(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(apostila_id, module_number)
);

-- Tabela de progresso do usuário em apostilas
CREATE TABLE IF NOT EXISTS user_apostila_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  apostila_content_id UUID NOT NULL REFERENCES apostila_content(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  progress_percentage INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, apostila_content_id)
);

-- NOVAS TABELAS IMPLEMENTADAS

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

-- Configurar Row Level Security (RLS)

-- Política para users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_policy ON users
  USING (id = auth.uid() AND deleted_at IS NULL);

-- Política para simulados (todos podem ver, mas apenas criadores podem editar)
ALTER TABLE simulados ENABLE ROW LEVEL SECURITY;
CREATE POLICY simulados_read_policy ON simulados
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));
CREATE POLICY simulados_write_policy ON simulados
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

-- Política para user_simulado_progress
ALTER TABLE user_simulado_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_simulado_progress_policy ON user_simulado_progress
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Política para questoes_semanais (todos podem ver, mas apenas criadores podem editar)
ALTER TABLE questoes_semanais ENABLE ROW LEVEL SECURITY;
CREATE POLICY questoes_semanais_read_policy ON questoes_semanais
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));
CREATE POLICY questoes_semanais_write_policy ON questoes_semanais
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

-- Política para user_questoes_semanais_progress
ALTER TABLE user_questoes_semanais_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_questoes_semanais_progress_policy ON user_questoes_semanais_progress
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Política para mapa_assuntos (todos podem ver, mas apenas criadores podem editar)
ALTER TABLE mapa_assuntos ENABLE ROW LEVEL SECURITY;
CREATE POLICY mapa_assuntos_read_policy ON mapa_assuntos
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));
CREATE POLICY mapa_assuntos_write_policy ON mapa_assuntos
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

-- Política para user_mapa_assuntos_status
ALTER TABLE user_mapa_assuntos_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_mapa_assuntos_status_policy ON user_mapa_assuntos_status
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Política para planos_estudo
ALTER TABLE planos_estudo ENABLE ROW LEVEL SECURITY;
CREATE POLICY planos_estudo_policy ON planos_estudo
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Política para flashcards (todos podem ver, mas apenas criadores podem editar)
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY flashcards_read_policy ON flashcards
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));
CREATE POLICY flashcards_write_policy ON flashcards
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

-- Política para user_flashcard_progress
ALTER TABLE user_flashcard_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_flashcard_progress_policy ON user_flashcard_progress
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Política para apostilas (todos podem ver, mas apenas criadores podem editar)
ALTER TABLE apostilas ENABLE ROW LEVEL SECURITY;
CREATE POLICY apostilas_read_policy ON apostilas
  USING (deleted_at IS NULL AND (is_public = true OR created_by = auth.uid()));
CREATE POLICY apostilas_write_policy ON apostilas
  FOR ALL USING (created_by = auth.uid() AND deleted_at IS NULL);

-- Política para apostila_content (todos podem ver)
ALTER TABLE apostila_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY apostila_content_policy ON apostila_content
  USING (deleted_at IS NULL);

-- Política para user_apostila_progress
ALTER TABLE user_apostila_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_apostila_progress_policy ON user_apostila_progress
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Políticas para novas tabelas

-- Política para user_performance_cache
ALTER TABLE user_performance_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_performance_cache_policy ON user_performance_cache
  USING (user_id = auth.uid());

-- Política para audit_logs (apenas admins podem ver)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_logs_policy ON audit_logs
  USING (user_id = auth.uid() OR auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  ));

-- Política para cache_config (apenas admins podem editar)
ALTER TABLE cache_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY cache_config_read_policy ON cache_config
  USING (true);
CREATE POLICY cache_config_write_policy ON cache_config
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  ));

-- Política para user_discipline_stats
ALTER TABLE user_discipline_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_discipline_stats_policy ON user_discipline_stats
  USING (user_id = auth.uid());

-- Criar índices para melhor performance
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

-- Inserir configurações padrão de cache
INSERT INTO cache_config (cache_key, ttl_minutes, description) VALUES
('performance_complete', 15, 'Cache de estatísticas completas de desempenho'),
('performance_simulados', 10, 'Cache de estatísticas de simulados'),
('performance_questoes', 10, 'Cache de estatísticas de questões'),
('recent_activity', 5, 'Cache de atividades recentes'),
('discipline_stats', 30, 'Cache de estatísticas por disciplina')
ON CONFLICT (cache_key) DO NOTHING;
