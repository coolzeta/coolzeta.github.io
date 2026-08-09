'use client';

import {
  Box,
  IconButton,
  Toolbar,
  AppBar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { Home as HomeIcon, Language as LanguageIcon } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const isHomePage =
    pathname === `/${locale}` || pathname === '/' || pathname === `/en` || pathname === `/zh`;

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHome = () => router.push(`/${locale}`);

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
        position="fixed"
        color="transparent"
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: scrolled ? 'rgba(8, 11, 9, 0.74)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          transition: 'all 0.3s ease-in-out',
          borderBottom: scrolled ? '1px solid rgba(184, 255, 97, 0.12)' : 'none',
          zIndex: theme => theme.zIndex.appBar,
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1200,
            minHeight: { xs: 58, sm: 64 },
            width: '100%',
            mx: 'auto',
            px: { xs: 2, md: 3 },
          }}
        >
          {!isHomePage && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleHome}
              sx={{ mr: 2, color: 'primary.main' }}
              aria-label="go back"
            >
              <HomeIcon />
            </IconButton>
          )}

          {isHomePage && (
            <Typography
              variant="h6"
              sx={{
                mr: { xs: 1, sm: 3 },
                fontWeight: 700,
                color: '#b8ff61',
                letterSpacing: '-0.05em',
                fontFamily: 'monospace',
              }}
            >
              zeta/
            </Typography>
          )}

          <Button
            color="primary"
            onClick={() => router.push(`/${locale}/apps/blog`)}
            sx={{
              mx: { xs: 0, sm: 0.5 },
              minWidth: { xs: 56, sm: 64 },
              px: { xs: 1, sm: 1.5 },
              fontSize: { xs: '.75rem', sm: '.875rem' },
              color: 'rgba(238,244,232,.68)',
              borderRadius: '99px',
              '&:hover': {
                bgcolor: 'rgba(184,255,97,.07)',
                color: 'primary.main',
              },
            }}
          >
            {t('nav.blog')}
          </Button>

          <Button
            color="primary"
            onClick={() => router.push(`/${locale}/apps/web3`)}
            sx={{
              mx: { xs: 0, sm: 0.5 },
              minWidth: { xs: 66, sm: 80 },
              px: { xs: 1, sm: 1.5 },
              fontSize: { xs: '.75rem', sm: '.875rem' },
              color: 'rgba(238,244,232,.68)',
              borderRadius: '99px',
              '&:hover': {
                bgcolor: 'rgba(184,255,97,.07)',
                color: 'primary.main',
              },
            }}
          >
            {t('nav.playground')}
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            color="primary"
            startIcon={<LanguageIcon />}
            onClick={handleLanguageClick}
            sx={{
              minWidth: 0,
              px: { xs: 1, sm: 1.5 },
              border: '1px solid rgba(184,255,97,.14)',
              borderRadius: '99px',
              fontSize: { xs: 0, sm: '.8rem' },
              '& .MuiButton-startIcon': { mx: { xs: 0, sm: 0.5 } },
            }}
          >
            {t(`locale.${locale}`)}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleLanguageClose}>
            <MenuItem onClick={() => handleLanguageSwitch('en')} selected={locale === 'en'}>
              {t('locale.en')}
            </MenuItem>
            <MenuItem onClick={() => handleLanguageSwitch('zh')} selected={locale === 'zh'}>
              {t('locale.zh')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Toolbar spacer to prevent content from being hidden under fixed header */}
      <Toolbar />

      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
}
