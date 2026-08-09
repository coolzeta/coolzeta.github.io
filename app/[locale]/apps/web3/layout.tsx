import type { Metadata } from 'next';
import { SITE_NAME, localePath } from '@/app/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale === 'zh' ? 'zh' : 'en';
  const title = validLocale === 'zh' ? '互动实验 / Zeta Zhang' : 'Interactive Labs / Zeta Zhang';
  const description =
    validLocale === 'zh'
      ? 'Zeta Zhang 制作的链上机制与互动学习实验。通过动手操作理解复杂系统。'
      : 'Interactive learning experiments by Zeta Zhang for understanding onchain mechanisms and complex systems by doing.';

  return {
    title,
    description,
    alternates: {
      canonical: localePath(validLocale, '/apps/web3'),
      languages: {
        en: localePath('en', '/apps/web3'),
        zh: localePath('zh', '/apps/web3'),
        'x-default': localePath('en', '/apps/web3'),
      },
    },
    openGraph: {
      title,
      description,
      url: localePath(validLocale, '/apps/web3'),
      siteName: SITE_NAME,
      locale: validLocale === 'zh' ? 'zh_CN' : 'en_US',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: title }],
    },
  };
}

export default function Web3SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
