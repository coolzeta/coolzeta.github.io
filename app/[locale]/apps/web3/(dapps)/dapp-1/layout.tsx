import type { Metadata } from 'next';
import { localePath } from '@/app/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale === 'zh' ? 'zh' : 'en';
  const title =
    validLocale === 'zh' ? 'ZetaCoin 稳定币机制实验' : 'ZetaCoin Stablecoin Mechanism Lab';
  const description =
    validLocale === 'zh'
      ? '通过存入 ETH、借出 ZETA 和观察抵押率，动手理解抵押稳定币与清算机制。'
      : 'Understand collateralized stablecoins by depositing ETH, borrowing ZETA, and observing collateral and liquidation mechanics.';
  return {
    title,
    description,
    keywords: [
      'ZetaCoin',
      'stablecoin mechanism',
      'DeFi learning',
      'collateralized lending',
      'Zeta Zhang',
    ],
    alternates: {
      canonical: localePath(validLocale, '/apps/web3/dapp-1'),
      languages: {
        en: localePath('en', '/apps/web3/dapp-1'),
        zh: localePath('zh', '/apps/web3/dapp-1'),
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: localePath(validLocale, '/apps/web3/dapp-1'),
      locale: validLocale === 'zh' ? 'zh_CN' : 'en_US',
      images: [{ url: '/covers/cover1.png', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/covers/cover1.png'],
    },
  };
}

export default function DappOneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
