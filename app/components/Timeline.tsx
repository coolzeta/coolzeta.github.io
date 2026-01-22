'use client';

import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';

interface TimelineItem {
  year: string;
  titleKey: string;
  descriptionKey: string;
}

export default function Timeline() {
  const t = useTranslations();
  const resumeUrl = ''; // TODO: Add resume URL here

  const handleDownload = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert(t('home.resume.notAvailable'));
    }
  };

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

      {/* Resume Download Card - Temporarily Hidden */}
      {false && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'row' },
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
                pl: { xs: 6, md: 6 },
                pr: { xs: 0, md: 0 },
                textAlign: 'left',
                mt: 3,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background:
                      'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(76, 175, 80, 0.4)',
                    position: 'relative',
                    textAlign: 'center',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 2,
                      padding: '2px',
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.6), transparent)',
                      WebkitMask:
                        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    },
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                      mb: 2,
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 32, color: '#fff' }} />
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}
                  >
                    {t('home.resume.title')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {t('home.resume.description')}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mb: 3,
                      color: 'text.secondary',
                      opacity: 0.7,
                      fontStyle: 'italic',
                    }}
                  >
                    {t('home.resume.languageHint')}
                  </Typography>

                  {/* Download Button */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleDownload}
                      disabled={!resumeUrl}
                      startIcon={<DownloadIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        background: resumeUrl
                          ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                          : 'rgba(128, 128, 128, 0.3)',
                        boxShadow: resumeUrl ? '0 4px 20px rgba(76, 175, 80, 0.4)' : 'none',
                        color: '#fff',
                        fontWeight: 600,
                        borderRadius: 2,
                        '&:hover': {
                          background: resumeUrl
                            ? 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)'
                            : 'rgba(128, 128, 128, 0.3)',
                          boxShadow: resumeUrl ? '0 6px 30px rgba(76, 175, 80, 0.6)' : 'none',
                        },
                        '&.Mui-disabled': {
                          color: '#888',
                        },
                      }}
                    >
                      {t('home.resume.button')}
                    </Button>
                  </motion.div>

                  {!resumeUrl && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 2,
                        color: 'text.secondary',
                        opacity: 0.6,
                        fontStyle: 'italic',
                      }}
                    >
                      {t('home.resume.comingSoon')}
                    </Typography>
                  )}
                </Box>
              </motion.div>
            </Box>

            {/* Center point with icon */}
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
              {/* Icon badge */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.6)',
                  border: '3px solid',
                  borderColor: 'background.default',
                }}
              >
                <DownloadIcon sx={{ fontSize: 20, color: '#fff' }} />
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
