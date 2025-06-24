import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('API Example', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar dados simulados', async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const response = await fetch('/api/example');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toEqual({ success: true });
  });
}); 