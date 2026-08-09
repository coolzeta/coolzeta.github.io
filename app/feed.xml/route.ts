import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { AUTHOR_NAME, SITE_URL, localePath } from '../seo';

export const dynamic = 'force-static';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export async function GET() {
  const posts: Array<{
    locale: string;
    slug: string;
    title: string;
    description: string;
    date: string;
  }> = [];

  for (const locale of ['en', 'zh']) {
    const directory = path.join(process.cwd(), 'content/blog', locale);
    const filenames = await fs.readdir(directory);
    for (const filename of filenames.filter(name => name.endsWith('.mdx'))) {
      const source = await fs.readFile(path.join(directory, filename), 'utf8');
      const { data } = matter(source);
      posts.push({
        locale,
        slug: filename.replace(/\.mdx$/, ''),
        title: data.title,
        description: data.description,
        date: data.date,
      });
    }
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const items = posts
    .map(post => {
      const url = localePath(post.locale, `/apps/blog/${post.slug}`);
      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <description>${escapeXml(post.description)}</description>
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  <dc:creator>${AUTHOR_NAME}</dc:creator>
  <dc:language>${post.locale}</dc:language>
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>Zeta Zhang / coolzeta</title>
  <link>${SITE_URL}</link>
  <description>Personal notes on AI agents, creative tools, onchain systems, and independent making.</description>
  <language>en</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
