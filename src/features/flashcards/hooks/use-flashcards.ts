'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FlashcardsService } from '../services/flashcards-service';
import { FlashcardData, FlashcardFilters, UserFlashcardProgressInsert, UserFlashcardProgress } from '@/src/core/database/types';
import { useErrorHandler } from '../../shared/hooks/use-error-handler';

interface UseFlashcardsOptions {
  autoLoad?: boolean;
  initialFilters?: FlashcardFilters;
  page?: number;
  limit?: number;
}

interface UseFlashcardsReturn {
  flashcards: FlashcardData[];
  loading: boolean;
  error: Error | null;
  stats: {
    total_flashcards: number;
    flashcards_estudados: number;
    acertos: number;
    erros: number;
    taxa_acerto: number;
  } | null;
  loadFlashcards: (filters?: FlashcardFilters) => Promise<void>;
  loadFlashcardsByConcurso: (concursoId: string, limit?: number) => Promise<void>;
  loadRandomFlashcards: (concursoId: string, limit?: number) => Promise<void>;
  saveProgress: (progress: UserFlashcardProgressInsert) => Promise<UserFlashcardProgress | null>;
  loadUserStats: (userId: string) => Promise<void>;
  loadFlashcardsForReview: (userId: string, limit?: number) => Promise<void>;
  reset: () => void;
}

export function useFlashcards(options: UseFlashcardsOptions = {}): UseFlashcardsReturn {
  const {
    autoLoad = false,
    initialFilters = {},
    page = 1,
    limit = 10,
  } = options;

  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [stats, setStats] = useState<UseFlashcardsReturn['stats']>(null);
  const [loading, setLoading] = useState(false);

  const errorHandler = useErrorHandler({
    showToast: true,
    toastTitle: 'Erro de Flashcards',
    fallbackMessage: 'Erro ao carregar flashcards. Tente novamente.',
  });

  const service = useMemo(() => new FlashcardsService(), []);

  const loadFlashcards = useCallback(async (filters?: FlashcardFilters) => {
    setLoading(true);
    try {
      const result = await service.getFlashcards(page, limit, filters);
      if (result.success) {
        setFlashcards(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      errorHandler.execute(() => {
        throw error;
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, service, errorHandler]);

  const loadFlashcardsByConcurso = useCallback(async (concursoId: string, limit?: number) => {
    setLoading(true);
    try {
      const result = await service.getFlashcardsByConcurso(concursoId, limit);
      if (result.success) {
        setFlashcards(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      errorHandler.execute(() => {
        throw error;
      });
    } finally {
      setLoading(false);
    }
  }, [service, errorHandler]);

  const loadRandomFlashcards = useCallback(async (concursoId: string, limit: number = 10) => {
    setLoading(true);
    try {
      const result = await service.getRandomFlashcardsByConcurso(concursoId, limit);
      if (result.success) {
        setFlashcards(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      errorHandler.execute(() => {
        throw error;
      });
    } finally {
      setLoading(false);
    }
  }, [service, errorHandler]);

  const saveProgress = useCallback(async (progress: UserFlashcardProgressInsert) => {
    try {
      const result = await service.saveUserProgress(progress);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      errorHandler.execute(() => {
        throw error;
      });
      return null;
    }
  }, [service, errorHandler]);

  const loadUserStats = useCallback(async (userId: string) => {
    try {
      const result = await service.getUserStats(userId);
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      errorHandler.execute(() => {
        throw error;
      });
    }
  }, [service, errorHandler]);

  const loadFlashcardsForReview = useCallback(async (userId: string, limit: number = 20) => {
    setLoading(true);
    try {
      const result = await service.getFlashcardsForReview(userId, limit);
      if (result.success) {
        setFlashcards(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      errorHandler.execute(() => {
        throw error;
      });
    } finally {
      setLoading(false);
    }
  }, [service, errorHandler]);

  const reset = useCallback(() => {
    setFlashcards([]);
    setStats(null);
    setLoading(false);
    errorHandler.reset();
  }, [errorHandler]);

  // Auto-load se configurado
  useEffect(() => {
    if (autoLoad && Object.keys(initialFilters).length > 0) {
      loadFlashcards(initialFilters);
    }
  }, [autoLoad, initialFilters, loadFlashcards]);

  return {
    flashcards,
    loading: loading || errorHandler.isLoading,
    error: errorHandler.error,
    stats,
    loadFlashcards,
    loadFlashcardsByConcurso,
    loadRandomFlashcards,
    saveProgress,
    loadUserStats,
    loadFlashcardsForReview,
    reset,
  };
}

// Hook especializado para estudo de flashcards
export function useFlashcardStudy(concursoId: string, limit: number = 10) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studySession, setStudySession] = useState<{
    startTime: Date;
    totalCards: number;
    completedCards: number;
    correctAnswers: number;
  } | null>(null);

  const {
    flashcards,
    loading,
    error,
    loadRandomFlashcards,
    saveProgress,
    reset: resetFlashcards,
  } = useFlashcards();

  const startStudySession = useCallback(async () => {
    await loadRandomFlashcards(concursoId, limit);
    setCurrentIndex(0);
    setStudySession({
      startTime: new Date(),
      totalCards: limit,
      completedCards: 0,
      correctAnswers: 0,
    });
  }, [concursoId, limit, loadRandomFlashcards]);

  const answerCard = useCallback(async (
    flashcardId: string,
    acertou: boolean,
    tempoResposta?: number
  ) => {
    if (!studySession) return;

    // Salvar progresso
    await saveProgress({
      user_id: 'current-user-id', // Deve vir do contexto de auth
      flashcard_id: flashcardId,
      acertou,
      tempo_resposta: tempoResposta,
    });

    // Atualizar sessão
    setStudySession(prev => prev ? {
      ...prev,
      completedCards: prev.completedCards + 1,
      correctAnswers: prev.correctAnswers + (acertou ? 1 : 0),
    } : null);

    // Próximo card
    setCurrentIndex(prev => prev + 1);
  }, [studySession, saveProgress]);

  const resetStudySession = useCallback(() => {
    setCurrentIndex(0);
    setStudySession(null);
    resetFlashcards();
  }, [resetFlashcards]);

  const currentCard = flashcards[currentIndex];
  const isSessionComplete = studySession && currentIndex >= flashcards.length;

  return {
    currentCard,
    currentIndex,
    studySession,
    isSessionComplete,
    loading,
    error,
    startStudySession,
    answerCard,
    resetStudySession,
    totalCards: flashcards.length,
    progress: studySession ? (studySession.completedCards / studySession.totalCards) * 100 : 0,
  };
} 