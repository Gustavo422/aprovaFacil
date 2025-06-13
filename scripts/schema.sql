-- Criação das tabelas principais

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  concurso_id UUID
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
  UNIQUE(user_id, questoes_semanais_id)
);

-- Tabela de mapa de assuntos
CREATE TABLE IF NOT EXISTS mapa_assuntos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disciplina TEXT NOT NULL,
  tema TEXT NOT NULL,
  subtema TEXT,
  concurso_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de status do usuário no mapa de assuntos
CREATE TABLE IF NOT EXISTS user_mapa_assuntos_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mapa_assunto_id UUID NOT NULL REFERENCES mapa_assuntos(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'estudado', 'a_revisar', 'nao_sei_nada', 'nao_estudado'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  UNIQUE(user_id, flashcard_id)
);

-- Tabela de apostilas
CREATE TABLE IF NOT EXISTS apostilas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  concurso_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conteúdo das apostilas
CREATE TABLE IF NOT EXISTS apostila_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  apostila_id UUID NOT NULL REFERENCES apostilas(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
  UNIQUE(user_id, apostila_content_id)
);

-- Configurar Row Level Security (RLS)

-- Política para users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_policy ON users
  USING (id = auth.uid());

-- Política para simulados (todos podem ver)
ALTER TABLE simulados ENABLE ROW LEVEL SECURITY;
CREATE POLICY simulados_policy ON simulados
  USING (true);

-- Política para user_simulado_progress
ALTER TABLE user_simulado_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_simulado_progress_policy ON user_simulado_progress
  USING (user_id = auth.uid());

-- Política para questoes_semanais (todos podem ver)
ALTER TABLE questoes_semanais ENABLE ROW LEVEL SECURITY;
CREATE POLICY questoes_semanais_policy ON questoes_semanais
  USING (true);

-- Política para user_questoes_semanais_progress
ALTER TABLE user_questoes_semanais_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_questoes_semanais_progress_policy ON user_questoes_semanais_progress
  USING (user_id = auth.uid());

-- Política para mapa_assuntos (todos podem ver)
ALTER TABLE mapa_assuntos ENABLE ROW LEVEL SECURITY;
CREATE POLICY mapa_assuntos_policy ON mapa_assuntos
  USING (true);

-- Política para user_mapa_assuntos_status
ALTER TABLE user_mapa_assuntos_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_mapa_assuntos_status_policy ON user_mapa_assuntos_status
  USING (user_id = auth.uid());

-- Política para planos_estudo
ALTER TABLE planos_estudo ENABLE ROW LEVEL SECURITY;
CREATE POLICY planos_estudo_policy ON planos_estudo
  USING (user_id = auth.uid());

-- Política para flashcards (todos podem ver)
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY flashcards_policy ON flashcards
  USING (true);

-- Política para user_flashcard_progress
ALTER TABLE user_flashcard_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_flashcard_progress_policy ON user_flashcard_progress
  USING (user_id = auth.uid());

-- Política para apostilas (todos podem ver)
ALTER TABLE apostilas ENABLE ROW LEVEL SECURITY;
CREATE POLICY apostilas_policy ON apostilas
  USING (true);

-- Política para apostila_content (todos podem ver)
ALTER TABLE apostila_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY apostila_content_policy ON apostila_content
  USING (true);

-- Política para user_apostila_progress
ALTER TABLE user_apostila_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_apostila_progress_policy ON user_apostila_progress
  USING (user_id = auth.uid());
