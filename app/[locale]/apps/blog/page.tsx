import { promises as fs } from 'fs';
import path from 'path';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import BlogGrid from '@/app/components/BlogGrid';
import matter from 'gray-matter';

// Force static generation at build time
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
  params: Promise<{
    locale: string;
  }>;
}

async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'content/blog', locale);

  try {
    const filenames = await fs.readdir(postsDirectory);

    const posts = await Promise.all(
      filenames
        .filter(filename => filename.endsWith('.mdx'))
        .map(async filename => {
          const filePath = path.join(postsDirectory, filename);
          const fileContents = await fs.readFile(filePath, 'utf8');
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
  const title = locale === 'zh' ? '博客' : 'Blog';
  const description =
    locale === 'zh'
      ? 'Zeta的技术博客，分享区块链、Web3、DeFi等技术文章'
      : "Zeta's tech blog, sharing articles about blockchain, Web3, DeFi and more";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = await getBlogPosts(locale);
  const t = await getTranslations();
  const blogTitle = t('blog.title'); // 这应该会fallback到英文

  // 临时解决方案：直接根据locale选择
  const actualTitle = locale === 'zh' ? '博客文章' : 'Blog Posts';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 30%, rgba(76, 175, 80, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(129, 199, 132, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            {actualTitle}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            {locale === 'zh'
              ? '探索Web3、区块链和前端开发的技术世界'
              : 'Exploring the world of Web3, blockchain and frontend development'}
          </Typography>
        </Box>
        <BlogGrid posts={posts} locale={locale} />
      </Container>
    </Box>
  );
}
