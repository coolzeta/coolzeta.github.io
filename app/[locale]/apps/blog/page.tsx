import { promises as fs } from 'fs';
import path from 'path';
import NextLink from 'next/link';
import matter from 'gray-matter';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { t } from '@/app/utils/i18n';
import type { Metadata } from 'next';

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
    const posts = await getBlogPosts(locale);
    const blogTitle = await t('blog.title', locale);

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
            <Grid sx={{
                display: 'grid',
                width: '100%',
                height: '100%',
                gap: 2,
                gridTemplateColumns: { xs: 'repeat(1 ,1fr)', sm: 'repeat(2 ,1fr)', lg: 'repeat(3 ,1fr)' },
            }}>
                {posts.map(post => (
                    <Grid key={post.slug} sx={{
                        '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s ease-in-out' }
                    }}>
                        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <NextLink
                                href={`/${locale}/apps/blog/${post.slug}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <CardContent sx={{ flexGrow: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <img
                                        src={`/images/blog/${post.slug}/cover.png`}
                                        alt={post.title}
                                        width={'100%'}
                                        height={'auto'}
                                        style={{ borderRadius: 8, marginBottom: 16 }}
                                    />

                                    <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                                        {post.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {post.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        {post.tags.map(tag => (
                                            <Chip key={tag} label={tag} size="small" />
                                        ))}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(post.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </Typography>
                                </CardContent>
                            </NextLink>
                        </Card>
                    </Grid>

                ))}
            </Grid>
        </Container >
    );
}