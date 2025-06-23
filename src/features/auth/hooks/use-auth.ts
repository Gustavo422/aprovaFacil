'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { logger } from '../../../core/utils/logger';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    // Obter sessão inicial
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Erro ao obter sessão', { error: error as Error });
        }
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        logger.error('Erro ao inicializar autenticação', { error: error as Error });
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    getSession();

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed', { event, userId: session?.user?.id });
      
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
        setInitialized(true);
      }

      // Refresh da página em mudanças críticas de autenticação
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        // Pequeno delay para garantir que o estado seja atualizado
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Sign in error', { error: error as Error });
        throw error;
      }

      logger.info('Sign in successful', { userId: data.user?.id });
      return data;
    } catch (error) {
      logger.error('Sign in failed', { error: error as Error });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpar dados locais
      setUser(null);
      
      // Redirecionar para login
      window.location.href = '/login';
      
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  return { 
    user, 
    loading, 
    initialized,
    signIn, 
    signUp, 
    signOut 
  };
}

