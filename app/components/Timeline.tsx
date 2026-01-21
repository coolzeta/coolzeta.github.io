'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TimelineItem {
  year: string;
  titleKey: string;
  descriptionKey: string;
}

export default function Timeline() {
  const t = useTranslations();

  const timelineData: TimelineItem[] = [
    {
      year: '2019',
      titleKey: 'home.timeline.2019.title',
      descriptionKey: 'home.timeline.2019.description',
    },
    {
      year: '2021',
      titleKey: 'home.timeline.2021.title',
      descriptionKey: 'home.timeline.2021.description',
    },
    {
      year: '2023',
      titleKey: 'home.timeline.2023.title',
      descriptionKey: 'home.timeline.2023.description',
    },
    {
      year: '2025',
      titleKey: 'home.timeline.2025.title',
      descriptionKey: 'home.timeline.2025.description',
    },
  ];

  return (
    <Box sx={{ position: 'relative', py: 4 }}>
      {/* Timeline line */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: '20px', md: '50%' },
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, transparent, #4caf50, transparent)',
        }}
      />

      {timelineData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: index % 2 === 0 ? 'row-reverse' : 'row' },
              alignItems: 'flex-start',
              mb: 8,
              position: 'relative',
              pt: 2,
            }}
          >
            {/* Content */}
            <Box
              sx={{
                flex: 1,
                pl: { xs: 6, md: index % 2 === 0 ? 0 : 6 },
                pr: { xs: 0, md: index % 2 === 0 ? 6 : 0 },
                textAlign: { xs: 'left', md: index % 2 === 0 ? 'right' : 'left' },
                mt: 3,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background:
                      'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 2,
                      padding: '1px',
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.5), transparent)',
                      WebkitMask:
                        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}
                  >
                    {t(item.titleKey)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t(item.descriptionKey)}
                  </Typography>
                </Box>
              </motion.div>
            </Box>

            {/* Center point with year */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: '11px', md: '50%' },
                transform: { xs: 'translateX(0)', md: 'translateX(-50%)' },
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                zIndex: 2,
              }}
            >
              {/* Year badge */}
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                }}
              >
                {item.year}
              </Box>

              {/* Circle dot */}
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                  border: '3px solid',
                  borderColor: 'background.default',
                  boxShadow: '0 0 15px rgba(76, 175, 80, 0.6)',
                }}
              />
            </Box>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
}
