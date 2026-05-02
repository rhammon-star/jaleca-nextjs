import { NextRequest, NextResponse } from 'next/server';

const STRIP_PARAMS = ['srsltid'];

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;

  const hasStrip = STRIP_PARAMS.some((p) => searchParams.has(p));
  if (!hasStrip) return NextResponse.next();

  const clean = request.nextUrl.clone();
  STRIP_PARAMS.forEach((p) => clean.searchParams.delete(p));
  clean.pathname = pathname;

  return NextResponse.redirect(clean, { status: 301 });
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
