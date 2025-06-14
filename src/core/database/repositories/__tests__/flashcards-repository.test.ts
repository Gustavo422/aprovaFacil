import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlashcardsRepository } from '../flashcards-repository';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
};

describe('FlashcardsRepository', () => {
  let repo: FlashcardsRepository;

  beforeEach(() => {
    repo = new FlashcardsRepository(mockSupabase as unknown as SupabaseClient<Database>);
    vi.clearAllMocks();
  });

  it('should instantiate', () => {
    expect(repo).toBeDefined();
  });

  it('should call findByConcurso without error', async () => {
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.order.mockReturnThis();
    mockSupabase.limit.mockReturnThis();
    mockSupabase.from.mockReturnThis();
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({
              data: [],
              error: null,
            }),
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
        data: [],
        error: null,
      }),
    });
    const result = await repo.findByConcurso('test-concurso-id', 5);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should call findByFilters without error', async () => {
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.order.mockReturnThis();
    mockSupabase.limit.mockReturnThis();
    mockSupabase.from.mockReturnThis();
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({
              data: [],
              error: null,
            }),
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
        data: [],
        error: null,
      }),
    });
    const result = await repo.findByFilters({ concurso_id: 'test' }, 5);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should call saveUserProgress (new progress)', async () => {
    // Simula não existir progresso anterior
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.single.mockReturnValue({ data: undefined });
    mockSupabase.insert.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.single.mockReturnValueOnce({ data: undefined }).mockReturnValueOnce({ data: { id: '1', acertou: true } });
    const result = await repo.saveUserProgress({ user_id: '11111111-1111-1111-1111-111111111111', flashcard_id: '22222222-2222-2222-2222-222222222222', acertou: true, tentativas: 1 });
    expect(result).toHaveProperty('acertou');
  });

  it('should call saveUserProgress (existing progress)', async () => {
    // Simula progresso existente
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.single.mockReturnValueOnce({ data: { id: '1', tentativas: 1 } }).mockReturnValueOnce({ data: { id: '1', acertou: false } });
    mockSupabase.update.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.single.mockReturnValue({ data: { id: '1', acertou: false } });
    const result = await repo.saveUserProgress({ user_id: '11111111-1111-1111-1111-111111111111', flashcard_id: '22222222-2222-2222-2222-222222222222', acertou: false, tentativas: 2 });
    expect(result).toHaveProperty('acertou');
  });

  it('should call getUserProgress without error', async () => {
    // Corrigir mock para encadeamento eq
    const eqMock = vi.fn().mockReturnThis();
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: eqMock,
        data: [],
        error: null,
      }),
    });
    eqMock.mockReturnValue({
      eq: eqMock,
      data: [],
      error: null,
    });
    const result = await repo.getUserProgress('u1', 'f1');
    expect(Array.isArray(result)).toBe(true);
  });
}); 