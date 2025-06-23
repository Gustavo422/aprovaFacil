'use client';

import { useState } from 'react';
import { logger } from '../../../core/utils/logger';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  onRetry?: (attempt: number, delay: number) => void;
  enableRetry?: boolean;
}

interface SupabaseError {
  message?: string;
  [key: string]: unknown;
}

export function useAuthRetry() {
  const [isRetrying, setIsRetrying] = useState(false);

  const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const {
      maxRetries = 0,
      baseDelay = 1000,
      onRetry,
      enableRetry = false,
    } = options;
    let lastError: unknown;

    const actualMaxRetries = enableRetry ? maxRetries : 0;

    for (let attempt = 0; attempt <= actualMaxRetries; attempt++) {
      try {
        setIsRetrying(false);
        const result = await fn();

        if (
          result &&
          typeof result === 'object' &&
          'error' in result &&
          result.error
        ) {
          const error = result.error as SupabaseError;

          if (
            error.message?.includes('rate limit') &&
            enableRetry &&
            attempt < actualMaxRetries
          ) {
            const delay = baseDelay * Math.pow(2, attempt);
            setIsRetrying(true);

            logger.info(
              `Rate limit atingido. Tentativa ${attempt + 1}/${actualMaxRetries + 1}. Aguardando ${delay}ms...`
            );

            if (onRetry) {
              onRetry(attempt + 1, delay);
            }

            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }

        return result;
      } catch (error: unknown) {
        lastError = error;

        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message?: string }).message 
          : undefined;
        
        if (
          !errorMessage?.includes('rate limit') ||
          !enableRetry ||
          attempt === actualMaxRetries
        ) {
          setIsRetrying(false);
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        setIsRetrying(true);

        logger.info(
          `Rate limit atingido. Tentativa ${attempt + 1}/${actualMaxRetries + 1}. Aguardando ${delay}ms...`
        );

        if (onRetry) {
          onRetry(attempt + 1, delay);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    setIsRetrying(false);
    throw lastError;
  };

  const retryWithBackoffEnabled = async <T>(
    fn: () => Promise<T>,
    options: Omit<RetryOptions, 'enableRetry'> = {}
  ): Promise<T> => {
    return retryWithBackoff(fn, {
      ...options,
      enableRetry: true,
      maxRetries: 3,
    });
  };

  const getRateLimitMessage = (error: unknown): string => {
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? (error as { message?: string }).message 
      : undefined;
    
    if (errorMessage?.includes('rate limit')) {
      return 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
    }
    return errorMessage || 'Ocorreu um erro. Tente novamente.';
  };

  return {
    retryWithBackoff,
    retryWithBackoffEnabled,
    getRateLimitMessage,
    isRetrying,
  };
} 