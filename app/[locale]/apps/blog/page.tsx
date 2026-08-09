import { promises as fs } from 'fs';
import path from 'path';
import { Box, Container, Typography } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import BlogGrid from '@/app/components/BlogGrid';
import matter from 'gray-matter';

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
  return {
    title: locale === 'zh' ? '笔记 / Zeta' : 'Notes / Zeta',
    description:
      locale === 'zh'
        ? '关于 AI、链上世界、创作工具和正在发生的事。'
        : 'Notes on AI, onchain systems, creative tools, and things in progress.',
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
