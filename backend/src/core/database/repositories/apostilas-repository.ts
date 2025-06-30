import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { BaseRepository } from '../base-repository';
import {
  Apostila,
  ApostilaInsert,
  ApostilaUpdate,
  ApostilaContent,
  // ApostilaContentInsert,
  ApostilaContentUpdate,
  UserApostilaProgress,
  UserApostilaProgressInsert,
  ApostilaWithContent,
  // ApostilaContentWithProgress,
} from '../types';
import {
  apostilaInsertSchema,
  // apostilaUpdateSchema,
  apostilaContentInsertSchema,
  apostilaContentUpdateSchema,
  userApostilaProgressInsertSchema,
  validateData
} from '../validation/schemas';
import { apostilasCache, userProgressCache, createCacheKey, withCache } from '../../utils/cache';
// import { logger } from '../../utils/logger';

export class ApostilasRepository extends BaseRepository<Apostila, ApostilaInsert, ApostilaUpdate> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'apostilas');
  }

  /**
   * Busca apostilas com conteúdo
   */
  async findAllWithContent(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, unknown>
  ) {
    const cacheKey = createCacheKey('apostilas:all', page.toString(), limit.toString(), JSON.stringify(filters || {}));
    return withCache(apostilasCache, cacheKey, async () => {
      try {
        let query = this.supabase
          .from(this.tableName)
          .select(`
            *,
            apostila_content (
              id,
              module_number,
              title,
              content_json,
              created_at
            )
          `, { count: 'exact' });

        // Aplicar filtros
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          });
        }

        const { data, error, count } = await query
          .range((page - 1) * limit, page * limit - 1)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return {
          data: data as ApostilaWithContent[] || [],
          count: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        };
      } catch (error) {
        throw new Error(`Erro ao buscar apostilas com conteúdo: ${error}`);
      }
    });
  }

  /**
   * Busca uma apostila com todo seu conteúdo
   */
  async findByIdWithContent(id: string): Promise<ApostilaWithContent | null> {
    const cacheKey = createCacheKey('apostilas:with-content', id);
    return withCache(apostilasCache, cacheKey, async () => {
      try {
        const { data, error } = await this.supabase
          .from(this.tableName)
          .select(`
            *,
            apostila_content (
              id,
              module_number,
              title,
              content_json,
              created_at
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null; // Not found
          throw error;
        }

        return data as ApostilaWithContent;
      } catch (error) {
        throw new Error(`Erro ao buscar apostila com conteúdo: ${error}`);
      }
    });
  }

  /**
   * Busca apostilas por concurso
   */
  async findByConcurso(concursoId: string): Promise<ApostilaWithContent[]> {
    const cacheKey = createCacheKey('apostilas:by-concurso', concursoId);
    return withCache(apostilasCache, cacheKey, async () => {
      try {
        const { data, error } = await this.supabase
          .from(this.tableName)
          .select(`
            *,
            apostila_content (
              id,
              module_number,
              title,
              content_json,
              created_at
            )
          `)
          .eq('concurso_id', concursoId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return data as ApostilaWithContent[] || [];
      } catch (error) {
        throw new Error(`Erro ao buscar apostilas por concurso: ${error}`);
      }
    });
  }

  /**
   * Cria uma apostila com conteúdo
   */
  async createWithContent(
    apostila: ApostilaInsert,
    content: Omit<ApostilaContent, 'id' | 'apostila_id' | 'created_at'>[]
  ): Promise<ApostilaWithContent> {
    try {
      // Validação Zod
      const validatedApostila = validateData(apostilaInsertSchema, apostila);
      const validatedContent = content.map(c => validateData(apostilaContentInsertSchema, { ...c, apostila_id: 'temp' }));

      // Criar apostila
      const { data: apostilaData, error: apostilaError } = await this.supabase
        .from(this.tableName)
        .insert(validatedApostila)
        .select()
        .single();

      if (apostilaError) throw apostilaError;

      // Adicionar conteúdo
      const contentWithApostilaId = validatedContent.map(c => ({
        ...c,
        apostila_id: apostilaData.id,
      }));

      const { data: contentData, error: contentError } = await this.supabase
        .from('apostila_content')
        .insert(contentWithApostilaId)
        .select();

      if (contentError) throw contentError;

      // Invalidar cache relacionado
      this.invalidateCache(apostilaData.id);

      return {
        ...apostilaData,
        apostila_content: contentData || [],
      };
    } catch (error) {
      throw new Error(`Erro ao criar apostila com conteúdo: ${error}`);
    }
  }

  /**
   * Adiciona conteúdo a uma apostila existente
   */
  async addContent(apostilaId: string, content: Omit<ApostilaContent, 'id' | 'apostila_id' | 'created_at'>): Promise<ApostilaContent> {
    try {
      // Validação Zod
      const validatedContent = validateData(apostilaContentInsertSchema, { ...content, apostila_id: apostilaId });
      const { data, error } = await this.supabase
        .from('apostila_content')
        .insert(validatedContent)
        .select()
        .single();

      if (error) throw error;

      // Invalidar cache relacionado
      this.invalidateCache(apostilaId);

      return data;
    } catch (error) {
      throw new Error(`Erro ao adicionar conteúdo à apostila: ${error}`);
    }
  }

  /**
   * Atualiza conteúdo de uma apostila
   */
  async updateContent(contentId: string, content: ApostilaContentUpdate): Promise<ApostilaContent> {
    try {
      // Validação Zod
      const validatedContent = validateData(apostilaContentUpdateSchema, content);
      const { data, error } = await this.supabase
        .from('apostila_content')
        .update(validatedContent)
        .eq('id', contentId)
        .select()
        .single();

      if (error) throw error;

      // Invalidar cache relacionado
      this.invalidateCache();

      return data;
    } catch (error) {
      throw new Error(`Erro ao atualizar conteúdo da apostila: ${error}`);
    }
  }

  /**
   * Remove conteúdo de uma apostila
   */
  async removeContent(contentId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('apostila_content')
        .delete()
        .eq('id', contentId);
      if (error) throw error;
      // Invalidar cache relacionado
      this.invalidateCache();
    } catch (error) {
      throw new Error(`Erro ao remover conteúdo da apostila: ${error}`);
    }
  }

  /**
   * Salva o progresso do usuário em uma apostila
   */
  async saveUserProgress(progress: UserApostilaProgressInsert): Promise<UserApostilaProgress> {
    try {
      // Validação Zod
      const validatedProgress = validateData(userApostilaProgressInsertSchema, progress);
      const { data, error } = await this.supabase
        .from('user_apostila_progress')
        .insert(validatedProgress)
        .select()
        .single();
      if (error) throw error;
      // Invalidar cache de progresso do usuário
      userProgressCache.delete(createCacheKey('user-apostila-progress', progress.user_id));
      return data;
    } catch (error) {
      throw new Error(`Erro ao salvar progresso da apostila: ${error}`);
    }
  }

  /**
   * Busca progresso do usuário em apostilas
   */
  async getUserProgress(userId: string, apostilaId?: string): Promise<UserApostilaProgress[]> {
    const cacheKey = createCacheKey('user-apostila-progress', userId, apostilaId || 'all');
    return withCache(userProgressCache, cacheKey, async () => {
      try {
        let query = this.supabase
          .from('user_apostila_progress')
          .select('*')
          .eq('user_id', userId);
        if (apostilaId) {
          query = query.eq('apostila_content_id', apostilaId);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } catch (error) {
        throw new Error(`Erro ao buscar progresso do usuário em apostilas: ${error}`);
      }
    });
  }

  /**
   * Busca estatísticas de apostilas do usuário
   */
  async getUserStats(userId: string) {
    const cacheKey = createCacheKey('user-apostila-stats', userId);
    return withCache(userProgressCache, cacheKey, async () => {
      try {
        const { data, error } = await this.supabase
          .rpc('apostila_user_stats', { user_id: userId });
        if (error) throw error;
        return data?.[0] || {
          total_apostilas: 0,
          apostilas_iniciadas: 0,
          apostilas_completadas: 0,
          progresso_medio: 0,
        };
      } catch (error) {
        throw new Error(`Erro ao buscar estatísticas do usuário: ${error}`);
      }
    });
  }

  /**
   * Invalida cache relacionado às apostilas
   */
  private invalidateCache(apostilaId?: string): void {
    apostilasCache.clear();
    if (apostilaId) {
      apostilasCache.delete(createCacheKey('apostilas:with-content', apostilaId));
    }
  }
} 