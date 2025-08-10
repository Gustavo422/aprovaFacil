-- Seeds determinísticos para ambiente de dev/test (Guru)
-- ATENÇÃO: executar apenas em ambientes de desenvolvimento/teste.

insert into public.usuarios (id, nome, email, senha_hash, ativo, primeiro_login)
values
  ('11111111-1111-4111-8111-111111111111', 'Guru Tester', 'guru-user@aprovafacil.com', '$2a$10$testeseed', true, false)
on conflict (id) do nothing;

insert into public.concursos (id, nome, slug, descricao, ano, banca, ativo)
values
  ('22222222-2222-4222-8222-222222222222', 'Concurso Seed', 'concurso-seed', 'Concurso para testes', 2025, 'FCC', true)
on conflict (id) do nothing;

insert into public.preferencias_usuario_concurso (id, usuario_id, concurso_id, pode_alterar_ate, selecionado_em, ativo)
values
  ('44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', now() + interval '7 days', now(), true)
on conflict (id) do nothing;

-- Simulados de exemplo (agregados do dashboard)
insert into public.progresso_usuario_simulado (id, usuario_id, simulado_id, pontuacao, tempo_gasto_minutos, concluido_em)
values
  ('55555555-5555-4555-8555-555555555555', '11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 70, 40, now() - interval '2 days'),
  ('66666666-6666-4666-8666-666666666666', '11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 78, 45, now() - interval '1 days')
on conflict (id) do nothing;

-- Questões semanais
insert into public.respostas_questoes_semanais (id, usuario_id, questao_semanal_id, resposta_escolhida, correta, criado_em)
values
  ('77777777-7777-4777-8777-777777777777', '11111111-1111-4111-8111-111111111111', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'A', true, now() - interval '3 days')
on conflict (id) do nothing;

-- Flashcards
insert into public.progresso_usuario_flashcard (id, usuario_id, flashcard_id, status, atualizado_em)
values
  ('88888888-8888-4888-8888-888888888888', '11111111-1111-4111-8111-111111111111', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'dominado', now() - interval '12 hours')
on conflict (id) do nothing;


