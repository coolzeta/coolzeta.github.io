export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zeta.lol';
export const SITE_NAME = 'Zeta Zhang / coolzeta';
export const AUTHOR_NAME = 'Zeta Zhang';
export const AUTHOR_ID = `${SITE_URL}/#zeta-zhang`;

export const SOCIAL_LINKS = [
  'https://github.com/coolzeta',
  'https://www.linkedin.com/in/zeta-zhang-98065334b/',
];

export const localePath = (locale: string, path = '') => `${SITE_URL}/${locale}${path}`;

export const safeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
