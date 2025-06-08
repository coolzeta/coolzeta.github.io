'use client';

import { Box } from '@mui/material';

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
            }}
        >
            <Box
                component="main"
                sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 4, sm: 6, md: 8 },
                    width: '100%',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
