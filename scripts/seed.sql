-- Inserir dados de exemplo

-- Inserir simulados
INSERT INTO simulados (title, description, questions_count, time_minutes, difficulty)
VALUES
  ('Simulado Completo - Direito Constitucional', 'Simulado com 40 questões sobre Direito Constitucional', 40, 120, 'Médio'),
  ('Simulado Completo - Direito Administrativo', 'Simulado com 30 questões sobre Direito Administrativo', 30, 90, 'Médio'),
  ('Simulado Completo - Português', 'Simulado com 20 questões sobre Língua Portuguesa', 20, 60, 'Fácil'),
  ('Simulado Completo - Raciocínio Lógico', 'Simulado com 15 questões sobre Raciocínio Lógico', 15, 45, 'Difícil'),
  ('Simulado Completo - Informática', 'Simulado com 20 questões sobre Informática', 20, 60, 'Médio'),
  ('Simulado Completo - Direito Penal', 'Simulado com 25 questões sobre Direito Penal', 25, 75, 'Difícil');

-- Inserir questões semanais
INSERT INTO questoes_semanais (title, description, week_number, year)
VALUES
  ('100 Questões Semanais - Semana 23', 'Questões selecionadas para a semana 23 de 2025', 23, 2025),
  ('100 Questões Semanais - Semana 24', 'Questões selecionadas para a semana 24 de 2025', 24, 2025);

-- Inserir mapa de assuntos
INSERT INTO mapa_assuntos (disciplina, tema, subtema)
VALUES
  ('Direito Constitucional', 'Princípios Fundamentais', NULL),
  ('Direito Constitucional', 'Direitos e Garantias Fundamentais', 'Direitos Individuais e Coletivos'),
  ('Direito Constitucional', 'Direitos e Garantias Fundamentais', 'Direitos Sociais'),
  ('Direito Constitucional', 'Organização do Estado', 'Organização Político-Administrativa'),
  ('Direito Constitucional', 'Organização do Estado', 'União'),
  ('Direito Constitucional', 'Organização do Estado', 'Estados Federados'),
  ('Direito Constitucional', 'Organização do Estado', 'Municípios'),
  ('Direito Constitucional', 'Organização do Estado', 'Distrito Federal e Territórios'),
  ('Direito Constitucional', 'Organização dos Poderes', 'Poder Legislativo'),
  ('Direito Constitucional', 'Organização dos Poderes', 'Poder Executivo'),
  ('Direito Constitucional', 'Organização dos Poderes', 'Poder Judiciário'),
  ('Direito Constitucional', 'Controle de Constitucionalidade', NULL),
  ('Direito Administrativo', 'Regime Jurídico Administrativo', NULL),
  ('Direito Administrativo', 'Princípios do Direito Administrativo', NULL),
  ('Direito Administrativo', 'Organização Administrativa', NULL),
  ('Direito Administrativo', 'Poderes Administrativos', NULL),
  ('Direito Administrativo', 'Atos Administrativos', NULL),
  ('Direito Administrativo', 'Licitações e Contratos', 'Lei 8.666/93'),
  ('Direito Administrativo', 'Licitações e Contratos', 'Lei 14.133/2021'),
  ('Direito Administrativo', 'Serviços Públicos', NULL),
  ('Português', 'Interpretação de Texto', NULL),
  ('Português', 'Tipologia Textual', NULL),
  ('Português', 'Ortografia Oficial', NULL),
  ('Português', 'Acentuação Gráfica', NULL),
  ('Português', 'Emprego das Classes de Palavras', NULL),
  ('Português', 'Emprego do Sinal Indicativo de Crase', NULL),
  ('Português', 'Sintaxe da Oração e do Período', NULL),
  ('Português', 'Pontuação', NULL),
  ('Português', 'Concordância Nominal e Verbal', NULL),
  ('Português', 'Regência Nominal e Verbal', NULL),
  ('Raciocínio Lógico', 'Lógica Proposicional', NULL),
  ('Raciocínio Lógico', 'Lógica de Argumentação', NULL),
  ('Raciocínio Lógico', 'Análise Combinatória', NULL),
  ('Raciocínio Lógico', 'Probabilidade', NULL),
  ('Raciocínio Lógico', 'Estatística Básica', NULL),
  ('Informática', 'Conceitos Básicos', NULL),
  ('Informática', 'Sistemas Operacionais', NULL),
  ('Informática', 'Editores de Texto', NULL),
  ('Informática', 'Planilhas Eletrônicas', NULL),
  ('Informática', 'Internet e Segurança', NULL);

-- Inserir flashcards
INSERT INTO flashcards (front, back, disciplina, tema, subtema)
VALUES
  ('O que são os Princípios Fundamentais da Constituição Federal?', 'São os princípios que fundamentam e orientam o Estado brasileiro, previstos nos artigos 1º a 4º da Constituição Federal. Incluem a soberania, a cidadania, a dignidade da pessoa humana, os valores sociais do trabalho e da livre iniciativa, e o pluralismo político.', 'Direito Constitucional', 'Princípios Fundamentais', NULL),
  ('O que é o Controle de Constitucionalidade?', 'É o mecanismo de verificação da compatibilidade das leis e atos normativos com a Constituição Federal. Pode ser preventivo (antes da promulgação da lei) ou repressivo (após a promulgação). Quanto ao órgão que exerce, pode ser difuso (qualquer juiz ou tribunal) ou concentrado (STF).', 'Direito Constitucional', 'Controle de Constitucionalidade', NULL),
  ('O que é a Nova Lei de Licitações (Lei 14.133/2021)?', 'É a nova lei que estabelece normas gerais de licitação e contratação para as Administrações Públicas diretas, autárquicas e fundacionais. Substituirá integralmente a Lei 8.666/93, a Lei do Pregão (10.520/2002) e o RDC (Lei 12.462/2011) após o período de transição.', 'Direito Administrativo', 'Licitações e Contratos', 'Lei 14.133/2021'),
  ('Quando se usa a crase?', 'A crase é utilizada para indicar a fusão da preposição "a" com o artigo feminino "a" ou com os pronomes demonstrativos "aquele(s)", "aquela(s)" e "aquilo". Ocorre em casos como: 1) Antes de palavras femininas: "Fui à escola"; 2) Nas locuções adverbiais femininas: "à noite"; 3) Nas locuções prepositivas: "à frente de"; entre outros casos.', 'Português', 'Emprego do Sinal Indicativo de Crase', NULL),
  ('O que é Análise Combinatória?', 'É o ramo da matemática que estuda as diferentes maneiras de agrupar e ordenar elementos de um conjunto, sem necessariamente utilizar todos os elementos. Os principais tipos são: arranjos (importa a ordem), combinações (não importa a ordem) e permutações (todos os elementos são utilizados).', 'Raciocínio Lógico', 'Análise Combinatória', NULL);

-- Inserir apostilas
INSERT INTO apostilas (title, description)
VALUES
  ('Apostila de Direito Constitucional', 'Conteúdo completo de Direito Constitucional para concursos públicos'),
  ('Apostila de Direito Administrativo', 'Conteúdo completo de Direito Administrativo para concursos públicos'),
  ('Apostila de Português', 'Conteúdo completo de Língua Portuguesa para concursos públicos'),
  ('Apostila de Raciocínio Lógico', 'Conteúdo completo de Raciocínio Lógico para concursos públicos'),
  ('Apostila de Informática', 'Conteúdo completo de Informática para concursos públicos');

-- Inserir conteúdo das apostilas
INSERT INTO apostila_content (apostila_id, module_number, title, content_json)
VALUES
  ((SELECT id FROM apostilas WHERE title = 'Apostila de Direito Constitucional'), 1, 'Princípios Fundamentais', '{"sections": [{"title": "Introdução", "content": "Os princípios fundamentais são a base do Estado brasileiro..."}, {"title": "Fundamentos da República", "content": "São fundamentos da República Federativa do Brasil: soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político."}]}'),
  ((SELECT id FROM apostilas WHERE title = 'Apostila de Direito Constitucional'), 2, 'Direitos e Garantias Fundamentais', '{"sections": [{"title": "Direitos Individuais e Coletivos", "content": "Os direitos individuais e coletivos estão previstos no art. 5º da Constituição Federal..."}, {"title": "Direitos Sociais", "content": "Os direitos sociais estão previstos nos arts. 6º a 11 da Constituição Federal..."}]}'),
  ((SELECT id FROM apostilas WHERE title = 'Apostila de Direito Administrativo'), 1, 'Regime Jurídico Administrativo', '{"sections": [{"title": "Conceito", "content": "O regime jurídico administrativo é o conjunto de prerrogativas e sujeições a que se submete a Administração Pública..."}, {"title": "Características", "content": "As principais características do regime jurídico administrativo são: supremacia do interesse público e indisponibilidade do interesse público."}]}');
