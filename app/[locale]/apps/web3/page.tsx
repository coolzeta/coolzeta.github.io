'use client';

import DAppsList from '@/app/components/DAppsList';
import { Box, Typography, Container } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function Web3Page() {
  const t = useTranslations();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 30%, rgba(76, 175, 80, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(129, 199, 132, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            {t('web3.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            {t('dapps.title')}
          </Typography>
        </Box>
        <DAppsList />
      </Container>
    </Box>
  );
}
