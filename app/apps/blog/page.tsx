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
import Link from '@mui/material/Link';
import { BASE_URI } from '@/app/consts/const';

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
                Blog Posts
            </Typography>
            <Grid sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                width: '100%',
                height: '100%',
            }}>
                {posts.map(post => (
                    <Grid key={post.slug} sx={{
                        width: { xs: '100%', sm: '50%', md: '33.33%' },
                        '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s ease-in-out' }
                    }}>
                        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Link
                                component={NextLink}
                                href={`/apps/blog/${post.slug}`}
                                underline="none"
                                color="inherit"

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
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </Card>
                    </Grid>

                ))}
            </Grid>
        </Container >
    );
}