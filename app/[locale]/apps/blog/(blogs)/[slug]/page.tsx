import { promises as fs } from 'fs';
import path from 'path';
import MDXContent from '@/app/components/MDXContent';
import { notFound } from 'next/navigation';
import { Box, Container } from '@mui/material';
import type { Metadata } from 'next';
import { generateBlogMetadata } from '@/app/components/BlogSEO';
import ShareButtons from '@/app/components/ShareButtons';
import { BASE_URI } from '@/app/consts/const';

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

function extractFrontMatter(content: string): { frontMatter: BlogPost; source: string } {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
        return {
            frontMatter: {
                title: '',
                description: '',
                date: '',
                tags: [],
                slug: ''
            },
            source: content
        };
    }

    const frontMatterContent = match[1];
    const source = match[2];

    // Parse YAML front matter
    const frontMatter: any = {};
    frontMatterContent.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            // Handle array values
            if (value.startsWith('[')) {
                value = value.slice(1, -1);
                frontMatter[key] = value.split(',').map((item: string) => item.trim().replace(/['"]/g, ''));
            } else {
                frontMatter[key] = value;
            }
        }
    });

    return { frontMatter, source };
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
        } catch (error) {
            console.error(`Error reading blog posts for locale ${locale}:`, error);
        }
    }

    return params;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const filePath = path.join(process.cwd(), 'content/blog', locale, `${slug}.mdx`);

    try {
        const content = await fs.readFile(filePath, 'utf8');
        const { frontMatter } = extractFrontMatter(content);

        return generateBlogMetadata({
            title: frontMatter.title || 'Blog Post',
            description: frontMatter.description || '',
            date: frontMatter.date,
            tags: frontMatter.tags || [],
            slug: frontMatter.slug || slug,
            author: frontMatter.author || 'Zeta',
            image: frontMatter.image,
            keywords: frontMatter.keywords,
        });
    } catch (error) {
        return {
            title: locale === 'zh' ? '博客文章未找到' : 'Blog Post Not Found',
            description: locale === 'zh' ? '您要查找的博客文章不存在。' : 'The blog post you are looking for does not exist.',
        };
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { locale, slug } = await params;
    const filePath = path.join(process.cwd(), 'content/blog', locale, `${slug}.mdx`);

    try {
        const content = await fs.readFile(filePath, 'utf8');
        const { source, frontMatter } = extractFrontMatter(content);

        return (
            <Container
                maxWidth="md"
                sx={{
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 3, sm: 4 },
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '100%', md: '900px' },
                    margin: '0 auto',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <MDXContent source={source} />
                    <ShareButtons title={frontMatter.title} url={`/${locale}/apps/blog/${slug}`} />
                </Box>
            </Container>
        );
    } catch (error) {
        notFound();
    }
}