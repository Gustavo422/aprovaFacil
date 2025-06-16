import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function validateAuth() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session || error) {
    return {
      success: false,
      error: 'Não autorizado',
      status: 401,
    };
  }

  // Verificar se o token está próximo de expirar
  if (session.expires_at) {
    const expiresAt = new Date(session.expires_at * 1000);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    
    if (timeUntilExpiry < 5 * 60 * 1000) {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshData.session) {
        return {
          success: false,
          error: 'Sessão expirada',
          status: 401,
        };
      }
    }
  }

  return {
    success: true,
    user: session.user,
    session,
  };
}

export function createAuthErrorResponse(message: string = 'Não autorizado', status: number = 401) {
  return NextResponse.json(
    { 
      success: false, 
      error: { 
        code: 'AUTH_REQUIRED', 
        message,
        timestamp: new Date().toISOString()
      } 
    },
    { 
      status, 
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      } 
    }
  );
} 