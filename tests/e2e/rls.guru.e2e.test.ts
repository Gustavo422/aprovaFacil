import { describe, it, expect } from 'vitest';
import { page, e2eHelpers } from './setup';

describe('RLS – Guru da Aprovação', () => {
  it('nega acesso quando usuário não autenticado (401/403)', async () => {
    // Sem mock de /api/auth/me
    await e2eHelpers.goto('/guru-da-aprovacao');
    // Deve redirecionar ou exibir erro (dependendo da implementação de auth)
    // Checagem genérica por mensagem de erro
    const hasError = await e2eHelpers.elementExists('[data-testid="error-message"], text=Não autorizado');
    expect(hasError).toBe(true);
  });

  it('permite acesso a dados do próprio usuário', async () => {
    await page.route('/api/auth/me', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { id: 'user-1', email: 'u@e.com' } }) });
    });
    await page.route('/api/user/concurso-preference', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { concurso_id: 'c1', categoria_id: 'cat1', pode_alterar_ate: new Date(Date.now()+86400000).toISOString(), criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString() } }) });
    });
    await page.route('/api/guru/v1/dashboard/enhanced-stats', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { totalSimulados: 0, totalQuestoes: 0, totalStudyTime: 0, averageScore: 0, accuracyRate: 0, approvalProbability: 0, studyStreak: 0, weeklyProgress: { simulados: 0, questoes: 0, studyTime: 0, scoreImprovement: 0 }, disciplinaStats: [], performanceHistory: [], goalProgress: { targetScore: 70, currentScore: 0, targetDate: '2025-12-31', daysRemaining: 120, onTrack: false }, competitiveRanking: { position: 0, totalusuarios: 0, percentile: 0 } } }) });
    });
    await e2eHelpers.goto('/guru-da-aprovacao');
    expect(await e2eHelpers.elementExists('text=Progresso Semanal')).toBe(true);
  });
});


