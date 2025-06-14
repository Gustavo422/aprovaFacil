import { createServerSupabaseClient } from '@/lib/supabase';
import { FlashcardsRepository } from '@/src/core/database/repositories/flashcards-repository';
import {
  FlashcardData,
  FlashcardProgressData,
  FlashcardFilters,
  FlashcardInsert,
  FlashcardUpdate,
} from '@/src/core/database/types';

export class FlashcardsService {
  private repository: FlashcardsRepository;

  constructor() {
    const supabase = createServerSupabaseClient();
    this.repository = new FlashcardsRepository(supabase);
  }

  /**
   * Busca todos os flashcards com paginação
   */
  async getFlashcards(page: number = 1, limit: number = 10, filters?: FlashcardFilters) {
    try {
      const response = await this.repository.findAll(page, limit, filters);
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
   * Busca um flashcard por ID
   */
  async getFlashcardById(id: string) {
    try {
      const flashcard = await this.repository.findById(id);
      return {
        success: true,
        data: flashcard
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
   * Cria um novo flashcard
   */
  async createFlashcard(data: FlashcardInsert) {
    try {
      const flashcard = await this.repository.create(data);
      return {
        success: true,
        data: flashcard
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
   * Atualiza um flashcard
   */
  async updateFlashcard(id: string, data: FlashcardUpdate) {
    try {
      const flashcard = await this.repository.update(id, data);
      return {
        success: true,
        data: flashcard
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
   * Remove um flashcard
   */
  async deleteFlashcard(id: string) {
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
   * Busca flashcards por concurso
   */
  async getFlashcardsByConcurso(concursoId: string, limit?: number) {
    try {
      const flashcards = await this.repository.findByConcurso(concursoId, limit);
      return {
        success: true,
        data: flashcards
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
   * Busca flashcards aleatórios por concurso
   */
  async getRandomFlashcardsByConcurso(concursoId: string, limit: number = 10) {
    try {
      const flashcards = await this.repository.findRandomByConcurso(concursoId, limit);
      return {
        success: true,
        data: flashcards
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
   * Busca flashcards com filtros avançados
   */
  async getFlashcardsByFilters(filters: FlashcardFilters, limit?: number) {
    try {
      const flashcards = await this.repository.findByFilters(filters, limit);
      return {
        success: true,
        data: flashcards
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
   * Salva o progresso do usuário em um flashcard
   */
  async saveUserProgress(progress: Omit<FlashcardProgressData, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const userProgress = await this.repository.saveUserProgress(progress);
      return {
        success: true,
        data: userProgress
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
   * Busca o progresso do usuário em flashcards
   */
  async getUserProgress(userId: string, flashcardId?: string) {
    try {
      const progress = await this.repository.getUserProgress(userId, flashcardId);
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
   * Busca flashcards para revisão
   */
  async getFlashcardsForReview(userId: string, limit: number = 20) {
    try {
      // Implementar lógica de repetição espaçada
      const progress = await this.repository.getUserProgress(userId);
      const now = new Date();
      
      // Filtrar flashcards que precisam de revisão
      const needsReview = progress.filter((p: FlashcardProgressData) => {
        if (!p.proxima_revisao) return true;
        return new Date(p.proxima_revisao) <= now;
      });

      // Buscar os flashcards
      const flashcardIds = needsReview.map((p: FlashcardProgressData) => p.flashcard_id);
      const flashcards: FlashcardData[] = [];
      
      for (const id of flashcardIds.slice(0, limit)) {
        const flashcard = await this.repository.findById(id);
        if (flashcard) {
          flashcards.push(flashcard);
        }
      }

      return {
        success: true,
        data: flashcards
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        data: []
      };
    }
  }
} 