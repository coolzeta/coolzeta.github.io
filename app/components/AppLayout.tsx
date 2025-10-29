'use client';

import { Box, IconButton, Toolbar, AppBar, Typography } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const [isFirstPage, setIsFirstPage] = useState(false);


    const getDomain = (url: string): string => {
        try {
            const urlObj = new URL(url);
            return urlObj.origin;
        } catch {
            return '';
        }
    };

    const isSameDomain = (url: string, currentOrigin: string): boolean => {
        const referrerDomain = getDomain(url);
        return referrerDomain !== '' && referrerDomain === currentOrigin;
    };

    const handleBack = () => {
        if (isFirstPage && window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {!isHomePage && (
                <AppBar position="static" color="default" elevation={1}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleBack}
                            sx={{ mr: 2 }}
                            aria-label="go back"
                        >
                            <HomeIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Home
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}
            <Box sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    );
}
