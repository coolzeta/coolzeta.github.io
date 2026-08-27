import type { Metadata } from 'next';
import { SITE_NAME, localePath } from '@/app/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale === 'zh' ? 'zh' : 'en';
  const title = validLocale === 'zh' ? 'Playground 工具箱 / Zeta Zhang' : 'Playground / Zeta Zhang';
  const description =
    validLocale === 'zh'
      ? 'Zeta Zhang 制作的独立小工具与互动实验：解决真实问题，也探索有趣的想法。'
      : 'Independent tools and interactive experiments by Zeta Zhang—made to solve real problems and explore playful ideas.';

  return {
    title,
    description,
    alternates: {
      canonical: localePath(validLocale, '/apps/playground'),
      languages: {
        en: localePath('en', '/apps/playground'),
        zh: localePath('zh', '/apps/playground'),
        'x-default': localePath('en', '/apps/playground'),
      },
    },
    openGraph: {
      title,
      description,
      url: localePath(validLocale, '/apps/playground'),
      siteName: SITE_NAME,
      locale: validLocale === 'zh' ? 'zh_CN' : 'en_US',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: title }],
    },
  };
}

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
