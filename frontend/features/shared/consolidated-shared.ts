 'use client';

// ============================================================================
// ARQUIVO CONSOLIDADO - TODOS OS HOOKS E UTILITÁRIOS COMPARTILHADOS
// ============================================================================
// Este arquivo consolida os seguintes arquivos:
// - src/features/shared/hooks/use-error-handler.ts
// - src/features/shared/hooks/use-mobile.ts  
// - src/features/shared/hooks/use-toast.ts
// - src/features/shared/utils/toastUtils.ts
// - src/features/shared/utils/serviceUtils.ts
// - src/features/auth/hooks/use-auth.ts
// - src/features/auth/hooks/use-auth-retry.ts
// - src/core/utils/logger.ts
// - src/core/utils/cache.ts
// ============================================================================

import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================
interface ErrorHandlerOptions {
  showToast?: boolean;
  toastTitle?: string;
  onError?: (error: Error) => void;
  fallbackMessage?: string;
}

interface ErrorHandlerResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: (fn: (...args: unknown[]) => Promise<T>, ...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

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

interface LogContext {
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  duration?: number;
  error?: Error;
  [key: string]: unknown;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number;
  maxSize?: number;
}

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string };

type State = {
  toasts: ToasterToast[];
};

interface ToastAction {
  type: 'REMOVE_TOAST';
  toastId: string;
}

// ============================================================================
// CONSTANTES
// ============================================================================
const MOBILE_BREAKPOINT = 768;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

// ============================================================================
// UTILITÁRIOS DE TOAST (toastUtils.ts)
// ============================================================================
let count = 0;

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export function addToRemoveQueue(toastId: string, dispatch: (action: ToastAction) => void, TOAST_REMOVE_DELAY: number) {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

// ============================================================================
// SISTEMA DE TOAST (use-toast.ts)
// ============================================================================
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case 'DISMISS_TOAST': {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId, dispatch, TOAST_REMOVE_DELAY);
      } else {
        state.toasts.forEach(toast => {
          addToRemoveQueue(toast.id, dispatch, TOAST_REMOVE_DELAY);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach(listener => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...props }: Toast) {
  const id = genId();
  const update = (props: ToasterToast) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });
  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: open => {
        if (!open) dismiss();
      },
    },
  });
  return { id, dismiss, update };
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { toast };

// ============================================================================
// HOOKS DE ERRO (use-error-handler.ts)
// ============================================================================
export function useErrorHandler<T = unknown>(options: ErrorHandlerOptions = {}): ErrorHandlerResult<T> {
  const { showToast = true, toastTitle, onError, fallbackMessage } = options;
  const { toast } = useToast();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (fn: (...args: unknown[]) => Promise<T>, ...args: unknown[]): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      setData(result);
      setIsLoading(false);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setIsLoading(false);
      logger.error('useErrorHandler', { error: errorObj });
      if (showToast) {
        toast({
          title: toastTitle || 'Erro',
          description: fallbackMessage || errorObj.message,
          variant: 'destructive',
        });
      }
      if (onError) onError(errorObj);
      return null;
    }
  }, [showToast, toast, toastTitle, fallbackMessage, onError]);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, execute, reset };
}

export function useAuthErrorHandler() {
  return useErrorHandler({
    showToast: true,
    toastTitle: 'Erro de Autenticação',
    fallbackMessage: 'Erro ao autenticar. Verifique suas credenciais e tente novamente.',
  });
}

export function useDataErrorHandler() {
  return useErrorHandler({
    showToast: true,
    toastTitle: 'Erro de Dados',
    fallbackMessage: 'Erro ao carregar dados. Tente novamente.',
  });
}

export function useFormErrorHandler() {
  return useErrorHandler({
    showToast: true,
    toastTitle: 'Erro de Formulário',
    fallbackMessage: 'Erro ao processar formulário. Verifique os dados e tente novamente.',
  });
}

// ============================================================================
// HOOK DE MOBILE (use-mobile.ts)
// ============================================================================
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return Boolean(isMobile);
}

// ============================================================================
// HOOKS DE AUTENTICAÇÃO (use-auth.ts + use-auth-retry.ts)
// ============================================================================
export function useAuth() {
  const { useAuth: useAuthContext } = require('../auth/contexts/auth-context');
  const context = useAuthContext();
  
  return {
    user: context.user,
    session: context.session,
    loading: context.loading,
    initialized: context.initialized,
    signIn: context.signIn,
    signUp: context.signUp,
    signOut: context.signOut,
  };
}

export function useAuthRetry() {
  const [isRetrying, setIsRetrying] = useState(false);

  const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const { maxRetries = 0, baseDelay = 1000, onRetry, enableRetry = false } = options;
    let lastError: unknown;
    const actualMaxRetries = enableRetry ? maxRetries : 0;

    for (let attempt = 0; attempt <= actualMaxRetries; attempt++) {
      try {
        setIsRetrying(false);
        const result = await fn();

        if (result && typeof result === 'object' && 'error' in result && result.error) {
          const error = result.error as SupabaseError;

          if (error.message?.includes('rate limit') && enableRetry && attempt < actualMaxRetries) {
            const delay = baseDelay * Math.pow(2, attempt);
            setIsRetrying(true);
            logger.info(`Rate limit atingido. Tentativa ${attempt + 1}/${actualMaxRetries + 1}. Aguardando ${delay}ms...`);
            if (onRetry) onRetry(attempt + 1, delay);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw error;
        }
        return result;
      } catch (error: unknown) {
        lastError = error;
        const errorMessage = error && typeof error === 'object' && 'message' in error 
          ? (error as { message?: string }).message : undefined;
        
        if (!errorMessage?.includes('rate limit') || !enableRetry || attempt === actualMaxRetries) {
          setIsRetrying(false);
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        setIsRetrying(true);
        logger.info(`Rate limit atingido. Tentativa ${attempt + 1}/${actualMaxRetries + 1}. Aguardando ${delay}ms...`);
        if (onRetry) onRetry(attempt + 1, delay);
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
    return retryWithBackoff(fn, { ...options, enableRetry: true, maxRetries: 3 });
  };

  const getRateLimitMessage = (error: unknown): string => {
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? (error as { message?: string }).message : undefined;
    
    if (errorMessage?.includes('rate limit')) {
      return 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
    }
    return errorMessage || 'Ocorreu um erro. Tente novamente.';
  };

  return { retryWithBackoff, retryWithBackoffEnabled, getRateLimitMessage, isRetrying };
}

// ============================================================================
// UTILITÁRIOS DE SERVIÇO (serviceUtils.ts)
// ============================================================================
export async function withServiceErrorHandling<T>(fn: () => Promise<T>): Promise<{ success: boolean; data: T | null; error?: string }> {
  try {
    const data = await fn();
    return { success: true, data, error: undefined };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
    logger.error('Service error', { error });
    return { success: false, data: null, error: errorMsg };
  }
}

// ============================================================================
// SISTEMA DE LOG (logger.ts)
// ============================================================================
export { logger } from '@/lib/logger';

export function createLogContext(overrides: Partial<LogContext> = {}): LogContext {
  return { timestamp: new Date().toISOString(), ...overrides };
}

export function logPerformance(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: unknown[]) {
    const start = Date.now();
    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - start;
      logger.info(`${target.constructor.name}.${propertyKey}`, { duration, ...descriptor.value });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.info(`${target.constructor.name}.${propertyKey}`, { duration, error: error instanceof Error ? error : new Error(String(error)) });
      throw error;
    }
  };
  return descriptor;
}

// ============================================================================
// SISTEMA DE CACHE (cache.ts)
// ============================================================================
class Cache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTtl: number;
  private readonly maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTtl = options.ttl || 5 * 60 * 1000;
    this.maxSize = options.maxSize || 1000;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl: ttl || this.defaultTtl };
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  delete(key: string): boolean { return this.cache.delete(key); }
  clear(): void { this.cache.clear(); }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    if (oldestKey) this.cache.delete(oldestKey);
  }

  getStats() {
    return { size: this.cache.size, maxSize: this.maxSize, defaultTtl: this.defaultTtl };
  }
}

export const simuladosCache = new Cache({ ttl: 10 * 60 * 1000 });
export const flashcardsCache = new Cache({ ttl: 15 * 60 * 1000 });
export const apostilasCache = new Cache({ ttl: 30 * 60 * 1000 });
export const userProgressCache = new Cache({ ttl: 5 * 60 * 1000 });

export function createCacheKey(prefix: string, ...params: unknown[]): string {
  return `${prefix}:${params.join(':')}`;
}

export async function withCache<T>(cache: Cache, key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== null) return cached;
  const data = await fetcher();
  cache.set(key, data, ttl);
  return data;
}

setInterval(() => {
  simuladosCache.cleanup();
  flashcardsCache.cleanup();
  apostilasCache.cleanup();
  userProgressCache.cleanup();
}, 5 * 60 * 1000);

// ============================================================================
// RE-EXPORTS PARA COMPATIBILIDADE
// ============================================================================
export type { Session } from '@supabase/supabase-js';