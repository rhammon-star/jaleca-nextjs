import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // Redirect admin.jaleca.com.br → jaleca.com.br (301 permanent)
  // Prevents admin subdomain from being indexed by Google
  if (host === 'admin.jaleca.com.br') {
    const url = request.nextUrl.clone()
    url.host = 'jaleca.com.br'
    url.protocol = 'https:'
    return NextResponse.redirect(url, { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png).*)'],
}
