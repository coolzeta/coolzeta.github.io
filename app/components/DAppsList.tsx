'use client';

import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { DApp, dapps } from '../config/dapps';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const statusColors = {
  live: 'success',
  beta: 'warning',
  development: 'info',
} as const;

export default function DAppsList() {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();

  const handleCardClick = (dapp: DApp) => {
    router.push(`/${locale}${dapp.url}`);
  };

  return (
    <Box sx={{ py: 4, px: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {dapps.map((dapp: DApp, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={dapp.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              style={{ height: '100%' }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background:
                    'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(76, 175, 80, 0.3)',
                    border: '1px solid rgba(76, 175, 80, 0.4)',
                  },
                }}
                onClick={() => handleCardClick(dapp)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover img': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Image
                    src={dapp.imageUrl}
                    alt={t(dapp.nameKey)}
                    width={800}
                    height={600}
                    layout="responsive"
                    priority={index <= 5}
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                    }}
                  >
                    <Chip
                      label={t(`dapp.status.${dapp.status}`)}
                      color={statusColors[dapp.status]}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <RocketLaunchIcon sx={{ fontSize: 20 }} />
                      {t(dapp.nameKey)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {t(dapp.descriptionKey)}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {dapp.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={t(`dapp.tags.${tag}`)}
                        size="small"
                        sx={{
                          background: 'rgba(76, 175, 80, 0.1)',
                          border: '1px solid rgba(76, 175, 80, 0.3)',
                          color: 'primary.main',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
