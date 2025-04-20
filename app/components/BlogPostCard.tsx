import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import Link from 'next/link';

interface Post {
    title: string;
    date: string;
    description: string;
    tags: string[];
    slug: string;
}

interface BlogPostCardProps {
    post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
    return (
        <Link href={`/apps/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                },
                bgcolor: 'background.paper',
                borderRadius: 2,
            }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{
                        color: 'text.primary',
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                    }}>
                        {post.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {post.date}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {post.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {post.tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'common.white',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
} 