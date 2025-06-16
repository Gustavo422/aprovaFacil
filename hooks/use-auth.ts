'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Erro ao renovar sessão:', error);
        await supabase.auth.signOut();
        router.push('/login');
        return false;
      }
      return !!data.session;
    } catch (error) {
      console.error('Erro inesperado ao renovar sessão:', error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [supabase.auth, router]);

  const checkSessionValidity = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Verificar se o token está próximo de expirar (5 minutos)
      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      if (timeUntilExpiry < 5 * 60 * 1000) { // 5 minutos
        await refreshSession();
      }
    }
    
    return session;
  }, [supabase.auth, refreshSession]);

  useEffect(() => {
    const initializeAuth = async () => {
      const session = await checkSessionValidity();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'TOKEN_REFRESHED') {
          setSession(session);
          setUser(session?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          router.push('/login');
        } else if (event === 'SIGNED_IN') {
          setSession(session);
          setUser(session?.user ?? null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão periodicamente (a cada 4 minutos)
    const interval = setInterval(checkSessionValidity, 4 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [supabase.auth, checkSessionValidity, router]);

  return { 
    user, 
    session, 
    loading, 
    isRefreshing, 
    refreshSession,
    signOut: () => supabase.auth.signOut()
  };
}
