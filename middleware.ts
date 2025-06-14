import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas (ajuste conforme necessário)
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/api/public',
  '/favicon.ico',
  '/_next',
  '/public',
  '/aprova_facil_logo.png',
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((publicPath) =>
    pathname === publicPath || pathname.startsWith(publicPath + '/')
  );
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Permitir acesso a rotas públicas SEM login
  if (isPublicPath(pathname)) {
    return res;
  }

  // Se não autenticado, bloquear acesso a tudo (exceto público)
  if (!session) {
    // Se for API, retorna 401
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ success: false, error: { code: 'AUTH_REQUIRED', message: 'Login obrigatório' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Se for página, redireciona para login
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se autenticado e tentar acessar login/register, redireciona para dashboard
  if (session && (pathname === '/login' || pathname === '/register')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Permitir acesso normalmente
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
