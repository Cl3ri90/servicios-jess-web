import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Si trata de entrar a admin y no tiene sesión Supabase, login.
  if (isAdminRoute && !user) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) from += request.nextUrl.search;
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, request.url));
  }

  // Si está logueado y trata de ir al login, derivar a admin/owner
  if (isAuthPage && user && !request.nextUrl.searchParams.has('error')) {
    return NextResponse.redirect(new URL('/admin/owner', request.url));
  }

  // Si va a /admin de forma exacta, auto redirigir a owner
  if (request.nextUrl.pathname === '/admin' && user) {
    return NextResponse.redirect(new URL('/admin/owner', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
