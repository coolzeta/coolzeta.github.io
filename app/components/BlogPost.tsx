import { Box, Container, Typography } from '@mui/material';

interface BlogPostProps {
    children: React.ReactNode;
}

export default function BlogPost({ children }: BlogPostProps) {
    return (
        <Container maxWidth="lg" sx={{
            py: 4,
            m: 0,
        }}>
            <Box sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                p: { xs: 2, md: 4 },
                boxShadow: 1,
            }}>
                <Box className="content" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    '& chart': {
                        width: '100%',
                        height: 'auto',
                        alignSelf: 'center',
                    },
                    '& h1': {
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 800,
                        mb: 4,
                        color: 'text.primary',
                    },
                    '& h2': {
                        fontSize: { xs: '1.75rem', md: '2rem' },
                        fontWeight: 700,
                        mt: 6,
                        mb: 3,
                        color: 'text.primary',
                        position: 'relative',
                        pb: 2,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '40px',
                            height: '4px',
                            bgcolor: 'primary.main',
                            borderRadius: '2px',
                        },
                    },
                    '& h3': {
                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                        fontWeight: 600,
                        mt: 4,
                        mb: 2,
                        color: 'text.primary',
                    },
                    '& p': {
                        mb: 3,
                        lineHeight: 1.8,
                        color: 'text.secondary',
                        fontSize: { xs: '1rem', md: '1.125rem' },
                    },
                    '& a': {
                        color: 'primary.main',
                        textDecoration: 'none',
                        borderBottom: '2px solid transparent',
                        transition: 'border-color 0.2s ease',
                        '&:hover': {
                            borderColor: 'primary.main',
                        },
                    },
                    '& ul, & ol': {
                        pl: 0,
                        my: 3,
                        listStyle: 'none',
                    },
                    '& ul li, & ol li': {
                        position: 'relative',
                        pl: 4,
                        mb: 2,
                        color: 'text.secondary',
                        '&::before': {
                            position: 'absolute',
                            left: 0,
                        },
                    },
                    '& ul li::before': {
                        content: '"•"',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                    },
                    '& ol': {
                        counterReset: 'list-counter',
                        '& li': {
                            counterIncrement: 'list-counter',
                            '&::before': {
                                content: 'counter(list-counter)',
                                color: 'primary.main',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                            },
                        },
                    },
                    '& code': {
                        bgcolor: 'grey.100',
                        color: 'primary.main',
                        p: '0.2em 0.4em',
                        borderRadius: 1,
                        fontSize: '0.875em',
                        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                    },
                    '& pre': {
                        bgcolor: 'grey.900',
                        color: 'common.white',
                        p: 3,
                        borderRadius: 2,
                        overflow: 'auto',
                        my: 4,
                        border: 1,
                        borderColor: 'grey.800',
                        '& code': {
                            bgcolor: 'transparent',
                            color: 'inherit',
                            p: 0,
                            fontSize: '0.9em',
                            lineHeight: 1.7,
                        },
                    },
                    '& blockquote': {
                        borderLeft: 4,
                        borderColor: 'primary.main',
                        pl: 3,
                        my: 4,
                        color: 'text.primary',
                        fontStyle: 'italic',
                        bgcolor: 'grey.900',
                        p: 3,
                        '& p': {
                            color: 'primary.dark',
                        },
                        borderRadius: '0 2px 2px 0',
                    },
                    '& img': {
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        my: 4,
                    },
                    '& hr': {
                        border: 'none',
                        height: '2px',
                        bgcolor: 'grey.200',
                        my: 6,
                    },
                    '& table': {
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        my: 4,
                        overflowX: 'scroll',
                        '& th, & td': {
                            border: 1,
                            borderColor: 'grey.300',
                            p: 2,
                            color: 'text.secondary',
                        },
                        '& th': {
                            bgcolor: 'grey.900',
                            color: 'primary.dark',
                            fontWeight: 600,
                            textAlign: 'left',
                        },
                    },
                }}>
                    {children}
                </Box>
            </Box>
        </Container>
    );
} 