'use client';

import DAppsList from '@/app/components/DAppsList';
import { Box, Typography, Container } from '@mui/material';
import { useLocale } from 'next-intl';

export default function Web3Page() {
  const locale = useLocale();
  const isZh = locale === 'zh';

  return (
    <Box className="subpage-shell lab-page">
      <Container maxWidth="lg">
        <Box className="subpage-hero">
          <Box>
            <Typography className="subpage-kicker">02 / PLAYGROUND</Typography>
            <Typography component="h1">
              {isZh ? '动手理解系统。' : 'Systems, made tangible.'}
            </Typography>
          </Box>
          <Typography className="subpage-deck">
            {isZh
              ? '这里不是产品陈列柜，而是可以触摸、试错和拆解机制的实验桌。'
              : 'Not a product showcase—a workbench for touching, testing, and taking systems apart.'}
          </Typography>
          <Box className="subpage-count">02 EXPERIMENTS</Box>
        </Box>
        <DAppsList />
      </Container>
    </Box>
  );
}
