import { useState, useCallback, useRef } from 'react';
import { AppError } from '../AppError';
import { logger } from '../../utils/logger';

interface ErrorHandlerConfig {
  showUserFriendly?: boolean;
  logErrors?: boolean;
  onError?: (error: AppError) => void;
  maxRetries?: number;
  retryDelay?: number;
}

interface ErrorState {
  error: AppError | null;
  isLoading: boolean;
  retryCount: number;
}

export function useErrorHandler(config: ErrorHandlerConfig = {}) {
  const {
    logErrors = true,
    onError,
    maxRetries = 3,
    retryDelay = 1000,
  } = config;

  const [state, setState] = useState<ErrorState>({
    error: null,
    isLoading: false,
    retryCount: 0,
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      retryCount: 0,
    }));
  }, []);

  const setError = useCallback((error: AppError) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false,
    }));

    if (logErrors) {
      logger.error('Error in useErrorHandler', { error });
    }

    if (onError) {
      onError(error);
    }
  }, [logErrors, onError]);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const executeSafely = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    clearError();

    try {
      const result = await operation();
      setLoading(false);
      return result;
    } catch (error) {
      const appError = error instanceof AppError 
        ? error 
        : AppError.fromError(error as Error, {
            code: 'UNKNOWN_ERROR',
            category: 'unknown',
            severity: 'medium',
            retryable: false,
            userFriendly: true,
          });

      setError(appError);
      return null;
    }
  }, [setLoading, clearError, setError]);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    customMaxRetries?: number,
    customDelay?: number
  ): Promise<T | null> => {
    const maxRetriesCount = customMaxRetries ?? maxRetries;
    const delay = customDelay ?? retryDelay;
    let lastError: AppError;

    for (let attempt = 0; attempt <= maxRetriesCount; attempt++) {
      setState(prev => ({
        ...prev,
        isLoading: true,
        retryCount: attempt,
      }));

      try {
        const result = await operation();
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
        return result;
      } catch (error) {
        lastError = error instanceof AppError 
          ? error 
          : AppError.fromError(error as Error, {
              code: 'UNKNOWN_ERROR',
              category: 'unknown',
              severity: 'medium',
              retryable: true,
              userFriendly: true,
            });

        // Se não é o último attempt e o erro é retryable
        if (attempt < maxRetriesCount && lastError.isRetryable()) {
          const backoffDelay = delay * Math.pow(2, attempt);
          
          // Limpar timeout anterior se existir
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }

          // Aguardar antes da próxima tentativa
          await new Promise<void>((resolve) => {
            retryTimeoutRef.current = setTimeout(resolve, backoffDelay);
          });
          
          continue;
        }
        
        break;
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    setError(lastError!);
    return null;
  }, [maxRetries, retryDelay, setError]);

  const retry = useCallback(async () => {
    if (state.error && state.retryCount < maxRetries) {
      setState(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1,
      }));
      
      // Aqui você pode implementar a lógica de retry
      // Por exemplo, executar a última operação novamente
      logger.info('Retrying operation', { retryCount: state.retryCount + 1 });
    }
  }, [state.error, state.retryCount, maxRetries]);

  // Cleanup do timeout no unmount
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  return {
    error: state.error,
    isLoading: state.isLoading,
    retryCount: state.retryCount,
    executeSafely,
    executeWithRetry,
    clearError,
    retry,
    cleanup,
  };
}

// Hook para toast de erro
export function useErrorToast() {
  const showError = useCallback((error: AppError) => {
    // Implementar integração com sistema de toast
    // Por exemplo, usando react-hot-toast, react-toastify, etc.
    logger.error('Error toast', { error });
  }, []);

  const showSuccess = useCallback((message: string) => {
    logger.info('Success toast', { message });
  }, []);

  return { showError, showSuccess };
}

// Hook para monitoramento de status da rede
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const handleOnline = useCallback(() => {
    setIsOnline(true);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  // Adicionar event listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  return {
    isOnline,
    isOffline: !isOnline,
  };
}

// Hook para recuperação de erro
export function useErrorRecovery() {
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const maxRecoveryAttempts = 3;

  const attemptRecovery = useCallback(async (
    recoveryOperation: () => Promise<void>
  ): Promise<boolean> => {
    if (recoveryAttempts >= maxRecoveryAttempts) {
      return false;
    }

    try {
      await recoveryOperation();
      setRecoveryAttempts(0);
      return true;
    } catch {
      setRecoveryAttempts(prev => prev + 1);
      return false;
    }
  }, [recoveryAttempts]);

  const resetRecoveryAttempts = useCallback(() => {
    setRecoveryAttempts(0);
  }, []);

  const canAttemptRecovery = recoveryAttempts < maxRecoveryAttempts;

  return {
    recoveryAttempts,
    attemptRecovery,
    resetRecoveryAttempts,
    canAttemptRecovery,
  };
} 