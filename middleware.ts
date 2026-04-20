import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // admin.jaleca.com.br → 410 Gone + noindex (X-Robots-Tag em 301 não é respeitado pelo Google)
  if (host === 'admin.jaleca.com.br') {
    return new NextResponse('Gone', {
      status: 410,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
        'Content-Type': 'text/plain',
      },
    })
  }

  // Redirect www.jaleca.com.br → jaleca.com.br (301 — evita indexação duplicada)
  if (host === 'www.jaleca.com.br') {
    const url = request.nextUrl.clone()
    url.host = 'jaleca.com.br'
    url.protocol = 'https:'
    return NextResponse.redirect(url, { status: 301 })
  }

  const pathname = request.nextUrl.pathname

  // Redirect /loja-matriz → /nossas-lojas (301 — GSC mostra loja-matriz ainda indexada)
  if (pathname === '/loja-matriz' || pathname === '/loja-matriz/') {
    return NextResponse.redirect(new URL('/nossas-lojas', request.url), { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png).*)'],
}
