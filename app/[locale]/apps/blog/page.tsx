import { promises as fs } from 'fs';
import path from 'path';
import { Box, Container, Typography } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import BlogGrid from '@/app/components/BlogGrid';
import matter from 'gray-matter';
import { SITE_NAME, localePath } from '@/app/seo';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 86400;

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'content/blog', locale);
  try {
    const filenames = await fs.readdir(postsDirectory);
    const posts = await Promise.all(
      filenames
        .filter(filename => filename.endsWith('.mdx'))
        .map(async filename => {
          const fileContents = await fs.readFile(path.join(postsDirectory, filename), 'utf8');
          const { data } = matter(fileContents);
          return {
            slug: filename.replace(/\.mdx$/, ''),
            title: data.title,
            description: data.description,
            date: data.date,
            tags: data.tags,
          };
        })
    );
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error reading blog posts for locale ${locale}:`, error);
    return [];
  }
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale === 'zh' ? 'zh' : 'en';
  const title = validLocale === 'zh' ? 'Zeta Zhang 的笔记' : 'Notes by Zeta Zhang';
  const description =
    validLocale === 'zh'
      ? 'Zeta Zhang 关于 AI Agent、链上系统、创作工具与独立开发的个人笔记。'
      : 'Personal notes by Zeta Zhang on AI agents, onchain systems, creative tools, and independent making.';
  return {
    title,
    description,
    alternates: {
      canonical: localePath(validLocale, '/apps/blog'),
      languages: {
        en: localePath('en', '/apps/blog'),
        zh: localePath('zh', '/apps/blog'),
        'x-default': localePath('en', '/apps/blog'),
      },
    },
    openGraph: {
      title,
      description,
      url: localePath(validLocale, '/apps/blog'),
      siteName: SITE_NAME,
      locale: validLocale === 'zh' ? 'zh_CN' : 'en_US',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = await getBlogPosts(locale);

  return (
    <Box className="subpage-shell">
      <Container maxWidth="lg">
        <Box className="subpage-hero">
          <Box>
            <Typography className="subpage-kicker">01 / JOURNAL</Typography>
            <Typography component="h1">
              {locale === 'zh' ? '随手记下的东西。' : 'Things worth noting.'}
            </Typography>
          </Box>
          <Typography className="subpage-deck">
            {locale === 'zh'
              ? '关于 AI、链上世界、创作工具，以及那些值得多想一会儿的小事。'
              : 'Notes on AI, onchain systems, creative tools, and small things worth thinking about.'}
          </Typography>
          <Box className="subpage-count">{String(posts.length).padStart(2, '0')} NOTES</Box>
        </Box>
        <BlogGrid posts={posts} locale={locale} />
      </Container>
    </Box>
  );
}
