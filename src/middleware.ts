import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Canonical host config
  const canonicalHost = 'sendmyform.live';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('[::1]');

  // Redirect to canonical domain if not on localhost and host doesn't match
  if (!isLocalhost && host !== canonicalHost) {
    url.host = canonicalHost;
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  // Get response
  const response = NextResponse.next();

  // Add global CORS headers to every request matched by middleware
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response;
}

// Enforce middleware on all routes except static files & next internals
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets like .png, .jpg, .svg
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
