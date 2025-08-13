import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseSimuladosRepository } from '../../../../backend/src/modules/simulados/repositories/simulados.repository.ts';

function createSupabaseStub() {
  const calls: Record<string, unknown[]> = {};

  const record = (name: string) =>
    (...args: unknown[]) => {
      calls[name] = calls[name] ?? [];
      calls[name].push(args);
      return queryBuilder;
    };

  const range = vi.fn().mockResolvedValue({ data: [], error: null, count: 0 });
  const single = vi.fn().mockResolvedValue({ data: null, error: null });
  const order = record('order');
  const select = ((...args: unknown[]) => {
    calls.select = calls.select ?? [];
    calls.select.push(args);
    return queryBuilder;
  }) as unknown as (...args: unknown[]) => unknown;
  const eq = record('eq');
  const inOp = record('in');
  const or = record('or');
  const not = record('not');
  const limit = record('limit');

  const queryBuilder: any = { select, eq, in: inOp, or, not, range, order, single, limit };

  const from = vi.fn(() => queryBuilder);

  const supabase = { from } as unknown as any;

  return { supabase, calls, range, single };
}

describe('SupabaseSimuladosRepository', () => {
  beforeEach(() => vi.resetAllMocks());

  it('listarSimulados deve usar seleção explícita de colunas e aplicar filtros', async () => {
    const { supabase, calls, range } = createSupabaseStub();
    const repo = new SupabaseSimuladosRepository(supabase);

    await repo.listarSimulados({
      page: 1,
      limit: 10,
      concurso_id: 'c1',
      dificuldade: 'medio',
      publico: true,
      search: 'abc',
      ids: ['id1', 'id2'],
      exclude_ids: ['id3'],
    });

    // select com colunas explícitas e count
    expect(calls.select?.[0]?.[0]).toContain('id');
    expect(calls.select?.[0]?.[0]).toContain('titulo');
    expect(calls.select?.[0]?.[0]).toContain('slug');
    expect(String(calls.select?.[0]?.[0])).not.toContain('*');
    expect(calls.select?.[0]?.[1]).toEqual({ count: 'exact' });

    // filtros aplicados
    expect(calls.eq?.some((args) => args[0] === 'concurso_id' && args[1] === 'c1')).toBe(true);
    expect(calls.eq?.some((args) => args[0] === 'dificuldade' && args[1] === 'medio')).toBe(true);
    expect(calls.eq?.some((args) => args[0] === 'publico' && args[1] === true)).toBe(true);

    // busca simples
    expect(calls.or?.length ?? 0).toBeGreaterThan(0);
    const likeArg = String(calls.or?.[0]?.[0] ?? '');
    expect(likeArg).toContain('titulo.ilike.%abc%');
    expect(likeArg).toContain('descricao.ilike.%abc%');

    // ids e exclude_ids
    expect(calls.in?.some((args) => args[0] === 'id' && Array.isArray(args[1]))).toBe(true);
    expect(calls.not?.some((args) => args[0] === 'id' && args[1] === 'in')).toBe(true);

    // paginação via range()
    expect(range).toHaveBeenCalledWith(0, 9);
  });

  it('buscarPorSlug deve selecionar colunas explícitas e retornar null quando não encontrado', async () => {
    const { supabase, calls, single } = createSupabaseStub();
    single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    const repo = new SupabaseSimuladosRepository(supabase);

    const result = await repo.buscarPorSlug('slug-teste');
    expect(result).toBeNull();
    expect(calls.select?.[0]?.[0]).toContain('id');
    expect(String(calls.select?.[0]?.[0])).not.toContain('*');
    expect(calls.eq?.some((args) => args[0] === 'slug' && args[1] === 'slug-teste')).toBe(true);
  });

  it('listarQuestoesPorSimuladoId deve selecionar colunas explícitas, filtrar por simulado_id e ordenar por ordem asc', async () => {
    const { supabase, calls, range } = createSupabaseStub();
    // range não é usado aqui; garantir que order foi chamado
    const repo = new SupabaseSimuladosRepository(supabase);

    await repo.listarQuestoesPorSimuladoId('sim-1');

    expect(calls.select?.[0]?.[0]).toContain('numero_questao');
    expect(String(calls.select?.[0]?.[0])).not.toContain('*');
    expect(calls.eq?.some((args) => args[0] === 'simulado_id' && args[1] === 'sim-1')).toBe(true);
    expect(calls.order?.some((args) => args[0] === 'ordem' && (args[1] as any)?.ascending === true)).toBe(true);
  });
});


