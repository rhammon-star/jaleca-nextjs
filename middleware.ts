import { NextRequest, NextResponse } from 'next/server';

const STRIP_PARAMS = ['srsltid'];

// Origens autorizadas a consumir /api/blog/** (CORS).
// Vai aceitar tanto o domínio principal quanto preview/staging do Vercel.
const ALLOWED_ORIGINS = [
  'https://seo.jaleca.com.br',
  'https://www.seo.jaleca.com.br',
  'http://localhost:3000',
  'http://localhost:3001',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Aceita previews do Vercel do projeto seo.jaleca (*-seo-jaleca.vercel.app)
  if (/^https:\/\/[a-z0-9-]+-(seo-jaleca|jaleca-seo)\.vercel\.app$/.test(origin)) return true;
  return false;
}

function buildCorsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;

  // ── CORS para /api/blog/** ──────────────────────────────────────────────────
  if (pathname.startsWith('/api/blog/')) {
    const origin = request.headers.get('origin');
    const allowed = isAllowedOrigin(origin);

    // Preflight OPTIONS
    if (request.method === 'OPTIONS') {
      if (!allowed) {
        return new NextResponse(null, { status: 403 });
      }
      return new NextResponse(null, {
        status: 204,
        headers: buildCorsHeaders(origin!),
      });
    }

    // Outras requisições: adiciona CORS headers se origem permitida
    if (allowed) {
      const res = NextResponse.next();
      const corsHeaders = buildCorsHeaders(origin!);
      Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v as string));
      return res;
    }
    // Sem origem permitida = mesma origem (jaleca.com.br) → segue sem CORS
    return NextResponse.next();
  }

  // ── Strip de query params indesejados (srsltid) ─────────────────────────────
  const hasStrip = STRIP_PARAMS.some((p) => searchParams.has(p));
  if (!hasStrip) return NextResponse.next();

  const clean = request.nextUrl.clone();
  STRIP_PARAMS.forEach((p) => clean.searchParams.delete(p));
  clean.pathname = pathname;

  return NextResponse.redirect(clean, { status: 301 });
}

export const config = {
  matcher: [
    // Inclui /api/blog/** pra aplicar CORS
    '/api/blog/:path*',
    // Mantém a regra antiga (exclui _next, api, favicon)
    '/((?!_next|api|favicon.ico).*)',
  ],
};
