import { describe, it, beforeEach, expect } from 'vitest';
import { page, e2eHelpers } from './setup';

const TEST_USER = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'guru-user@aprovafacil.com',
  nome: 'Guru Tester',
};

const PREFERENCIA = {
  concurso_id: '22222222-2222-4222-8222-222222222222',
  categoria_id: '33333333-3333-4333-8333-333333333333',
  pode_alterar_ate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
  criado_em: new Date().toISOString(),
  atualizado_em: new Date().toISOString(),
};

beforeEach(async () => {
  // Autenticação simulada
  await page.route('/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { id: TEST_USER.id, email: TEST_USER.email, nome: TEST_USER.nome } }),
    });
  });

  // Preferência de concurso ativa
  await page.route('/api/user/concurso-preference', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: PREFERENCIA }),
    });
  });

  // Dados do Guru - enhanced stats
  await page.route('/api/guru/v1/dashboard/enhanced-stats', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          totalSimulados: 5,
          totalQuestoes: 120,
          totalStudyTime: 350,
          averageScore: 68.5,
          accuracyRate: 74.2,
          approvalProbability: 62.0,
          studyStreak: 6,
          weeklyProgress: { simulados: 2, questoes: 45, studyTime: 180, scoreImprovement: 2.1 },
          disciplinaStats: [],
          performanceHistory: [],
          goalProgress: { targetScore: 70, currentScore: 68.5, targetDate: '2025-12-31', daysRemaining: 120, onTrack: false },
          competitiveRanking: { position: 120, totalusuarios: 2000, percentile: 94.0 },
        },
      }),
    });
  });

  // Dados do Guru - atividades
  await page.route(/\/api\/guru\/v1\/dashboard\/activities.*/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          { id: 'a1', type: 'simulado', titulo: 'Simulado 1', descricao: '50 questões', time: '45min', created_at: new Date().toISOString(), score: 72 },
          { id: 'a2', type: 'flashcard', titulo: 'Revisão de Português', descricao: 'disciplina: Português', time: '', created_at: new Date(Date.now() - 3600_000).toISOString() },
        ],
      }),
    });
  });
});

describe('Guru da Aprovação – E2E', () => {
  it('deve carregar a página com estatísticas e atividades', async () => {
    await e2eHelpers.goto('/guru-da-aprovacao');

    // Cabeçalho
    expect(await e2eHelpers.elementExists('text=Guru da Aprovação')).toBe(true);

    // Seções principais
    expect(await e2eHelpers.elementExists('text=Progresso Semanal')).toBe(true);
    expect(await e2eHelpers.elementExists('text=Atividades Recentes')).toBe(true);
    expect(await e2eHelpers.elementExists('text=Ranking Competitivo')).toBe(true);
  });
});


