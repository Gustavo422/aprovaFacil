'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push('/login?redirectedFrom=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, loading, requireAuth, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !user) {
    return fallback || <LoadingSpinner />;
  }

  return <>{children}</>;
} 