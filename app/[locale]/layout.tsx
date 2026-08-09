import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../contexts/ThemeProvider';
import AppLayout from '../components/AppLayout';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { AUTHOR_NAME, SITE_NAME, SITE_URL, localePath } from '../seo';

const inter = Inter({ subsets: ['latin'] });

const locales = ['en', 'zh'];

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale === 'zh' ? 'zh' : 'en';
  const isZh = validLocale === 'zh';
  const title = isZh
    ? 'Zeta Zhang（coolzeta）— 香港独立开发者'
    : 'Zeta Zhang (coolzeta) — Independent Maker in Hong Kong';
  const description = isZh
    ? 'Zeta Zhang（coolzeta）的个人网站：记录 AI、创作工具、链上机制与正在制作的互动实验。'
    : 'The personal website of Zeta Zhang (coolzeta): notes on AI, creative tools, onchain systems, and interactive experiments in progress.';

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: localePath(validLocale),
      types: {
        'application/rss+xml': `${SITE_URL}/feed.xml`,
      },
      languages: {
        en: localePath('en'),
        zh: localePath('zh'),
        'x-default': localePath('en'),
      },
    },
    openGraph: {
      title,
      description,
      url: localePath(validLocale),
      siteName: SITE_NAME,
      locale: isZh ? 'zh_CN' : 'en_US',
      alternateLocale: isZh ? ['en_US'] : ['zh_CN'],
      images: [{ url: '/og.png', width: 1200, height: 630, alt: title }],
    },
    authors: [{ name: AUTHOR_NAME }],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale - default to 'en' if invalid
  const validLocale = locales.includes(locale) ? locale : 'en';

  // Enable static rendering
  setRequestLocale(validLocale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale: validLocale });

  return (
    <html lang={validLocale}>
      <body className={inter.className} style={{ minHeight: '100vh', minWidth: '100%' }}>
        <NextIntlClientProvider messages={messages} locale={validLocale}>
          <ThemeProvider>
            <AppLayout locale={validLocale}>{children}</AppLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
