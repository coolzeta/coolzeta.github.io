import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../contexts/ThemeProvider';
import AppLayout from '../components/AppLayout';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

const locales = ['en', 'zh'];

export const metadata: Metadata = {
  title: 'Zeta / Notes from Hong Kong',
  description: 'Personal notes on code, AI, Web3, design, and everything in between.',
  icons: {
    icon: [{ url: '/favicon.ico' }],
  },
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
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
