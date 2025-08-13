import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseSimuladosRepository } from '../../../../backend/src/modules/simulados/repositories/simulados.repository.ts';
import { SimuladosService } from '../../../../backend/src/modules/simulados/services/simulados.service.ts';

type Builder = ReturnType<typeof createQueryBuilder>;

function createQueryBuilder(table: string) {
  const state: any = { table, filters: {} };
  const api = {
    select: vi.fn((cols?: string, opts?: any) => {
      state.select = cols;
      state.opts = opts;
      return api;
    }),
    eq: vi.fn((col: string, val: any) => {
      state.filters[col] = val;
      return api;
    }),
    in: vi.fn((col: string, vals: any[]) => {
      state.filters[col] = vals;
      return api;
    }),
    not: vi.fn((col: string, op: string, expr: string) => {
      state.filters[`not:${col}:${op}`] = expr;
      return api;
    }),
    or: vi.fn((expr: string) => {
      state.or = expr;
      return api;
    }),
    order: vi.fn((col: string, opts?: any) => {
      state.order = { col, opts };
      return api;
    }),
    range: vi.fn(async (from: number, to: number) => {
      if (state.table === 'simulados') {
        const data = [
          {
            id: 's1', titulo: 'T', slug: 'a', descricao: null,
            concurso_id: 'c1', categoria_id: null, numero_questoes: 10, tempo_minutos: 60,
            dificuldade: 'medio', disciplinas: null, publico: true, ativo: true, atualizado_em: '2024-01-01T00:00:00.000Z',
          },
        ];
        return { data, error: null, count: data.length } as any;
      }
      return { data: [], error: null, count: 0 } as any;
    }),
    limit: vi.fn((n: number) => api),
    single: vi.fn(async () => {
      if (state.table === 'simulados') {
        if (state.filters.slug) {
          return {
            data: {
              id: 's1', titulo: 'T', slug: String(state.filters.slug), descricao: null,
              concurso_id: 'c1', categoria_id: null, numero_questoes: 10, tempo_minutos: 60,
              dificuldade: 'medio', disciplinas: null, publico: true, ativo: true,
              criado_por: 'u1', criado_em: '2024-01-01T00:00:00.000Z', atualizado_em: '2024-01-01T00:00:00.000Z',
              meta_revision: 1, questoes_revision: 2, questoes_atualizado_em: '2024-01-01T00:00:00.000Z',
            },
            error: null,
          } as any;
        }
        if (state.select?.includes('id') && state.filters.slug) {
          return { data: { id: 's1' }, error: null } as any;
        }
      }
      return { data: null, error: { code: 'PGRST116' } } as any;
    }),
  };
  return api;
}

function createSupabaseStub(): SupabaseClient & { _calls: any[] } {
  const calls: any[] = [];
  const supabase = {
    from: vi.fn((table: string) => {
      calls.push({ method: 'from', table });
      if (table === 'questoes_simulado') {
        const qb = createQueryBuilder(table) as any;
        qb.select.mockImplementation((cols?: string) => {
          qb._selected = cols;
          return qb;
        });
        qb.eq.mockImplementation((col: string, val: any) => {
          qb._filters = { ...(qb._filters ?? {}), [col]: val };
          return qb;
        });
        qb.order.mockImplementation(() => qb);
        qb.then = vi.fn();
        qb[Symbol.asyncIterator] = undefined as any;
        qb.data = null;
        qb.exec = vi.fn();
        qb.range = undefined as any;
        qb.single = undefined as any;
        qb.limit = undefined as any;
        qb.or = undefined as any;
        qb.not = undefined as any;
        qb.in = undefined as any;
        qb.fetch = vi.fn();
        qb.select = qb.select;
        qb.eq = qb.eq;
        qb.order = qb.order;
        qb.then = qb.then;
        qb["_return"] = async () => ({
          data: [
            {
              id: 'q1', simulado_id: qb._filters?.simulado_id ?? 's1', numero_questao: 1, enunciado: 'E1', alternativas: { a: 'A' }, resposta_correta: 'a',
              explicacao: null, disciplina: null, assunto: null, dificuldade: 'medio', peso_disciplina: null, ordem: 1, ativo: true,
              criado_em: '2024-01-01T00:00:00.000Z', atualizado_em: '2024-01-01T00:00:00.000Z',
            },
          ],
          error: null,
        });
        qb.order.mockImplementation(async () => qb);
        qb.eq.mockImplementation(async () => qb);
        return new Proxy(qb, {
          get(target, prop: string) {
            if (prop === Symbol.toStringTag) return 'QueryBuilder';
            if (prop === 'then') {
              return (cb: any) => qb["_return"]().then(cb);
            }
            return (target as any)[prop];
          },
          apply() { return qb; },
        });
      }
      return createQueryBuilder(table) as any;
    }),
    _calls: calls,
  } as unknown as SupabaseClient & { _calls: any[] };
  return supabase;
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

describe('SimuladosService + Repository (integração com Supabase stub)', () => {
  beforeEach(() => vi.resetAllMocks());

  it('listarSimulados retorna página com itens e total', async () => {
    const supabase = createSupabaseStub();
    const repo = new SupabaseSimuladosRepository(supabase as unknown as SupabaseClient);
    const cache = createCacheStub();
    const log = createLogStub();
    const svc = new SimuladosService(supabase as unknown as SupabaseClient, repo, cache as any, log as any);

    const res = await svc.listarSimulados({ page: 1, limit: 10, concurso_id: 'c1' });
    expect(res.items.length).toBe(1);
    expect(res.total).toBe(1);
    expect(res.items[0].slug).toBe('a');
  });

  it('buscarDetalhePorSlug retorna simulado com revisões usadas para ETag e é cacheado', async () => {
    const supabase = createSupabaseStub();
    const repo = new SupabaseSimuladosRepository(supabase as unknown as SupabaseClient);
    const cache = createCacheStub();
    const log = createLogStub();
    const svc = new SimuladosService(supabase as unknown as SupabaseClient, repo, cache as any, log as any);

    const res = await svc.buscarDetalhePorSlug('a');
    expect(res.slug).toBe('a');
    // Segunda chamada deve vir do cache
    const res2 = await svc.buscarDetalhePorSlug('a');
    expect(res2.slug).toBe('a');
    expect((cache.definir as any).mock.calls.length).toBeGreaterThan(0);
  });

  it('listarQuestoesPorSimuladoId retorna questões ordenadas', async () => {
    const supabase = createSupabaseStub();
    const repo = new SupabaseSimuladosRepository(supabase as unknown as SupabaseClient);
    const cache = createCacheStub();
    const log = createLogStub();
    const svc = new SimuladosService(supabase as unknown as SupabaseClient, repo, cache as any, log as any);

    const qs = await svc.listarQuestoesPorSimuladoId('s1');
    expect(qs.length).toBeGreaterThanOrEqual(1);
    expect(qs[0].numero_questao).toBe(1);
  });
});


