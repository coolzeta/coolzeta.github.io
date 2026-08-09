import type { Metadata } from 'next';
import { localePath } from '@/app/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale === 'zh' ? 'zh' : 'en';
  return {
    title: validLocale === 'zh' ? '下一个互动实验' : 'Next Interactive Experiment',
    alternates: {
      canonical: localePath(validLocale, '/apps/web3/dapp-2'),
      languages: {
        en: localePath('en', '/apps/web3/dapp-2'),
        zh: localePath('zh', '/apps/web3/dapp-2'),
      },
    },
  };
}

export default function DappTwoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
