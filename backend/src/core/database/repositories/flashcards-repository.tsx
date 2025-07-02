import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { BaseRepository } from '../base-repository';
import {
  FlashcardData,
  FlashcardProgressData,
  FlashcardFilters,
  FlashcardInsert,
  FlashcardUpdate,
} from '../types';
import {
  flashcardInsertSchema,
  flashcardUpdateSchema,
  userFlashcardProgressInsertSchema,
  validateData
} from '../validation/schemas';
import { flashcardsCache, userProgressCache, createCacheKey, withCache } from '../../utils/cache';
// import { logger } from '../../utils/logger';

export class FlashcardsRepository extends BaseRepository<FlashcardData, FlashcardInsert, FlashcardUpdate> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'flashcards');
  }

  /**
   * Busca flashcards por concurso
   */
  async findByConcurso(concursoId: string, limit?: number): Promise<FlashcardData[]> {
    const cacheKey = createCacheKey('flashcards:by-concurso', concursoId, limit || 'all');
    return withCache(flashcardsCache, cacheKey, async () => {
      try {
        let query = this.supabase
          .from(this.tableName)
          .select('*')
          .eq('concurso_id', concursoId)
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data || [];
      } catch (error) {
        throw new Error(`Erro ao buscar flashcards por concurso: ${error}`);
      }
    });
  }

  /**
   * Busca flashcards aleatórios por concurso
   */
  async findRandomByConcurso(concursoId: string, limit: number = 10): Promise<FlashcardData[]> {
    const cacheKey = createCacheKey('flashcards:random', concursoId, limit);
    return withCache(flashcardsCache, cacheKey, async () => {
      try {
        const { data, error } = await this.supabase
          .from(this.tableName)
          .select('*')
          .eq('concurso_id', concursoId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        // Embaralhar os resultados (Supabase não tem ORDER BY RANDOM() nativo)
        const shuffled = (data || []).sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
      } catch (error) {
        throw new Error(`Erro ao buscar flashcards aleatórios: ${error}`);
      }
    });
  }

  /**
   * Busca flashcards com filtros avançados
   */
  async findByFilters(filters: FlashcardFilters, limit?: number): Promise<FlashcardData[]> {
    const cacheKey = createCacheKey('flashcards:filters', JSON.stringify(filters), limit || 'all');
    return withCache(flashcardsCache, cacheKey, async () => {
      try {
        let query = this.supabase.from(this.tableName).select('*');

        if (filters.concurso_id) {
          query = query.eq('concurso_id', filters.concurso_id);
        }

        if (filters.materia) {
          query = query.eq('materia', filters.materia);
        }

        if (filters.assunto) {
          query = query.eq('assunto', filters.assunto);
        }

        if (filters.nivel_dificuldade) {
          query = query.eq('nivel_dificuldade', filters.nivel_dificuldade);
        }

        query = query.order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data || [];
      } catch (error) {
        throw new Error(`Erro ao buscar flashcards com filtros: ${error}`);
      }
    });
  }

  /**
   * Cria um novo flashcard
   */
  async create(data: FlashcardInsert): Promise<FlashcardData> {
    try {
      // Validação Zod
      const validatedData = validateData(flashcardInsertSchema, data);
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .insert(validatedData)
        .select()
        .single();
      if (error) throw error;
      this.invalidateCache();
      return result;
    } catch (error) {
      throw new Error(`Erro ao criar flashcard: ${error}`);
    }
  }

  /**
   * Atualiza um flashcard
   */
  async update(id: string, data: FlashcardUpdate): Promise<FlashcardData> {
    try {
      // Validação Zod
      const validatedData = validateData(flashcardUpdateSchema, data);
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .update(validatedData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      this.invalidateCache(id);
      return result;
    } catch (error) {
      throw new Error(`Erro ao atualizar flashcard: ${error}`);
    }
  }

  /**
   * Salva o progresso do usuário em um flashcard
   */
  async saveUserProgress(progress: Omit<FlashcardProgressData, 'id' | 'created_at' | 'updated_at'>): Promise<FlashcardProgressData> {
    try {
      // Validação Zod
      const validatedProgress = validateData(userFlashcardProgressInsertSchema, progress);
      // Verificar se já existe progresso para este flashcard
      const { data: existing } = await this.supabase
        .from('flashcard_progress')
        .select('*')
        .eq('user_id', validatedProgress.user_id)
        .eq('flashcard_id', validatedProgress.flashcard_id)
        .single();

      if (existing) {
        // Atualizar progresso existente
        const { data, error } = await this.supabase
          .from('flashcard_progress')
          .update({
            acertou: validatedProgress.acertou,
            tempo_resposta: validatedProgress.tempo_resposta,
            tentativas: (existing.tentativas || 0) + 1,
            ultima_revisao: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        userProgressCache.delete(createCacheKey('user-flashcard-progress', validatedProgress.user_id));
        return data;
      } else {
        // Criar novo progresso
        const { data, error } = await this.supabase
          .from('flashcard_progress')
          .insert({
            ...validatedProgress,
            tentativas: validatedProgress.tentativas || 1,
            ultima_revisao: new Date().toISOString()
          })
          .select()
          .single();
        if (error) throw error;
        userProgressCache.delete(createCacheKey('user-flashcard-progress', validatedProgress.user_id));
        return data;
      }
    } catch (error) {
      throw new Error(`Erro ao salvar progresso do flashcard: ${error}`);
    }
  }

  /**
   * Busca o progresso do usuário em flashcards
   */
  async getUserProgress(userId: string, flashcardId?: string): Promise<FlashcardProgressData[]> {
    const cacheKey = createCacheKey('user-flashcard-progress', userId, flashcardId || 'all');
    return withCache(userProgressCache, cacheKey, async () => {
      try {
        let query = this.supabase
          .from('flashcard_progress')
          .select('*')
          .eq('user_id', userId);
        if (flashcardId) {
          query = query.eq('flashcard_id', flashcardId);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } catch (error) {
        throw new Error(`Erro ao buscar progresso do usuário: ${error}`);
      }
    });
  }

  /**
   * Busca estatísticas do usuário
   */
  async getUserStats(userId: string): Promise<{
    total_flashcards: number;
    flashcards_estudados: number;
    acertos: number;
    erros: number;
    taxa_acerto: number;
  }> {
    const cacheKey = createCacheKey('user-flashcard-stats', userId);
    return withCache(userProgressCache, cacheKey, async () => {
      try {
        const progress = await this.getUserProgress(userId);
        const total_flashcards = progress.length;
        const flashcards_estudados = progress.filter(p => p.ultima_revisao).length;
        const acertos = progress.filter(p => p.acertou).length;
        const erros = total_flashcards - acertos;
        const taxa_acerto = total_flashcards > 0 ? (acertos / total_flashcards) * 100 : 0;
        return {
          total_flashcards,
          flashcards_estudados,
          acertos,
          erros,
          taxa_acerto
        };
      } catch (error) {
        throw new Error(`Erro ao buscar estatísticas do usuário: ${error}`);
      }
    });
  }

  /**
   * Busca flashcards que precisam de revisão para um usuário
   */
  async findForReview(userId: string, limit: number = 20): Promise<FlashcardData[]> {
    // Busca progresso do usuário
    const progress = await this.getUserProgress(userId);
    const now = new Date();
    // Filtra os que precisam de revisão
    const needsReview = progress.filter((p: any) => {
      if (!p.proxima_revisao) return true;
      return new Date(p.proxima_revisao) <= now;
    });
    // Busca os flashcards correspondentes
    const flashcardIds = needsReview.map((p: any) => p.flashcard_id).slice(0, limit);
    if (flashcardIds.length === 0) return [];
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .in('id', flashcardIds);
    if (error) throw error;
    return data || [];
  }

  /**
   * Invalida cache relacionado aos flashcards
   */
  private invalidateCache(flashcardId?: string): void {
    flashcardsCache.clear();
    if (flashcardId) {
      flashcardsCache.delete(createCacheKey('flashcards:by-concurso', flashcardId));
      flashcardsCache.delete(createCacheKey('flashcards:random', flashcardId));
    }
  }
} 