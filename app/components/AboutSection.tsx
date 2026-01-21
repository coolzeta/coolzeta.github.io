'use client';

import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const interests = [
  { emoji: '🔗', labelKey: 'home.about.interests.blockchain' },
  { emoji: '🤖', labelKey: 'home.about.interests.ai' },
  { emoji: '💻', labelKey: 'home.about.interests.frontend' },
  { emoji: '🎨', labelKey: 'home.about.interests.design' },
  { emoji: '🧠', labelKey: 'home.about.interests.learning' },
];

const stats = [
  { valueKey: 'home.about.stats.experience.value', labelKey: 'home.about.stats.experience.label' },
  { valueKey: 'home.about.stats.projects.value', labelKey: 'home.about.stats.projects.label' },
  {
    valueKey: 'home.about.stats.technologies.value',
    labelKey: 'home.about.stats.technologies.label',
  },
];

export default function AboutSection() {
  const t = useTranslations();

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 6, md: 10 },
      }}
    >
      {/* Floating background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(76, 175, 80, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            background:
              'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(18, 18, 18, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #4caf50 0%, #81c784 50%, #4caf50 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '200% 0' },
                '100%': { backgroundPosition: '-200% 0' },
              },
            },
          }}
        >
          {/* About Me Content */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                mb: 3,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('home.about.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                mb: 3,
              }}
            >
              {t('home.about.description')}
            </Typography>
          </Box>

          {/* Stats Section */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ mb: 4 }}
            justifyContent="space-around"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(76, 175, 80, 0.15)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 24px rgba(76, 175, 80, 0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      mb: 1,
                    }}
                  >
                    {t(stat.valueKey)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t(stat.labelKey)}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Stack>

          {/* Interests Tags */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: 'primary.main',
                fontWeight: 'bold',
              }}
            >
              {t('home.about.interests.title')}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {interests.map((interest, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Chip
                    icon={
                      <span style={{ fontSize: '1.2rem', marginLeft: '8px' }}>
                        {interest.emoji}
                      </span>
                    }
                    label={t(interest.labelKey)}
                    sx={{
                      py: 2.5,
                      px: 1,
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      background:
                        'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      color: 'primary.main',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.2) 100%)',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                      },
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
