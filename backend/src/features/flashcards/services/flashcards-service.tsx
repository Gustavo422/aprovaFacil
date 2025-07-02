import { createClient } from '@/lib/supabase';
import { FlashcardsRepository } from '@/src/core/database/repositories/flashcards-repository';
import {
  FlashcardData,
  FlashcardProgressData,
  FlashcardFilters,
  FlashcardInsert,
  FlashcardUpdate,
} from '@/src/core/database/types';
import { withServiceErrorHandling } from '@/src/features/shared/utils/serviceUtils';

export class FlashcardsService {
  private repository: FlashcardsRepository;

  constructor() {
    const supabase = createClient();
    this.repository = new FlashcardsRepository(supabase);
  }

  /**
   * Busca todos os flashcards com paginação
   */
  async getFlashcards(page: number = 1, limit: number = 10, filters?: Record<string, unknown>) {
    return withServiceErrorHandling(async () => {
      const response = await this.repository.findAll(page, limit, filters as Record<string, unknown>);
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
   * Busca um flashcard por ID
   */
  async getFlashcardById(id: string) {
    return withServiceErrorHandling(async () => {
      const flashcard = await this.repository.findById(id);
      return flashcard;
    });
  }

  /**
   * Cria um novo flashcard
   */
  async createFlashcard(data: FlashcardInsert) {
    return withServiceErrorHandling(async () => {
      const flashcard = await this.repository.create(data);
      return flashcard;
    });
  }

  /**
   * Atualiza um flashcard
   */
  async updateFlashcard(id: string, data: FlashcardUpdate) {
    return withServiceErrorHandling(async () => {
      const flashcard = await this.repository.update(id, data);
      return flashcard;
    });
  }

  /**
   * Remove um flashcard
   */
  async deleteFlashcard(id: string) {
    return withServiceErrorHandling(async () => {
      await this.repository.delete(id);
      return null;
    });
  }

  /**
   * Busca flashcards por concurso
   */
  async getFlashcardsByConcurso(concursoId: string, limit?: number) {
    return withServiceErrorHandling(async () => {
      const flashcards = await this.repository.findByConcurso(concursoId, limit);
      return flashcards;
    });
  }

  /**
   * Busca flashcards aleatórios por concurso
   */
  async getRandomFlashcardsByConcurso(concursoId: string, limit: number = 10) {
    return withServiceErrorHandling(async () => {
      const flashcards = await this.repository.findRandomByConcurso(concursoId, limit);
      return flashcards;
    });
  }

  /**
   * Busca flashcards com filtros avançados
   */
  async getFlashcardsByFilters(filters: FlashcardFilters, limit?: number) {
    return withServiceErrorHandling(async () => {
      const flashcards = await this.repository.findByFilters(filters, limit);
      return flashcards;
    });
  }

  /**
   * Salva o progresso do usuário em um flashcard
   */
  async saveUserProgress(progress: Omit<FlashcardProgressData, 'id' | 'created_at' | 'updated_at'>) {
    return withServiceErrorHandling(async () => {
      const userProgress = await this.repository.saveUserProgress(progress);
      return userProgress;
    });
  }

  /**
   * Busca o progresso do usuário em flashcards
   */
  async getUserProgress(userId: string, flashcardId?: string) {
    return withServiceErrorHandling(async () => {
      const progress = await this.repository.getUserProgress(userId, flashcardId);
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
   * Busca flashcards para revisão
   */
  async getFlashcardsForReview(userId: string, limit: number = 20) {
    return withServiceErrorHandling(async () => {
      const flashcards = await this.repository.findForReview(userId, limit);
      return flashcards;
    });
  }
} 