'use client';

import { Box, IconButton, Toolbar, AppBar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Home as HomeIcon, Language as LanguageIcon } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLocale } from '@/app/contexts/LocaleProvider';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { locale, setLocale, t, loading } = useLocale();

    // 检查是否为首页 - 现在首页是 /{locale} 而不是 /
    const isHomePage = pathname === `/${locale}` || pathname === '/';
    const [isFirstPage, setIsFirstPage] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


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

    const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLanguageClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageSwitch = (newLocale: string) => {
        setLocale(newLocale);
        handleLanguageClose();
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    {!isHomePage && (
                        <>
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
                                {loading ? 'Home' : t('nav.home')}
                            </Typography>
                        </>
                    )}
                    {/* Language Switcher */}

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
                            {loading ? 'English' : t('locale.en')}
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleLanguageSwitch('zh')}
                            selected={locale === 'zh'}
                        >
                            {loading ? '中文' : t('locale.zh')}
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
