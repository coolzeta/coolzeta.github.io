import type { Metadata } from 'next';

interface BlogSEOProps {
    title: string;
    description: string;
    date?: string;
    tags?: string[];
    slug: string;
    author?: string;
    image?: string;
    keywords?: string;
}

export function generateBlogMetadata({
    title,
    description,
    date,
    tags = [],
    slug,
    author = 'Zeta',
    image,
    keywords,
}: BlogSEOProps): Metadata {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coolzeta.github.io';
    const imageUrl = image ? `${siteUrl}${image}` : `${siteUrl}/og-image.png`;
    const finalKeywords = keywords || tags.join(', ');

    return {
        title,
        description,
        keywords: finalKeywords,
        authors: [{ name: author }],
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: date,
            authors: [author],
            tags: tags,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            siteName: "Zeta's Secret Base",
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
            creator: '@coolzeta',
        },
        alternates: {
            canonical: `${siteUrl}/apps/blog/${slug}`,
        },
    };
}
