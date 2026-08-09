import type { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { SITE_URL, localePath } from './seo';

const localizedEntry = (
  route: string,
  options: Pick<MetadataRoute.Sitemap[number], 'changeFrequency' | 'priority' | 'lastModified'>
): MetadataRoute.Sitemap[number] => ({
  url: localePath('en', route),
  alternates: {
    languages: {
      en: localePath('en', route),
      zh: localePath('zh', route),
    },
  },
  ...options,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    localizedEntry('', { changeFrequency: 'weekly', priority: 1, lastModified: new Date() }),
    localizedEntry('/apps/blog', {
      changeFrequency: 'weekly',
      priority: 0.9,
      lastModified: new Date(),
    }),
    localizedEntry('/apps/web3', {
      changeFrequency: 'monthly',
      priority: 0.7,
      lastModified: new Date(),
    }),
    localizedEntry('/apps/web3/dapp-1', {
      changeFrequency: 'monthly',
      priority: 0.5,
      lastModified: new Date(),
    }),
    localizedEntry('/apps/web3/dapp-2', {
      changeFrequency: 'monthly',
      priority: 0.4,
      lastModified: new Date(),
    }),
  ];

  const postsDirectory = path.join(process.cwd(), 'content/blog/en');
  const filenames = await fs.readdir(postsDirectory);

  for (const filename of filenames.filter(name => name.endsWith('.mdx'))) {
    const slug = filename.replace(/\.mdx$/, '');
    const source = await fs.readFile(path.join(postsDirectory, filename), 'utf8');
    const { data } = matter(source);
    entries.push(
      localizedEntry(`/apps/blog/${slug}`, {
        changeFrequency: 'monthly',
        priority: 0.8,
        lastModified: data.date ? new Date(data.date) : new Date(),
      })
    );
  }

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 0.8, lastModified: new Date() },
    ...entries,
    ...entries.map(entry => ({
      ...entry,
      url: entry.url.replace('/en', '/zh'),
    })),
  ];
}
