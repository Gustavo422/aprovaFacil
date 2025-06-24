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
        logger.error('findAllWithConcurso', { table: this.tableName, duration: _duration, resultCount: data?.length || 0 });

        return {
          data: data as SimuladoWithConcurso[] || [],
          count: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        };
      } catch (error) {
        const _duration = Date.now() - start;
        logger.error('findAllWithConcurso', { table: this.tableName, error });
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
        logger.error('findByIdWithQuestions', { simuladoId: id, duration: _duration, hasQuestions: data?.simulado_questions?.length > 0 });

        return data as SimuladoWithQuestions;
      } catch (error) {
        const _duration = Date.now() - start;
        logger.error('findByIdWithQuestions', { simuladoId: id, error });
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
        logger.error('findByConcurso', { table: this.tableName, concursoId, duration: _duration, resultCount: data?.length || 0 });

        return data as SimuladoWithConcurso[] || [];
      } catch (error) {
        const _duration = Date.now() - start;
        logger.error('findByConcurso', { table: this.tableName, concursoId, error });
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
      logger.error('create', { table: this.tableName, simuladoId: result.id, title: result.title });

      // Invalidar cache relacionado
      this.invalidateCache();

      return result;
    } catch (error) {
      const _duration = Date.now() - start;
      logger.error('create', { table: this.tableName, error });
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
      logger.error('update', { table: this.tableName, simuladoId: id, updatedFields: Object.keys(validatedData) });

      // Invalidar cache relacionado
      this.invalidateCache(id);

      return result;
    } catch (error) {
      const _duration = Date.now() - start;
      logger.error('update', { table: this.tableName, simuladoId: id, error });
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
      logger.error('saveUserProgress', { table: 'user_simulado_progress', userId: progress.user_id, simuladoId: progress.simulado_id, score: progress.score });

      // Invalidar cache de progresso do usuário
      userProgressCache.delete(createCacheKey('user-progress', progress.user_id));

      return data;
    } catch (error) {
      const _duration = Date.now() - start;
      logger.error('saveUserProgress', { table: 'user_simulado_progress', userId: progress.user_id, simuladoId: progress.simulado_id, error });
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
        logger.error('getUserProgress', { table: 'user_simulado_progress', userId, simuladoId, hasProgress: !!data });

        return data;
      } catch (error) {
        const _duration = Date.now() - start;
        logger.error('getUserProgress', { table: 'user_simulado_progress', userId, simuladoId, error });
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
        logger.error('getUserStats', { table: 'user_simulado_progress', userId, resultCount: data?.length || 0 });

        return data || [];
      } catch (error) {
        const _duration = Date.now() - start;
        logger.error('getUserStats', { table: 'user_simulado_progress', userId, error });
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
        logger.error('getSimuladoQuestions', { table: 'simulado_questions', simuladoId, questionCount: data?.length || 0 });

        return data || [];
      } catch (error) {
        const _duration = Date.now() - start;
        logger.error('getSimuladoQuestions', { table: 'simulado_questions', simuladoId, error });
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
      logger.error('createWithQuestions', { table: this.tableName, simuladoId: simuladoData.id, questionCount: questionsData?.length || 0 });

      // Invalidar cache relacionado
      this.invalidateCache();

      return {
        ...simuladoData,
        simulado_questions: questionsData || [],
        concursos: null, // Será preenchido se necessário
      };
    } catch (error) {
      const _duration = Date.now() - start;
      logger.error('createWithQuestions', { table: this.tableName, title: simulado.title, questionCount: questions.length });
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