import { useCallback, useRef, useState } from 'react';
import { AppError } from '../AppError';
import { errorHandler } from '../ErrorHandler';
import { captureBrowserContext } from '../ErrorLogger';

export interface UseErrorHandlerOptions {
  showUserFriendly?: boolean;
  logErrors?: boolean;
  onError?: (error: AppError) => void;
}

export interface ErrorState {
  error: AppError | null;
  isLoading: boolean;
  retryCount: number;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    showUserFriendly = true,
    logErrors = true,
    onError,
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isLoading: false,
    retryCount: 0,
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleError = useCallback(async (error: Error | AppError) => {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else {
      appError = AppError.fromError(error, {
        code: 'REACT_ERROR',
        category: 'system',
        severity: 'medium',
        retryable: false,
        userFriendly: true,
      });
    }

    // Adicionar contexto do navegador
    appError.addContext(captureBrowserContext());

    // Log do erro se habilitado
    if (logErrors) {
      await errorHandler.handle(appError);
    }

    // Atualizar estado
    setErrorState(prev => ({
      ...prev,
      error: appError,
      isLoading: false,
    }));

    // Callback personalizado
    if (onError) {
      onError(appError);
    }
  }, [logErrors, onError]);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isLoading: false,
      retryCount: 0,
    });
  }, []);

  const retry = useCallback(async (operation: () => Promise<any>) => {
    setErrorState(prev => ({
      ...prev,
      isLoading: true,
      retryCount: prev.retryCount + 1,
    }));

    try {
      const result = await operation();
      setErrorState(prev => ({
        ...prev,
        error: null,
        isLoading: false,
      }));
      return result;
    } catch (error) {
      await handleError(error as Error);
      throw error;
    }
  }, [handleError]);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    setErrorState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await errorHandler.withRetry(operation, maxRetries, delay);
      setErrorState(prev => ({
        ...prev,
        error: null,
        isLoading: false,
      }));
      return result;
    } catch (error) {
      await handleError(error as Error);
      throw error;
    }
  }, [handleError]);

  const executeSafely = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setErrorState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await operation();
      setErrorState(prev => ({
        ...prev,
        error: null,
        isLoading: false,
      }));
      return result;
    } catch (error) {
      await handleError(error as Error);
      return null;
    }
  }, [handleError]);

  // Limpar timeout ao desmontar
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  return {
    error: errorState.error,
    isLoading: errorState.isLoading,
    retryCount: errorState.retryCount,
    handleError,
    clearError,
    retry,
    executeWithRetry,
    executeSafely,
    cleanup,
    userMessage: errorState.error?.toUserFriendly() || null,
  };
}

export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    resetError,
    hasError: error !== null,
  };
}

export function useErrorToast() {
  const showError = useCallback((error: Error | AppError) => {
    let message: string;
    
    if (error instanceof AppError) {
      message = error.toUserFriendly();
    } else {
      message = error.message || 'Ocorreu um erro inesperado';
    }

    // Aqui você pode integrar com seu sistema de toast
    // Por exemplo, usando react-hot-toast, react-toastify, etc.
    console.error('Error Toast:', message);
    
    // Exemplo com react-hot-toast:
    // toast.error(message);
  }, []);

  return { showError };
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  const handleOnline = useCallback(() => {
    setIsOnline(true);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  // Adicionar listeners quando o componente montar
  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  return {
    isOnline,
    isOffline: !isOnline,
  };
}

export function useErrorRecovery() {
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const maxRecoveryAttempts = 3;

  const attemptRecovery = useCallback(async (
    recoveryFn: () => Promise<void>
  ): Promise<boolean> => {
    if (recoveryAttempts >= maxRecoveryAttempts) {
      return false;
    }

    try {
      await recoveryFn();
      setRecoveryAttempts(0);
      return true;
    } catch (error) {
      setRecoveryAttempts(prev => prev + 1);
      return false;
    }
  }, [recoveryAttempts]);

  const resetRecoveryAttempts = useCallback(() => {
    setRecoveryAttempts(0);
  }, []);

  return {
    recoveryAttempts,
    maxRecoveryAttempts,
    attemptRecovery,
    resetRecoveryAttempts,
    canAttemptRecovery: recoveryAttempts < maxRecoveryAttempts,
  };
} 