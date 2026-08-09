import type { Metadata } from 'next';
import { AUTHOR_NAME, SITE_NAME, SITE_URL, localePath } from '@/app/seo';

interface BlogSEOProps {
  title: string;
  description: string;
  date?: string;
  tags?: string[];
  slug: string;
  author?: string;
  image?: string;
  keywords?: string;
  locale: string;
}

export function generateBlogMetadata({
  title,
  description,
  date,
  tags = [],
  slug,
  author = AUTHOR_NAME,
  image,
  keywords,
  locale,
}: BlogSEOProps): Metadata {
  const validLocale = locale === 'zh' ? 'zh' : 'en';
  const alternateLocale = validLocale === 'zh' ? 'en' : 'zh';
  const articleUrl = localePath(validLocale, `/apps/blog/${slug}`);
  const imageUrl = image ? `${SITE_URL}${image}` : `${SITE_URL}/og.png`;
  const finalKeywords = keywords || tags.join(', ');

  return {
    title,
    description,
    keywords: finalKeywords,
    authors: [{ name: author, url: SITE_URL }],
    creator: author,
    publisher: author,
    openGraph: {
      title,
      description,
      type: 'article',
      url: articleUrl,
      locale: validLocale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: [validLocale === 'zh' ? 'en_US' : 'zh_CN'],
      publishedTime: date,
      authors: [author],
      tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@coolzeta',
    },
    alternates: {
      canonical: articleUrl,
      languages: {
        [validLocale]: articleUrl,
        [alternateLocale]: localePath(alternateLocale, `/apps/blog/${slug}`),
        'x-default': localePath('en', `/apps/blog/${slug}`),
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
  };
}
