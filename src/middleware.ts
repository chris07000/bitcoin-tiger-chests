import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Gebruik de API key uit environment variabelen
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Alleen de admin routes beschermen, behalve de login pagina
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Controleer of de API key is geconfigureerd
    if (!ADMIN_API_KEY) {
      console.error('Admin API key not configured in environment variables');
      // Redirect naar een foutpagina of login
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // Check voor bestaande admin session cookie
    const adminSession = request.cookies.get('admin_session')?.value;
    
    if (adminSession === ADMIN_API_KEY) {
      // Admin is al ingelogd, laat door
      return NextResponse.next();
    }
    
    // Redirect naar login als niet ingelogd
    // Sla de huidige URL op als redirect parameter
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = `?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Voor alle andere routes (inclusief API routes), gewoon doorlaten
  return NextResponse.next();
}

// Configureer de middleware om alleen op admin routes te worden uitgevoerd
export const config = {
  matcher: ['/admin/:path*'],
}; 