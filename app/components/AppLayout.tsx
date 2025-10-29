'use client';

import { Box, IconButton, Toolbar, AppBar, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [canGoBack, setCanGoBack] = useState(false);

    // Check if we're on the home page
    const isHomePage = pathname === '/';

    useEffect(() => {
        // Check if there's history to go back to
        setCanGoBack(window.history.length > 1);
    }, [pathname]);

    const handleBack = () => {
        if (canGoBack) {
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
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Back
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
