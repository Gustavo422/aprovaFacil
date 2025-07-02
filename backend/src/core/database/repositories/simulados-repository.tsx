import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { BaseRepository } from '../base-repository';
import {
  Simulado,
  SimuladoInsert,
  SimuladoUpdate,
  SimuladoWithConcurso,
  SimuladoWithQuestions,
  SimuladoQuestion,
  UserSimuladoProgress,
  UserSimuladoProgressInsert,
} from '../types';
import { 
  simuladoInsertSchema, 
  simuladoUpdateSchema, 
  simuladoQuestionInsertSchema,
  userSimuladoProgressInsertSchema,
  validateData 
} from '../validation/schemas';
import { logger } from '../../utils/logger';
import { simuladosCache, userProgressCache, createCacheKey, withCache } from '../../utils/cache';

export class SimuladosRepository extends BaseRepository<Simulado, SimuladoInsert, SimuladoUpdate> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'simulados');
  }

  /**
   * Busca simulados com informações do concurso
   */
  async findAllWithConcurso(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, unknown>
  ) {
    const cacheKey = createCacheKey('simulados:all', page.toString(), limit.toString(), JSON.stringify(filters || {}));
    
    return withCache(simuladosCache, cacheKey, async () => {
      const start = Date.now();
      try {
        let query = this.supabase
          .from(this.tableName)
          .select(`
            *,
            concursos (
              id,
              nome,
              categoria,
              ano,
              banca
            )
          `, { count: 'exact' })
          .is('deleted_at', null);

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

        const _duration = Date.now() - start;
        logger.dbQuery('findAllWithConcurso', this.tableName, _duration, {
          page,
          limit,
          filters,
          resultCount: data?.length || 0,
        });

        return {
          data: data as SimuladoWithConcurso[] || [],
          count: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        };
      } catch (error) {
        const _duration = Date.now() - start;
        logger.dbError('findAllWithConcurso', this.tableName, error as Error, {
          page,
          limit,
          filters,
        });
        throw new Error(`Erro ao buscar simulados com concurso: ${error}`);
      }
    });
  }

  /**
   * Busca um simulado com suas questões
   */
  async findByIdWithQuestions(id: string): Promise<SimuladoWithQuestions | null> {
    const cacheKey = createCacheKey('simulados:with-questions', id);
    
    return withCache(simuladosCache, cacheKey, async () => {
      const start = Date.now();
      try {
        const { data, error } = await this.supabase
          .from(this.tableName)
          .select(`
            *,
            simulado_questions (
              id,
              question_number,
              question_text,
              alternatives,
              correct_answer,
              explanation,
              discipline,
              topic,
              difficulty
            ),
            concursos (
              id,
              nome,
              categoria,
              ano,
              banca
            )
          `)
          .eq('id', id)
          .is('deleted_at', null)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null; // Not found
          throw error;
        }

        const _duration = Date.now() - start;
        logger.dbQuery('findByIdWithQuestions', this.tableName, _duration, {
          simuladoId: id,
          hasQuestions: data?.simulado_questions?.length > 0,
        });

        return data as SimuladoWithQuestions;
      } catch (error) {
        const _duration = Date.now() - start;
        logger.dbError('findByIdWithQuestions', this.tableName, error as Error, {
          simuladoId: id,
        });
        throw new Error(`Erro ao buscar simulado com questões: ${error}`);
      }
    });
  }

  /**
   * Busca simulados por concurso
   */
  async findByConcurso(concursoId: string): Promise<SimuladoWithConcurso[]> {
    const cacheKey = createCacheKey('simulados:by-concurso', concursoId);
    
    return withCache(simuladosCache, cacheKey, async () => {
      const start = Date.now();
      try {
        const { data, error } = await this.supabase
          .from(this.tableName)
          .select(`
            *,
            concursos (
              id,
              nome,
              categoria,
              ano,
              banca
            )
          `)
          .eq('concurso_id', concursoId)
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const _duration = Date.now() - start;
        logger.dbQuery('findByConcurso', this.tableName, _duration, {
          concursoId,
          resultCount: data?.length || 0,
        });

        return data as SimuladoWithConcurso[] || [];
      } catch (error) {
        const _duration = Date.now() - start;
        logger.dbError('findByConcurso', this.tableName, error as Error, {
          concursoId,
        });
        throw new Error(`Erro ao buscar simulados por concurso: ${error}`);
      }
    });
  }

  /**
   * Busca simulados públicos
   */
  async findPublicSimulados(
    page: number = 1,
    limit: number = 10
  ) {
    return this.findAllWithConcurso(page, limit, { is_public: true });
  }

  /**
   * Cria um novo simulado com validação
   */
  async create(data: SimuladoInsert): Promise<Simulado> {
    const start = Date.now();
    try {
      // Validar dados de entrada
      const validatedData = validateData(simuladoInsertSchema, data);
      
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .insert(validatedData)
        .select()
        .single();

      if (error) throw error;

      const _duration = Date.now() - start;
      logger.dbQuery('create', this.tableName, _duration, {
        simuladoId: result.id,
        title: result.title,
      });

      // Invalidar cache relacionado
      this.invalidateCache();

      return result;
    } catch (error) {
      const _duration = Date.now() - start;
      logger.dbError('create', this.tableName, error as Error, {
        title: data.title,
      });
      throw new Error(`Erro ao criar simulado: ${error}`);
    }
  }

  /**
   * Atualiza um simulado com validação
   */
  async update(id: string, data: SimuladoUpdate): Promise<Simulado> {
    const start = Date.now();
    try {
      // Validar dados de entrada
      const validatedData = validateData(simuladoUpdateSchema, data);
      
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .update(validatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const _duration = Date.now() - start;
      logger.dbQuery('update', this.tableName, _duration, {
        simuladoId: id,
        updatedFields: Object.keys(validatedData),
      });

      // Invalidar cache relacionado
      this.invalidateCache(id);

      return result;
    } catch (error) {
      const _duration = Date.now() - start;
      logger.dbError('update', this.tableName, error as Error, {
        simuladoId: id,
      });
      throw new Error(`Erro ao atualizar simulado: ${error}`);
    }
  }

  /**
   * Salva o progresso do usuário em um simulado com validação
   */
  async saveUserProgress(progress: UserSimuladoProgressInsert): Promise<UserSimuladoProgress> {
    const start = Date.now();
    try {
      // Validar dados de entrada
      const validatedProgress = validateData(userSimuladoProgressInsertSchema, progress);
      
      const { data, error } = await this.supabase
        .from('user_simulado_progress')
        .insert(validatedProgress)
        .select()
        .single();

      if (error) throw error;

      const _duration = Date.now() - start;
      logger.dbQuery('saveUserProgress', 'user_simulado_progress', _duration, {
        userId: progress.user_id,
        simuladoId: progress.simulado_id,
        score: progress.score,
      });

      // Invalidar cache de progresso do usuário
      userProgressCache.delete(createCacheKey('user-progress', progress.user_id));

      return data;
    } catch (error) {
      const _duration = Date.now() - start;
      logger.dbError('saveUserProgress', 'user_simulado_progress', error as Error, {
        userId: progress.user_id,
        simuladoId: progress.simulado_id,
      });
      throw new Error(`Erro ao salvar progresso do simulado: ${error}`);
    }
  }

  /**
   * Busca o progresso do usuário em um simulado
   */
  async getUserProgress(userId: string, simuladoId: string): Promise<UserSimuladoProgress | null> {
    const cacheKey = createCacheKey('user-progress', userId, simuladoId);
    
    return withCache(userProgressCache, cacheKey, async () => {
      const start = Date.now();
      try {
        const { data, error } = await this.supabase
          .from('user_simulado_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('simulado_id', simuladoId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null; // Not found
          throw error;
        }

        const _duration = Date.now() - start;
        logger.dbQuery('getUserProgress', 'user_simulado_progress', _duration, {
          userId,
          simuladoId,
          hasProgress: !!data,
        });

        return data;
      } catch (error) {
        const _duration = Date.now() - start;
        logger.dbError('getUserProgress', 'user_simulado_progress', error as Error, {
          userId,
          simuladoId,
        });
        throw new Error(`Erro ao buscar progresso do simulado: ${error}`);
      }
    });
  }

  /**
   * Busca estatísticas de simulados do usuário
   */
  async getUserStats(userId: string) {
    const cacheKey = createCacheKey('user-stats', userId);
    
    return withCache(userProgressCache, cacheKey, async () => {
      const start = Date.now();
      try {
        const { data, error } = await this.supabase
          .from('user_simulado_progress')
          .select(`
            *,
            simulados (
              id,
              title,
              difficulty
            )
          `)
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });

        if (error) throw error;

        const _duration = Date.now() - start;
        logger.dbQuery('getUserStats', 'user_simulado_progress', _duration, {
          userId,
          resultCount: data?.length || 0,
        });

        return data || [];
      } catch (error) {
        const _duration = Date.now() - start;
        logger.dbError('getUserStats', 'user_simulado_progress', error as Error, {
          userId,
        });
        throw new Error(`Erro ao buscar estatísticas do usuário: ${error}`);
      }
    });
  }

  /**
   * Busca questões de um simulado
   */
  async getSimuladoQuestions(simuladoId: string): Promise<SimuladoQuestion[]> {
    const cacheKey = createCacheKey('simulado-questions', simuladoId);
    
    return withCache(simuladosCache, cacheKey, async () => {
      const start = Date.now();
      try {
        const { data, error } = await this.supabase
          .from('simulado_questions')
          .select('*')
          .eq('simulado_id', simuladoId)
          .is('deleted_at', null)
          .order('question_number', { ascending: true });

        if (error) throw error;

        const _duration = Date.now() - start;
        logger.dbQuery('getSimuladoQuestions', 'simulado_questions', _duration, {
          simuladoId,
          questionCount: data?.length || 0,
        });

        return data || [];
      } catch (error) {
        const _duration = Date.now() - start;
        logger.dbError('getSimuladoQuestions', 'simulado_questions', error as Error, {
          simuladoId,
        });
        throw new Error(`Erro ao buscar questões do simulado: ${error}`);
      }
    });
  }

  /**
   * Cria um novo simulado com questões
   */
  async createWithQuestions(
    simulado: SimuladoInsert,
    questions: Omit<SimuladoQuestion, 'id' | 'simulado_id' | 'created_at' | 'updated_at'>[]
  ): Promise<SimuladoWithQuestions> {
    const start = Date.now();
    try {
      // Validar dados do simulado
      const validatedSimulado = validateData(simuladoInsertSchema, simulado);
      
      // Validar questões
      const validatedQuestions = questions.map(q => 
        validateData(simuladoQuestionInsertSchema, { ...q, simulado_id: 'temp' })
      );

      // Iniciar transação
      const { data: simuladoData, error: simuladoError } = await this.supabase
        .from(this.tableName)
        .insert(validatedSimulado)
        .select()
        .single();

      if (simuladoError) throw simuladoError;

      // Adicionar questões
      const questionsWithSimuladoId = validatedQuestions.map(q => ({
        ...q,
        simulado_id: simuladoData.id,
      }));

      const { data: questionsData, error: questionsError } = await this.supabase
        .from('simulado_questions')
        .insert(questionsWithSimuladoId)
        .select();

      if (questionsError) throw questionsError;

      const _duration = Date.now() - start;
      logger.dbQuery('createWithQuestions', this.tableName, _duration, {
        simuladoId: simuladoData.id,
        questionCount: questionsData?.length || 0,
      });

      // Invalidar cache relacionado
      this.invalidateCache();

      return {
        ...simuladoData,
        simulado_questions: questionsData || [],
        concursos: null, // Será preenchido se necessário
      };
    } catch (error) {
      const _duration = Date.now() - start;
      logger.dbError('createWithQuestions', this.tableName, error as Error, {
        title: simulado.title,
        questionCount: questions.length,
      });
      throw new Error(`Erro ao criar simulado com questões: ${error}`);
    }
  }

  /**
   * Invalida cache relacionado aos simulados
   */
  private invalidateCache(simuladoId?: string): void {
    // Limpar cache geral de simulados
    simuladosCache.clear();
    
    // Se um simulado específico foi atualizado, limpar cache relacionado
    if (simuladoId) {
      simuladosCache.delete(createCacheKey('simulados:with-questions', simuladoId));
      simuladosCache.delete(createCacheKey('simulado-questions', simuladoId));
    }
  }
} 