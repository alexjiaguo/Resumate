import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];

// Routes that are always public
const PUBLIC_ROUTES = ['/', '/login', '/auth/callback', '/pricing', '/editor'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for Supabase auth cookie
  // Note: Full cookie-based auth requires @supabase/ssr, 
  // but for now we do client-side auth checks.
  // The middleware just ensures the page loads; the AuthProvider handles the rest.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
