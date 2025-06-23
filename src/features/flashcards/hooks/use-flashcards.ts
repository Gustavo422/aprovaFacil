'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FlashcardsService } from '../services/flashcards-service';
import { FlashcardData, FlashcardFilters, FlashcardProgressData } from '@/src/core/database/types';
import { useErrorHandler } from '@/src/features/shared/hooks/use-error-handler';
import { useAuth } from '@/src/features/auth/hooks/use-auth';

interface UseFlashcardsOptions {
  autoLoad?: boolean;
  initialFilters?: FlashcardFilters;
  page?: number;
  limit?: number;
}

interface FlashcardStats {
  totalFlashcards: number;
  studiedFlashcards: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracyRate: number;
}

interface UseFlashcardsReturn {
  flashcards: FlashcardData[];
  loading: boolean;
  error: Error | null;
  stats: FlashcardStats | null;
  loadFlashcards: (filters?: FlashcardFilters) => Promise<void>;
  loadByConcurso: (concursoId: string, limit?: number) => Promise<void>;
  loadRandom: (concursoId: string, limit?: number) => Promise<void>;
  saveProgress: (progress: Omit<FlashcardProgressData, 'id' | 'created_at' | 'updated_at'>) => Promise<FlashcardProgressData | null>;
  loadUserStats: (userId: string) => Promise<void>;
  loadForReview: (userId: string, limit?: number) => Promise<void>;
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
  const [stats, setStats] = useState<FlashcardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const errorHandler = useErrorHandler({
    showToast: true,
    toastTitle: 'Erro de Flashcards',
    fallbackMessage: 'Erro ao carregar flashcards. Tente novamente.',
  });

  const service = useMemo(() => new FlashcardsService(), []);

  // Função utilitária para centralizar carregamento e tratamento de erro/loading
  const handleLoad = useCallback(
    async <T>(fn: () => Promise<T>, onSuccess?: (data: T) => void) => {
      setLoading(true);
      try {
        const result = await fn();
        onSuccess?.(result);
      } catch (error) {
        errorHandler.execute(() => {
          throw error;
        });
      } finally {
        setLoading(false);
      }
    },
    [errorHandler]
  );

  const loadFlashcards = useCallback(
    async (filters?: FlashcardFilters) => {
      await handleLoad(
        async () => {
          const result = await service.getFlashcards(page, limit, filters);
          if (!result.success) throw new Error(result.error);
          return result.data || [];
        },
        setFlashcards
      );
    },
    [page, limit, service, handleLoad]
  );

  const loadByConcurso = useCallback(
    async (concursoId: string, lim?: number) => {
      await handleLoad(
        async () => {
          const result = await service.getFlashcardsByConcurso(concursoId, lim);
          if (!result.success) throw new Error(result.error);
          return result.data || [];
        },
        setFlashcards
      );
    },
    [service, handleLoad]
  );

  const loadRandom = useCallback(
    async (concursoId: string, lim: number = 10) => {
      await handleLoad(
        async () => {
          const result = await service.getRandomFlashcardsByConcurso(concursoId, lim);
          if (!result.success) throw new Error(result.error);
          return result.data || [];
        },
        setFlashcards
      );
    },
    [service, handleLoad]
  );

  const saveProgress = useCallback(
    async (progress: Omit<FlashcardProgressData, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const result = await service.saveUserProgress(progress);
        if (!result.success) throw new Error(result.error);
        return result.data;
      } catch (error) {
        errorHandler.execute(() => {
          throw error;
        });
        return null;
      }
    },
    [service, errorHandler]
  );

  const loadUserStats = useCallback(
    async (userId: string) => {
      await handleLoad(
        async () => {
          const result = await service.getUserStats(userId);
          if (!result.success) throw new Error(result.error);
          // Padroniza nomes para camelCase e garante que todos os campos sejam number
          const { total_flashcards, flashcards_estudados, acertos, erros, taxa_acerto } = result.data || {};
          return {
            totalFlashcards: total_flashcards ?? 0,
            studiedFlashcards: flashcards_estudados ?? 0,
            correctAnswers: acertos ?? 0,
            wrongAnswers: erros ?? 0,
            accuracyRate: taxa_acerto ?? 0,
          };
        },
        setStats
      );
    },
    [service, handleLoad]
  );

  const loadForReview = useCallback(
    async (userId: string, lim: number = 20) => {
      await handleLoad(
        async () => {
          const result = await service.getFlashcardsForReview(userId, lim);
          if (!result.success) throw new Error(result.error);
          return result.data || [];
        },
        setFlashcards
      );
    },
    [service, handleLoad]
  );

  const reset = useCallback(() => {
    setFlashcards([]);
    setStats(null);
    setLoading(false);
    errorHandler.reset();
  }, [errorHandler]);

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
    loadByConcurso,
    loadRandom,
    saveProgress,
    loadUserStats,
    loadForReview,
    reset,
  };
}

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
    loadRandom,
    saveProgress,
    reset: resetFlashcards,
  } = useFlashcards();

  const { user } = useAuth();

  const startSession = useCallback(async () => {
    await loadRandom(concursoId, limit);
    setCurrentIndex(0);
    setStudySession({
      startTime: new Date(),
      totalCards: limit,
      completedCards: 0,
      correctAnswers: 0,
    });
  }, [concursoId, limit, loadRandom]);

  const answerCard = useCallback(
    async (flashcardId: string, acertou: boolean, tempoResposta?: number) => {
      if (!studySession || !user) return;
      await saveProgress({
        user_id: user.id,
        flashcard_id: flashcardId,
        acertou,
        tentativas: 1,
        tempo_resposta: tempoResposta,
      });
      setStudySession(prev =>
        prev
          ? {
              ...prev,
              completedCards: prev.completedCards + 1,
              correctAnswers: prev.correctAnswers + (acertou ? 1 : 0),
            }
          : null
      );
      setCurrentIndex(prev => prev + 1);
    },
    [studySession, saveProgress, user]
  );

  const resetSession = useCallback(() => {
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
    startSession,
    answerCard,
    resetSession,
    totalCards: flashcards.length,
    progress: studySession ? (studySession.completedCards / studySession.totalCards) * 100 : 0,
  };
} 