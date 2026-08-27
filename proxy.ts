import createMiddleware from 'next-intl/middleware';

/**
 * Keep locale routing deterministic at the origin.
 *
 * Cloudflare and other shared caches should see a single redirect for `/`
 * (`/` -> `/en`) instead of a response that varies by Accept-Language or a
 * locale cookie. Explicit `/en` and `/zh` URLs always render directly.
 */
export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
  localeCookie: false,
  alternateLinks: true,
});

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|tools|.*\\..*).*)',
};
