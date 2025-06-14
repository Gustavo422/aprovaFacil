-- Dados de exemplo para popular o banco
-- Execute este script após o setup_foreign_keys.sql

-- 1. Inserir concursos de exemplo
INSERT INTO public.concursos (id, nome, categoria, ano, banca, is_active, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ENEM 2024', 'Vestibular', 2024, 'INEP', true, NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Concurso Polícia Federal 2024', 'Concurso Público', 2024, 'CESPE/CEBRASPE', true, NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Concurso Receita Federal 2024', 'Concurso Público', 2024, 'CESPE/CEBRASPE', true, NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'FUVEST 2024', 'Vestibular', 2024, 'FUVEST', true, NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Concurso Banco do Brasil 2024', 'Concurso Público', 2024, 'CESGRANRIO', true, NOW());

-- 2. Inserir simulados de exemplo
INSERT INTO public.simulados (id, title, description, difficulty, concurso_id, questions_count, time_minutes, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'Simulado ENEM - Ciências da Natureza', 'Simulado completo de Ciências da Natureza para o ENEM', 'Médio', '550e8400-e29b-41d4-a716-446655440001', 45, 90, NOW()),
('550e8400-e29b-41d4-a716-446655440102', 'Simulado ENEM - Ciências Humanas', 'Simulado completo de Ciências Humanas para o ENEM', 'Médio', '550e8400-e29b-41d4-a716-446655440001', 45, 90, NOW()),
('550e8400-e29b-41d4-a716-446655440103', 'Simulado PF - Português', 'Simulado de Português para Polícia Federal', 'Difícil', '550e8400-e29b-41d4-a716-446655440002', 30, 60, NOW()),
('550e8400-e29b-41d4-a716-446655440104', 'Simulado RF - Direito Constitucional', 'Simulado de Direito Constitucional para Receita Federal', 'Difícil', '550e8400-e29b-41d4-a716-446655440003', 25, 50, NOW()),
('550e8400-e29b-41d4-a716-446655440105', 'Simulado FUVEST - Matemática', 'Simulado de Matemática para FUVEST', 'Difícil', '550e8400-e29b-41d4-a716-446655440004', 20, 60, NOW());

-- 3. Inserir questões de simulado de exemplo
INSERT INTO public.simulado_questions (id, simulado_id, question_number, question_text, alternatives, correct_answer, explanation, discipline, topic, difficulty, concurso_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 1, 'Qual é a principal função da mitocôndria na célula?', 
 '["Produção de proteínas", "Produção de energia", "Digestão celular", "Controle genético"]', 
 '1', 
 'A mitocôndria é responsável pela produção de energia através da respiração celular.', 
 'Biologia', 'Citologia', 'Médio', '550e8400-e29b-41d4-a716-446655440001', NOW()),

('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', 2, 'Qual elemento químico é essencial para a fotossíntese?', 
 '["Carbono", "Oxigênio", "Nitrogênio", "Fósforo"]', 
 '0', 
 'O carbono é o elemento fundamental para a fotossíntese, sendo fixado na forma de CO2.', 
 'Química', 'Química Orgânica', 'Médio', '550e8400-e29b-41d4-a716-446655440001', NOW()),

('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440102', 1, 'Qual foi o principal objetivo da Revolução Industrial?', 
 '["Melhorar as condições de vida dos trabalhadores", "Aumentar a produção industrial", "Reduzir a poluição", "Eliminar a escravidão"]', 
 '1', 
 'A Revolução Industrial visava principalmente aumentar a produção industrial através da mecanização.', 
 'História', 'História Moderna', 'Médio', '550e8400-e29b-41d4-a716-446655440001', NOW()),

('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440103', 1, 'Qual é a função do sujeito na oração?', 
 '["Indicar a ação", "Receber a ação", "Modificar o verbo", "Conectar orações"]', 
 '1', 
 'O sujeito é o termo que pratica ou recebe a ação expressa pelo verbo.', 
 'Português', 'Sintaxe', 'Difícil', '550e8400-e29b-41d4-a716-446655440002', NOW()),

('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440104', 1, 'Qual é o princípio fundamental da República Federativa do Brasil?', 
 '["Democracia", "Soberania", "Cidadania", "Todos os anteriores"]', 
 '3', 
 'Todos os princípios mencionados são fundamentais da República Federativa do Brasil.', 
 'Direito', 'Direito Constitucional', 'Difícil', '550e8400-e29b-41d4-a716-446655440003', NOW());

-- 4. Inserir apostilas de exemplo
INSERT INTO public.apostilas (id, title, description, concurso_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440301', 'Apostila ENEM - Biologia', 'Apostila completa de Biologia para o ENEM', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440302', 'Apostila ENEM - História', 'Apostila completa de História para o ENEM', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440303', 'Apostila PF - Português', 'Apostila de Português para Polícia Federal', '550e8400-e29b-41d4-a716-446655440002', NOW()),
('550e8400-e29b-41d4-a716-446655440304', 'Apostila RF - Direito', 'Apostila de Direito para Receita Federal', '550e8400-e29b-41d4-a716-446655440003', NOW()),
('550e8400-e29b-41d4-a716-446655440305', 'Apostila FUVEST - Matemática', 'Apostila de Matemática para FUVEST', '550e8400-e29b-41d4-a716-446655440004', NOW());

-- 5. Inserir conteúdo de apostilas de exemplo
INSERT INTO public.apostila_content (id, apostila_id, module_number, title, content_json, concurso_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440301', 1, 'Introdução à Biologia Celular', '{"content": "A célula é a unidade fundamental da vida...", "sections": ["Introdução", "Estrutura Celular", "Funções"]}', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440301', 2, 'Metabolismo Celular', '{"content": "O metabolismo é o conjunto de reações químicas...", "sections": ["Catabolismo", "Anabolismo", "ATP"]}', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440302', 1, 'História Antiga', '{"content": "A história antiga abrange o período...", "sections": ["Mesopotâmia", "Egito", "Grécia", "Roma"]}', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440303', 1, 'Morfologia', '{"content": "A morfologia estuda a estrutura das palavras...", "sections": ["Substantivos", "Adjetivos", "Verbos"]}', '550e8400-e29b-41d4-a716-446655440002', NOW()),
('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440304', 1, 'Direitos Fundamentais', '{"content": "Os direitos fundamentais são...", "sections": ["Direitos Civis", "Direitos Políticos", "Direitos Sociais"]}', '550e8400-e29b-41d4-a716-446655440003', NOW());

-- 6. Inserir flashcards de exemplo
INSERT INTO public.flashcards (id, front, back, disciplina, tema, subtema, concurso_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440501', 'O que é mitocôndria?', 'Organela responsável pela produção de energia na célula', 'Biologia', 'Citologia', 'Organelas', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440502', 'Qual é a fórmula da água?', 'H2O', 'Química', 'Química Inorgânica', 'Compostos', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440503', 'O que é fotossíntese?', 'Processo pelo qual as plantas produzem seu próprio alimento', 'Biologia', 'Fisiologia Vegetal', 'Metabolismo', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440504', 'Qual é a capital do Brasil?', 'Brasília', 'Geografia', 'Geografia do Brasil', 'Capitais', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440505', 'O que é sujeito?', 'Termo que pratica ou recebe a ação do verbo', 'Português', 'Sintaxe', 'Análise Sintática', '550e8400-e29b-41d4-a716-446655440002', NOW());

-- 7. Inserir mapa de assuntos de exemplo
INSERT INTO public.mapa_assuntos (id, disciplina, tema, subtema, concurso_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440601', 'Biologia', 'Citologia', 'Organelas Celulares', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440602', 'Biologia', 'Genética', 'Herança Mendeliana', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440603', 'Química', 'Química Orgânica', 'Hidrocarbonetos', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440604', 'História', 'História do Brasil', 'Período Colonial', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440605', 'Português', 'Sintaxe', 'Análise Sintática', '550e8400-e29b-41d4-a716-446655440002', NOW()),
('550e8400-e29b-41d4-a716-446655440606', 'Direito', 'Direito Constitucional', 'Direitos Fundamentais', '550e8400-e29b-41d4-a716-446655440003', NOW()),
('550e8400-e29b-41d4-a716-446655440607', 'Matemática', 'Álgebra', 'Equações do 2º Grau', '550e8400-e29b-41d4-a716-446655440004', NOW()),
('550e8400-e29b-41d4-a716-446655440608', 'Matemática', 'Geometria', 'Geometria Analítica', '550e8400-e29b-41d4-a716-446655440004', NOW());

-- 8. Inserir questões semanais de exemplo
INSERT INTO public.questoes_semanais (id, title, description, week_number, year, concurso_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440701', 'Questão Semanal - Biologia', 'Questão sobre cloroplasto e fotossíntese', 2, 2024, '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440702', 'Questão Semanal - Química', 'Questão sobre ácido sulfúrico', 3, 2024, '550e8400-e29b-41d4-a716-446655440001', NOW()),
('550e8400-e29b-41d4-a716-446655440703', 'Questão Semanal - Português', 'Questão sobre predicado', 4, 2024, '550e8400-e29b-41d4-a716-446655440002', NOW());

-- Verificar se os dados foram inseridos corretamente
SELECT 'Concursos' as tabela, COUNT(*) as total FROM public.concursos
UNION ALL
SELECT 'Simulados', COUNT(*) FROM public.simulados
UNION ALL
SELECT 'Questões de Simulado', COUNT(*) FROM public.simulado_questions
UNION ALL
SELECT 'Apostilas', COUNT(*) FROM public.apostilas
UNION ALL
SELECT 'Conteúdo de Apostilas', COUNT(*) FROM public.apostila_content
UNION ALL
SELECT 'Flashcards', COUNT(*) FROM public.flashcards
UNION ALL
SELECT 'Mapa de Assuntos', COUNT(*) FROM public.mapa_assuntos
UNION ALL
SELECT 'Questões Semanais', COUNT(*) FROM public.questoes_semanais; 