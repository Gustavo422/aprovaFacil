import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SimuladosService } from '../../../../backend/src/modules/simulados/services/simulados.service.ts';

function createRepoStub() {
  return {
    listarSimulados: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, limit: 10 }),
    buscarPorSlug: vi.fn(),
    listarQuestoesPorSimuladoId: vi.fn().mockResolvedValue([]),
    contarPorDificuldade: vi.fn().mockResolvedValue({}),
    obterTendencias: vi.fn().mockResolvedValue({ criados_7d: 0, atualizados_7d: 0 }),
    buscarIdPorSlug: vi.fn(),
  } as const;
}

function createCacheStub() {
  const store = new Map<string, unknown>();
  return {
    obter: vi.fn(async (k: string) => store.get(k)),
    definir: vi.fn(async (k: string, v: unknown) => { store.set(k, v); }),
  } as const;
}

function createLogStub() {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  } as const;
}

function createSupabaseStub(): SupabaseClient {
  const qb: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
  };
  return {
    from: vi.fn(() => qb),
  } as unknown as SupabaseClient;
}

describe('SimuladosService', () => {
  beforeEach(() => vi.resetAllMocks());

  it('listarSimulados: retorna do cache quando disponível e sem filtro status', async () => {
    const repo = createRepoStub();
    const cache = createCacheStub();
    const log = createLogStub();
    const supabase = createSupabaseStub();

    const cached = { items: [{ id: '1', titulo: 't', slug: 's' }], total: 1, page: 1, limit: 10 } as any;
    (cache.obter as any).mockResolvedValueOnce(cached);

    const svc = new SimuladosService(supabase, repo as any, cache as any, log as any);
    const res = await svc.listarSimulados({ page: 1, limit: 10, concurso_id: 'c1' });
    expect(res).toBe(cached);
    expect(repo.listarSimulados).not.toHaveBeenCalled();
  });

  it('buscarDetalhePorSlug: lança 404 quando repo retorna null; e cacheia quando encontra', async () => {
    const repo = createRepoStub();
    const cache = createCacheStub();
    const log = createLogStub();
    const supabase = createSupabaseStub();
    const svc = new SimuladosService(supabase, repo as any, cache as any, log as any);

    (repo.buscarPorSlug as any).mockResolvedValueOnce(null);
    await expect(svc.buscarDetalhePorSlug('inexistente')).rejects.toThrow(/Simulado não encontrado/);

    (repo.buscarPorSlug as any).mockResolvedValueOnce({ id: '1', slug: 'ok' });
    const result = await svc.buscarDetalhePorSlug('ok');
    expect(result).toEqual({ id: '1', slug: 'ok' });
    expect(cache.definir).toHaveBeenCalled();
  });

  it('listarQuestoesPorSimuladoId: usa cache quando disponível', async () => {
    const repo = createRepoStub();
    const cache = createCacheStub();
    const log = createLogStub();
    const supabase = createSupabaseStub();
    const svc = new SimuladosService(supabase, repo as any, cache as any, log as any);

    (cache.obter as any).mockResolvedValueOnce([{ id: 'q1' }]);
    const res = await svc.listarQuestoesPorSimuladoId('s1');
    expect(res).toEqual([{ id: 'q1' }]);
    expect(repo.listarQuestoesPorSimuladoId).not.toHaveBeenCalled();
  });
});


