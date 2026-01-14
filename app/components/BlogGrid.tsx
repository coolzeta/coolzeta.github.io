'use client';

import NextLink from 'next/link';
import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import ScrollReveal from '@/app/components/ScrollReveal';

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
}

interface BlogGridProps {
    posts: BlogPost[];
    locale: string;
}

export default function BlogGrid({ posts, locale }: BlogGridProps) {
    return (
        <Grid sx={{
            display: 'grid',
            width: '100%',
            height: '100%',
            gap: 2,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        }}>
            {posts.map((post, index) => (
                <ScrollReveal
                    key={post.slug}
                    delay={index * 0.1}
                    direction="up"
                    distance={50}
                >
                    <Grid sx={{
                        height: '100%',
                        '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s ease-in-out' }
                    }}>
                        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <NextLink
                                href={`/${locale}/apps/blog/${post.slug}`}
                                style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <Box
                                    component="img"
                                    src={`/images/blog/${post.slug}/cover.png`}
                                    alt={post.title}
                                    sx={{
                                        width: '100%',
                                        height: 200,
                                        objectFit: 'cover',
                                        borderRadius: '16px 16px 0 0',
                                        border: '8px solid',
                                        borderColor: 'background.paper',
                                        borderBottom: 'none'
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                                        {post.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                                        {post.description}
                                    </Typography>
                                    
                                    <Box sx={{ mt: 'auto' }}>
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
                                    </Box>
                                </CardContent>
                            </NextLink>
                        </Card>
                    </Grid>
                </ScrollReveal>
            ))}
        </Grid>
    );
}
