import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
}

async function getBlogPosts(): Promise<BlogPost[]> {
    const postsDirectory = path.join(process.cwd(), 'content/blog');
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
}

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Blog Posts
            </h1>
            <div className="grid gap-8">
                {posts.map(post => (
                    <article
                        key={post.slug}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                        <Link
                            href={`/blog/${post.slug}`}
                            className="block hover:no-underline"
                        >
                            <h2 className="text-2xl font-bold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                                {post.title}
                            </h2>
                        </Link>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            {post.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <time className="text-gray-500 text-sm">
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </article>
                ))}
            </div>
        </div>
    );
}
