import type { Metadata } from 'next';
import './globals.css';
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from './seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Zeta Zhang — Notes, Tools & Experiments',
    template: `%s | ${AUTHOR_NAME}`,
  },
  description:
    'The personal website of Zeta Zhang (coolzeta), an independent maker in Hong Kong building AI tools, interactive learning experiments, and onchain products.',
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  keywords: [
    'Zeta',
    'Zeta Zhang',
    'coolzeta',
    'Hong Kong developer',
    'independent maker',
    'AI agent',
    'PrompterOne',
    'Mechanism Lab',
  ],
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  alternates: {
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'Zeta Zhang — Notes, Tools & Experiments',
    description:
      'Personal notes, useful tools, and interactive experiments by Zeta Zhang in Hong Kong.',
    url: SITE_URL,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Zeta — Notes from Hong Kong' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeta Zhang — Notes, Tools & Experiments',
    description:
      'Personal notes, useful tools, and interactive experiments by Zeta Zhang in Hong Kong.',
    creator: '@coolzeta',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
