'use client';

import { Container, Grid, Typography } from '@mui/material';
import BlogPostCard from '@/app/components/BlogPostCard';
import metainfos from '@/app/apps/blog/metainfos.json';
interface Post {
    title: string;
    date: string;
    description: string;
    tags: string[];
    slug: string;
}

export default function BlogHome() {
    const posts: Post[] = Object.entries(metainfos).map(([slug, meta]) => {
        console.log(slug, meta);
        return {
            title: meta.title,
            date: meta.date,
            description: meta.description,
            tags: meta.tags,
            slug: slug,
        };
    });
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography
                variant="h2"
                component="h1"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    mb: 6,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '0 2px 4px rgba(33, 150, 243, 0.1)',
                }}
            >
                博客文章
            </Typography>

            <Grid container spacing={4}>
                {posts.map((post) => (
                    <Grid item xs={12} md={6} key={post.slug}>
                        <BlogPostCard post={post} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
