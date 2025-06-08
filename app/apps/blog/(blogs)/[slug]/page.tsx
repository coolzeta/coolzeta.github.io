import { promises as fs } from 'fs';
import path from 'path';
import MDXContent from '@/app/components/MDXContent';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'content/blog');
    const filenames = await fs.readdir(postsDirectory);

    return filenames
        .filter(filename => filename.endsWith('.mdx'))
        .map(filename => ({
            slug: filename.replace(/\.mdx$/, ''),
        }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    // Ensure params is properly awaited
    const slug = await Promise.resolve(params.slug);
    const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`);

    try {
        const source = await fs.readFile(filePath, 'utf8');
        return (
            <div className="prose prose-lg max-w-none">
                <MDXContent source={source} />
            </div>
        );
    } catch (error) {
        notFound();
    }
} 