import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'zh'] as const;
type Locale = typeof locales[number];
const defaultLocale: Locale = 'en';

function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  // Very simple detection (you can make it more sophisticated)
  if (acceptLanguage.toLowerCase().includes('zh')) {
    return 'zh';
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip all internal Next.js paths, API routes, static files, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || // most static files have extension
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // 2. Check if path already has valid locale prefix
  const pathnameHasLocale = locales.some((locale) =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3. At this point → path has NO locale → we should add one
  const acceptLanguage = request.headers.get('accept-language');
  const locale = getLocaleFromHeader(acceptLanguage);

  // Build new URL with locale prefix
  const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);

  return NextResponse.redirect(newUrl, 307); // 307 = Temporary Redirect (safer during dev/testing)
  // Use 301 only when you're 100% sure the logic is stable (SEO benefit)
}

export const config = {
  matcher: [
    // Run on almost everything, but skip static & internal
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
  ],
};
