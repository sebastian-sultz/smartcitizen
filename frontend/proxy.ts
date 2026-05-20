import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Let static assets, api, or next internals pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const payload = token ? parseJwt(token) : null;
  const userType = payload?.user_type; // 'admin' or 'member'

  // Admin routes protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token || userType !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Citizen/Member routes protection
  if (pathname.startsWith('/citizen')) {
    if (!token || (userType !== 'member' && userType !== 'admin')) {
      return NextResponse.redirect(new URL('/member_login', request.url));
    }
  }

  // Auth pages redirection (if logged in, redirect away from login/register pages)
  if (pathname === '/member_login' || pathname === '/admin/login' || pathname === '/join_us') {
    if (token && userType) {
      if (userType === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userType === 'member') {
        return NextResponse.redirect(new URL('/citizen', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)'],
};
