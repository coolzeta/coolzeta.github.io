import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'zh'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // If invalid, default to 'en'
  const validLocale: string = locale && locales.includes(locale) ? locale : 'en';

  return {
    locale: validLocale,
    messages: (await import(`./app/locales/${validLocale}/common.json`)).default,
  };
});
