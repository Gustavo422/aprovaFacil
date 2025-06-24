import { createClient } from '@/lib/supabase';
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
  ApostilaFilters,
  // ApostilaWithContent,
} from '@/src/core/database/types';
import { withServiceErrorHandling } from '@/src/features/shared/utils/serviceUtils';

export class ApostilasService {
  private repository: ApostilasRepository;

  constructor() {
    const supabase = createClient();
    this.repository = new ApostilasRepository(supabase);
  }

  /**
   * Busca todas as apostilas com paginação
   */
  async getApostilas(page: number = 1, limit: number = 10, filters?: ApostilaFilters) {
    return withServiceErrorHandling(async () => {
      const response = await this.repository.findAllWithContent(page, limit, filters);
      return {
        data: response.data,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.count,
          totalPages: response.totalPages
        }
      };
    });
  }

  /**
   * Busca uma apostila por ID com conteúdo
   */
  async getApostilaById(id: string) {
    return withServiceErrorHandling(async () => {
      const apostila = await this.repository.findByIdWithContent(id);
      return apostila;
    });
  }

  /**
   * Busca apostilas por concurso
   */
  async getApostilasByConcurso(concursoId: string) {
    return withServiceErrorHandling(async () => {
      const apostilas = await this.repository.findByConcurso(concursoId);
      return apostilas;
    });
  }

  /**
   * Cria uma nova apostila
   */
  async createApostila(data: ApostilaInsert) {
    return withServiceErrorHandling(async () => {
      const apostila = await this.repository.create(data);
      return apostila;
    });
  }

  /**
   * Cria uma apostila com conteúdo
   */
  async createApostilaWithContent(
    apostila: ApostilaInsert,
    content: Omit<ApostilaContent, 'id' | 'apostila_id' | 'created_at'>[]
  ) {
    return withServiceErrorHandling(async () => {
      const result = await this.repository.createWithContent(apostila, content);
      return result;
    });
  }

  /**
   * Atualiza uma apostila
   */
  async updateApostila(id: string, data: ApostilaUpdate) {
    return withServiceErrorHandling(async () => {
      const apostila = await this.repository.update(id, data);
      return apostila;
    });
  }

  /**
   * Remove uma apostila
   */
  async deleteApostila(id: string) {
    return withServiceErrorHandling(async () => {
      await this.repository.delete(id);
      return null;
    });
  }

  /**
   * Adiciona conteúdo a uma apostila
   */
  async addContent(apostilaId: string, content: Omit<ApostilaContent, 'id' | 'apostila_id' | 'created_at'>) {
    return withServiceErrorHandling(async () => {
      const result = await this.repository.addContent(apostilaId, content);
      return result;
    });
  }

  /**
   * Atualiza conteúdo de uma apostila
   */
  async updateContent(contentId: string, content: ApostilaContentUpdate) {
    return withServiceErrorHandling(async () => {
      const result = await this.repository.updateContent(contentId, content);
      return result;
    });
  }

  /**
   * Remove conteúdo de uma apostila
   */
  async removeContent(contentId: string) {
    return withServiceErrorHandling(async () => {
      await this.repository.removeContent(contentId);
      return null;
    });
  }

  /**
   * Salva o progresso do usuário
   */
  async saveUserProgress(progress: UserApostilaProgressInsert) {
    return withServiceErrorHandling(async () => {
      const result = await this.repository.saveUserProgress(progress);
      return result;
    });
  }

  /**
   * Busca o progresso do usuário
   */
  async getUserProgress(userId: string, apostilaId?: string) {
    return withServiceErrorHandling(async () => {
      const progress = await this.repository.getUserProgress(userId, apostilaId);
      return progress;
    });
  }

  /**
   * Busca estatísticas do usuário
   */
  async getUserStats(userId: string) {
    return withServiceErrorHandling(async () => {
      const stats = await this.repository.getUserStats(userId);
      return stats;
    });
  }

  /**
   * Calcula progresso geral de uma apostila
   */
  async calculateApostilaProgress(userId: string, apostilaId: string) {
    return withServiceErrorHandling(async () => {
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
    });
  }
} 