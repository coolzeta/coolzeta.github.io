import { promises as fs } from 'fs';
import path from 'path';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
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
    return [
        { locale: 'en' },
        { locale: 'zh' },
    ];
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const { locale } = await params;
    const title = locale === 'zh' ? '博客' : 'Blog';
    const description = locale === 'zh'
        ? 'Zeta的技术博客，分享区块链、Web3、DeFi等技术文章'
        : 'Zeta\'s tech blog, sharing articles about blockchain, Web3, DeFi and more';

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
    const blogTitle = t('blog.title');

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Typography
                variant="h2"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, #25eb28, #60a5fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {blogTitle}
            </Typography>
            <BlogGrid posts={posts} locale={locale} />
        </Container >
    );
}