import { test, expect } from '@playwright/test';

test.describe('Fluxo Simulados (login → selecionar concurso → lista → detalhe por slug)', () => {
  test('usuário consegue navegar até detalhe do simulado por slug', async ({ page }) => {
    // Login (assumindo rota /login e credenciais de teste seedadas)
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Selecionar concurso (assumindo página de seleção de concurso)
    await page.waitForURL('**/selecionar-concurso');
    await page.click('[data-testid="concurso-card"]');
    await page.click('button[data-testid="confirmar-concurso"]');

    // Navegar para lista de simulados
    await page.goto('http://localhost:3000/simulados');
    await expect(page.getByRole('heading', { name: 'Simulados' })).toBeVisible();

    // Acessar primeiro simulado por link de slug
    const firstLink = page.locator('a[href^="/simulados/"]').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();
    if (!href) return;
    await firstLink.click();

    // Verificar página de detalhe
    await page.waitForURL(`**${href}`);
    await expect(page.locator('[data-testid="simulado-detalhe"]')).toBeVisible();
    await expect(page.locator('[data-testid="questoes-lista"]')).toBeVisible();
  });
});


