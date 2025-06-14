import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SimuladosRepository } from '../simulados-repository';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  range: vi.fn().mockImplementation(function (this: unknown) {
    // Simula encadeamento: range().order()
    return this;
  }),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  count: 1,
  data: [],
  error: null,
};

describe('SimuladosRepository', () => {
  let repo: SimuladosRepository;

  beforeEach(() => {
    repo = new SimuladosRepository(mockSupabase as unknown as SupabaseClient<Database>);
  });

  it('should instantiate', () => {
    expect(repo).toBeDefined();
  });

  it('should call findAllWithConcurso without error', async () => {
    mockSupabase.select.mockReturnThis();
    mockSupabase.is.mockReturnThis();
    mockSupabase.range.mockImplementation(function (this: unknown) {
      return this;
    });
    mockSupabase.order.mockReturnValue({
      data: [],
      error: null,
      count: 0,
    });
    const result = await repo.findAllWithConcurso(1, 10);
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('count');
  });
}); 