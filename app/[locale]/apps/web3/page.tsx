'use client';

import DAppsList from '@/app/components/DAppsList';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function Web3Page() {
  const t = useTranslations();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="h1" sx={{ textAlign: 'center', color: 'primary.main' }}>
        {t('web3.title')}
      </Typography>
      <DAppsList />
    </Box>
  );
}
