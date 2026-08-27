'use client';

import DAppsList from '@/app/components/DAppsList';
import { dapps } from '@/app/config/dapps';
import { Box, Typography, Container } from '@mui/material';
import { useLocale } from 'next-intl';

export default function PlaygroundPage() {
  const locale = useLocale();
  const isZh = locale === 'zh';

  return (
    <Box className="subpage-shell lab-page">
      <Container maxWidth="lg">
        <Box className="subpage-hero">
          <Box>
            <Typography className="subpage-kicker">02 / TOOLBOX</Typography>
            <Typography component="h1">
              {isZh ? '做点真正有趣的东西。' : 'Small tools, made for real use.'}
            </Typography>
          </Box>
          <Typography className="subpage-deck">
            {isZh
              ? '这里收着我做的独立小工具：有些解决问题，有些只负责让生活更有趣。'
              : 'A growing collection of independent tools—some practical, some playful, all built to be used.'}
          </Typography>
          <Box className="subpage-count">{String(dapps.length).padStart(2, '0')} TOOLS</Box>
        </Box>
        <DAppsList />
      </Container>
    </Box>
  );
}
