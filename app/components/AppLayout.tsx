'use client';

import { Box, IconButton, Toolbar, AppBar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Home as HomeIcon, Language as LanguageIcon } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface AppLayoutProps {
    children: React.ReactNode;
    locale: string;
}

export default function AppLayout({ children, locale }: AppLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isHomePage = pathname === `/${locale}` || pathname === '/' || pathname === `/en` || pathname === `/zh`;

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(`/${locale}`);
        }
    };

    const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLanguageClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageSwitch = (newLocale: string) => {
        const currentPath = pathname;
        let newPath;

        if (currentPath === '/') {
            newPath = `/${newLocale}`;
        } else if (currentPath.startsWith('/en') || currentPath.startsWith('/zh')) {
            newPath = currentPath.replace(/^\/(en|zh)/, `/${newLocale}`);
        } else {
            newPath = `/${newLocale}`;
        }

        router.replace(newPath);
        handleLanguageClose();
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar
                position="static"
                color="default"
                elevation={1}
                sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                }}
            >
                <Toolbar>
                    {!isHomePage && (
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleBack}
                                sx={{ mr: 2, color: 'primary.main' }}
                                aria-label="go back"
                            >
                                <HomeIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                {t('nav.home')}
                            </Typography>
                        </>
                    )}
                    {isHomePage && (
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {t('nav.home')}
                        </Typography>
                    )}

                    <Button
                        color="primary"
                        startIcon={<LanguageIcon />}
                        onClick={handleLanguageClick}
                    >
                        {t(`locale.${locale}`)}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleLanguageClose}
                    >
                        <MenuItem
                            onClick={() => handleLanguageSwitch('en')}
                            selected={locale === 'en'}
                        >
                            {t('locale.en')}
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleLanguageSwitch('zh')}
                            selected={locale === 'zh'}
                        >
                            {t('locale.zh')}
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    );
}
