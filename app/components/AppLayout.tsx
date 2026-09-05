'use client';

import { Box, Button, Menu, MenuItem } from '@mui/material';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MotionConfig } from 'framer-motion';

export default function AppLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const home = pathname === '/' + locale;
  const switchLanguage = (language: string) => {
    router.replace(pathname.replace(/^\/(en|zh)(?=\/|$)/, '/' + language));
    setAnchor(null);
  };

  return (
    <MotionConfig reducedMotion="user">
      <Box className="site-layout">
        <a href="#main-content" className="skip-link">
          {locale === 'zh' ? '跳到正文' : 'Skip to content'}
        </a>
        <header className="site-header">
          <nav className="site-nav" aria-label={locale === 'zh' ? '主导航' : 'Main navigation'}>
            <NextLink
              href={'/' + locale}
              className="wordmark"
              aria-label={locale === 'zh' ? 'Zeta 首页' : 'Zeta home'}
            >
              zeta<span>✳</span>
            </NextLink>
            <div className="nav-links">
              <NextLink
                href={'/' + locale + '/apps/blog'}
                aria-current={pathname.includes('/apps/blog') ? 'page' : undefined}
              >
                {t('nav.blog')}
              </NextLink>
              <NextLink
                href={'/' + locale + '/apps/playground'}
                aria-current={pathname.includes('/apps/playground') ? 'page' : undefined}
              >
                {t('nav.playground')}
              </NextLink>
            </div>
            <Button
              className="language-button"
              onClick={event => setAnchor(event.currentTarget)}
              aria-haspopup="menu"
              aria-expanded={Boolean(anchor)}
              aria-label={locale === 'zh' ? '切换语言' : 'Change language'}
            >
              {locale === 'zh' ? '中文' : 'EN'} <span aria-hidden="true">⌄</span>
            </Button>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
              <MenuItem onClick={() => switchLanguage('en')} selected={locale === 'en'}>
                English
              </MenuItem>
              <MenuItem onClick={() => switchLanguage('zh')} selected={locale === 'zh'}>
                中文
              </MenuItem>
            </Menu>
          </nav>
        </header>
        <main id="main-content">{children}</main>
        {!home && (
          <footer className="inner-footer">
            <NextLink className="wordmark" href={'/' + locale}>
              zeta<span>↗</span>
            </NextLink>
            <span>© {new Date().getFullYear()} Zeta Zhang</span>
            <a href="https://github.com/coolzeta" target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </footer>
        )}
      </Box>
    </MotionConfig>
  );
}
