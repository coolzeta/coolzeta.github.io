'use client';

import { Box, Typography, IconButton, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function SponsorSection() {
  const t = useTranslations();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const ethAddress = '0x4e92d2fa9a25fa503bdf01f453aa3248a9f1ee76';

  const handleCopy = () => {
    navigator.clipboard.writeText(ethAddress);
    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 4, md: 6 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            background: 'rgba(76, 175, 80, 0.05)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}
        >
          {/* Title with Icon */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}
          >
            <FavoriteIcon sx={{ color: 'primary.main', fontSize: 24 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              {t('home.sponsor.title')}
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            {t('home.sponsor.description')}
          </Typography>

          {/* Address */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              background: 'rgba(0, 0, 0, 0.3)',
              px: 2,
              py: 1,
              borderRadius: 2,
              border: '1px solid rgba(76, 175, 80, 0.3)',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: { xs: '0.7rem', sm: '0.85rem' },
                color: 'primary.main',
                wordBreak: 'break-all',
              }}
            >
              {ethAddress}
            </Typography>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  background: 'rgba(76, 175, 80, 0.1)',
                },
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </motion.div>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message={t('home.sponsor.copied')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            color: '#fff',
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
}
