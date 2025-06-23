'use client';

import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ 
  children, 
  fallback, 
  requireAuth = true 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading && requireAuth && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      
      // Usar setTimeout para evitar problemas de navegação
      redirectTimeoutRef.current = setTimeout(() => {
        router.push('/login?redirectedFrom=' + encodeURIComponent(window.location.pathname));
      }, 100);
    }
  }, [user, loading, requireAuth, router]);

  // Reset redirect flag when user changes
  useEffect(() => {
    if (user) {
      hasRedirected.current = false;
    }
  }, [user]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !user) {
    return fallback || <LoadingSpinner />;
  }

  return <>{children}</>;
} 