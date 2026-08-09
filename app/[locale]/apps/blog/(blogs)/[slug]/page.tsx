import { promises as fs } from 'fs';
import path from 'path';
import MDXServerContent from '@/app/components/MDXServerContent';

import { notFound } from 'next/navigation';
import { Box, Chip, Container, Typography } from '@mui/material';

import type { Metadata } from 'next';
import { generateBlogMetadata } from '@/app/components/BlogSEO';
import ShareButtons from '@/app/components/ShareButtons';
import { setRequestLocale } from 'next-intl/server';
import matter from 'gray-matter';

// Force static generation at build time
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 86400;

interface BlogPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

interface BlogPost {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  author?: string;
  image?: string;
  keywords?: string;
}

async function getBlogPost(
  locale: string,
  slug: string
): Promise<{ frontMatter: BlogPost; source: string } | null> {
  const filePath = path.join(process.cwd(), 'content/blog', locale, `${slug}.mdx`);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const { data, content: source } = matter(content);
    return { frontMatter: data as BlogPost, source };
  } catch (error) {
    console.error(`Error reading blog post ${locale}/${slug}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  const locales = ['en', 'zh'];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const postsDirectory = path.join(process.cwd(), 'content/blog', locale);
    try {
      const filenames = await fs.readdir(postsDirectory);
      const localeParams = filenames
        .filter(filename => filename.endsWith('.mdx'))
        .map(filename => ({
          locale,
          slug: filename.replace(/\.mdx$/, ''),
        }));
      params.push(...localeParams);

      // Pre-populate cache during build time
      for (const param of localeParams) {
        await getBlogPost(param.locale, param.slug);
      }
    } catch (error) {
      console.error(`Error reading blog posts for locale ${locale}:`, error);
    }
  }

  console.log(`Generated ${params.length} static blog post paths for SSG`);
  return params;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const blogPost = await getBlogPost(locale, slug);

  if (!blogPost) {
    return {
      title: locale === 'zh' ? '博客文章未找到' : 'Blog Post Not Found',
      description:
        locale === 'zh'
          ? '您要查找的博客文章不存在。'
          : 'The blog post you are looking for does not exist.',
    };
  }

  return generateBlogMetadata({
    title: blogPost.frontMatter.title || 'Blog Post',
    description: blogPost.frontMatter.description || '',
    date: blogPost.frontMatter.date,
    tags: blogPost.frontMatter.tags || [],
    slug: blogPost.frontMatter.slug || slug,
    author: blogPost.frontMatter.author || 'Zeta',
    image: blogPost.frontMatter.image,
    keywords: blogPost.frontMatter.keywords,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const blogPost = await getBlogPost(locale, slug);

  if (!blogPost) {
    notFound();
  }

  const { source, frontMatter } = blogPost;

  return (
    <Box className="article-shell">
      <Container maxWidth="lg">
        <Box className="article-hero">
          <Box className="article-meta">
            <span>JOURNAL / {frontMatter.date?.replaceAll('-', '.')}</span>
            <span>{locale === 'zh' ? '阅读笔记' : 'FIELD NOTE'}</span>
          </Box>
          <Typography component="h1">{frontMatter.title}</Typography>
          <Typography className="article-description">{frontMatter.description}</Typography>
          <Box className="article-tags">
            {Array.isArray(frontMatter.tags) &&
              frontMatter.tags.map(tag => <Chip key={tag} label={tag} size="small" />)}
          </Box>
        </Box>

        {frontMatter.image && (
          <Box className="article-cover-wrap">
            <Box component="img" src={frontMatter.image} alt="" className="article-cover" />
            <Box className="article-cover-label">ZETA / NOTE</Box>
          </Box>
        )}

        <Box className="article-grid">
          <Box className="article-rail">
            <span>{frontMatter.author || 'ZETA'}</span>
            <i />
            <span>{frontMatter.date}</span>
          </Box>
          <Box className="article-body">
            <MDXServerContent source={source} />
            <ShareButtons title={frontMatter.title} url={`/${locale}/apps/blog/${slug}`} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
