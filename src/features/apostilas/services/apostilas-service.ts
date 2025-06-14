import { createServerSupabaseClient } from '@/lib/supabase';
import { ApostilasRepository } from '@/src/core/database/repositories/apostilas-repository';
import {
  // Apostila,
  ApostilaInsert,
  ApostilaUpdate,
  ApostilaContent,
  // ApostilaContentInsert,
  ApostilaContentUpdate,
  // UserApostilaProgress,
  UserApostilaProgressInsert,
  // ApostilaWithContent,
} from '@/src/core/database/types';

export class ApostilasService {
  private repository: ApostilasRepository;

  constructor() {
    const supabase = createServerSupabaseClient();
    this.repository = new ApostilasRepository(supabase);
  }

  /**
   * Busca todas as apostilas com paginação
   */
  async getApostilas(page: number = 1, limit: number = 10, filters?: Record<string, unknown>) {
    try {
      const response = await this.repository.findAllWithContent(page, limit, filters);
      return {
        success: true,
        data: response.data,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.count,
          totalPages: response.totalPages
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: []
      };
    }
  }

  /**
   * Busca uma apostila por ID com conteúdo
   */
  async getApostilaById(id: string) {
    try {
      const apostila = await this.repository.findByIdWithContent(id);
      return {
        success: true,
        data: apostila
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: null
      };
    }
  }

  /**
   * Busca apostilas por concurso
   */
  async getApostilasByConcurso(concursoId: string) {
    try {
      const apostilas = await this.repository.findByConcurso(concursoId);
      return {
        success: true,
        data: apostilas
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: []
      };
    }
  }

  /**
   * Cria uma nova apostila
   */
  async createApostila(data: ApostilaInsert) {
    try {
      const apostila = await this.repository.create(data);
      return {
        success: true,
        data: apostila
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: null
      };
    }
  }

  /**
   * Cria uma apostila com conteúdo
   */
  async createApostilaWithContent(
    apostila: ApostilaInsert,
    content: Omit<ApostilaContent, 'id' | 'apostila_id' | 'created_at'>[]
  ) {
    try {
      const result = await this.repository.createWithContent(apostila, content);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: null
      };
    }
  }

  /**
   * Atualiza uma apostila
   */
  async updateApostila(id: string, data: ApostilaUpdate) {
    try {
      const apostila = await this.repository.update(id, data);
      return {
        success: true,
        data: apostila
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: null
      };
    }
  }

  /**
   * Remove uma apostila
   */
  async deleteApostila(id: string) {
    try {
      await this.repository.delete(id);
      return {
        success: true,
        data: null
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Adiciona conteúdo a uma apostila
   */
  async addContent(apostilaId: string, content: Omit<ApostilaContent, 'id' | 'apostila_id' | 'created_at'>) {
    try {
      const result = await this.repository.addContent(apostilaId, content);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: null
      };
    }
  }

  /**
   * Atualiza conteúdo de uma apostila
   */
  async updateContent(contentId: string, content: ApostilaContentUpdate) {
    try {
      const result = await this.repository.updateContent(contentId, content);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: null
      };
    }
  }

  /**
   * Remove conteúdo de uma apostila
   */
  async removeContent(contentId: string) {
    try {
      await this.repository.removeContent(contentId);
      return {
        success: true,
        data: null
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Salva o progresso do usuário
   */
  async saveUserProgress(progress: UserApostilaProgressInsert) {
    try {
      const result = await this.repository.saveUserProgress(progress);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: null
      };
    }
  }

  /**
   * Busca o progresso do usuário
   */
  async getUserProgress(userId: string, apostilaId?: string) {
    try {
      const progress = await this.repository.getUserProgress(userId, apostilaId);
      return {
        success: true,
        data: progress
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: []
      };
    }
  }

  /**
   * Busca estatísticas do usuário
   */
  async getUserStats(userId: string) {
    try {
      const stats = await this.repository.getUserStats(userId);
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: null
      };
    }
  }

  /**
   * Calcula progresso geral de uma apostila
   */
  async calculateApostilaProgress(userId: string, apostilaId: string): Promise<{
    total_modules: number;
    completed_modules: number;
    progress_percentage: number;
    estimated_time_remaining: number; // em minutos
  }> {
    try {
      const apostila = await this.repository.findByIdWithContent(apostilaId);
      const progress = await this.repository.getUserProgress(userId, apostilaId);

      if (!apostila) {
        throw new Error('Apostila não encontrada');
      }

      const total_modules = apostila.apostila_content.length;
      const completed_modules = progress.filter(p => p.completed).length;
      const progress_percentage = total_modules > 0 ? (completed_modules / total_modules) * 100 : 0;

      // Estimativa de tempo restante (assumindo 30 min por módulo)
      const estimated_time_remaining = (total_modules - completed_modules) * 30;

      return {
        total_modules,
        completed_modules,
        progress_percentage,
        estimated_time_remaining
      };
    } catch (error) {
      throw new Error(`Erro ao calcular progresso da apostila: ${error}`);
    }
  }
} 