import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas (ajuste conforme necessário)
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/public',
  '/api/auth/login',
  '/favicon.ico',
  '/_next',
  '/public',
  '/aprova_facil_logo.png',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
];

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((publicPath) =>
    pathname === publicPath || pathname.startsWith(publicPath + '/')
  );
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((authPath) => pathname === authPath);
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    const { pathname } = req.nextUrl;

    // Log da tentativa de acesso
    console.log(`[MIDDLEWARE] ${req.method} ${pathname} - Session: ${!!session}`);

    // Permitir acesso a rotas públicas
    if (isPublicPath(pathname)) {
      return res;
    }

    // Se não autenticado, bloquear acesso
    if (!session || error) {
      console.log(`[MIDDLEWARE] Acesso negado para ${pathname} - Sem sessão`);
      
      if (pathname.startsWith('/api')) {
        return new NextResponse(
          JSON.stringify({ 
            success: false, 
            error: { 
              code: 'AUTH_REQUIRED', 
              message: 'Login obrigatório',
              timestamp: new Date().toISOString()
            } 
          }),
          { 
            status: 401, 
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            } 
          }
        );
      }

      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      redirectUrl.searchParams.set('reason', 'no_session');
      
      return NextResponse.redirect(redirectUrl);
    }

    // Verificar se o token está próximo de expirar
    if (session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      if (timeUntilExpiry < 5 * 60 * 1000) { // 5 minutos
        console.log(`[MIDDLEWARE] Token próximo de expirar para ${session.user.id}`);
        
        // Tentar renovar o token
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData.session) {
          console.log(`[MIDDLEWARE] Falha ao renovar token para ${session.user.id}`);
          
          const redirectUrl = req.nextUrl.clone();
          redirectUrl.pathname = '/login';
          redirectUrl.searchParams.set('redirectedFrom', pathname);
          redirectUrl.searchParams.set('reason', 'token_expired');
          
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    // Se autenticado e tentar acessar páginas de auth, redirecionar
    if (session && isAuthPath(pathname)) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      redirectUrl.searchParams.set('reason', 'already_authenticated');
      
      return NextResponse.redirect(redirectUrl);
    }

    // Adicionar headers de segurança
    res.headers.set('X-Auth-User-ID', session.user.id);
    res.headers.set('X-Auth-User-Email', session.user.email || '');
    res.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

    return res;
  } catch (error) {
    console.error('[MIDDLEWARE] Erro inesperado:', error);
    
    const { pathname } = req.nextUrl;
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    redirectUrl.searchParams.set('reason', 'middleware_error');
    
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
