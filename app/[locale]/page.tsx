'use client';

import { Box, Button, Container, Typography, IconButton, Stack, Divider } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ParallaxSection from '../components/ParallaxSection';
import Timeline from '../components/Timeline';
import TechShowcase from '../components/TechShowcase';
import CodeEditor from '../components/CodeEditor';
import SponsorSection from '../components/SponsorSection';
import LightningCloudsWebGL from '../components/LightningCloudsWebGL';

const typewriterTextKeys = [
  'home.typewriter.welcome',
  'home.typewriter.engineer',
  'home.typewriter.web3Dev',
  'home.typewriter.crypto',
  'home.typewriter.intj',
  'home.typewriter.share',
  'home.typewriter.friends',
];

const socialLinks = [
  { icon: <GitHubIcon />, url: 'https://github.com/coolzeta', label: 'GitHub' },
  // { icon: <TwitterIcon />, url: 'https://twitter.com/yourusername', label: 'Twitter' },
  // { icon: <InstagramIcon />, url: 'https://instagram.com/yourusername', label: 'Instagram' },
  {
    icon: <LinkedInIcon />,
    url: 'https://www.linkedin.com/in/zeta-zhang-98065334b/',
    label: 'LinkedIn',
  },
];

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function Home({ params }: HomePageProps) {
  const router = useRouter();
  const t = useTranslations();
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [particlesVisible, setParticlesVisible] = useState(true);

  // Typewriter effect
  useEffect(() => {
    const currentTextContent = t(typewriterTextKeys[textIndex]);

    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          // 删除字符
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            // 删除完成,切换到下一个文本
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % typewriterTextKeys.length);
          }
        } else {
          // 打字
          if (currentText.length < currentTextContent.length) {
            setCurrentText(currentTextContent.slice(0, currentText.length + 1));
          } else {
            // 打字完成,等待后开始删除
            setTimeout(() => {
              setIsDeleting(true);
            }, 2000);
          }
        }
      },
      isDeleting ? 30 : 50
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, textIndex, t]);

  // Hide particles when scrolled past first screen
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      // Start fading out at 80% of viewport height
      const fadeStart = viewportHeight * 0.8;
      const opacity = Math.max(0, 1 - (scrollY - fadeStart) / (viewportHeight * 0.2));
      setParticlesVisible(opacity > 0);
      
      const container = document.querySelector('.particles-container') as HTMLElement;
      if (container) {
        container.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* First screen background effect only - fixed to viewport */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'auto',
          // Clip to only show in first screen
          clipPath: 'inset(0 0 0 0)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // Hide when scrolled past first screen
            opacity: 1,
            transition: 'opacity 0.3s ease-out',
          }}
          className="particles-container"
        >
          <LightningCloudsWebGL />
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            py: { xs: 6, md: 10 },
            textAlign: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Typography
              variant="h1"
              sx={{
                mb: 1,
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(135deg, #4caf50 0%, #81c784 50%, #a5d6a7 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(76, 175, 80, 0.3)',
              }}
            >
              {t('app.title')}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 5,
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                fontWeight: 400,
                fontStyle: 'italic',
                opacity: 0.8,
              }}
            >
              {t('app.subtitle')}
            </Typography>
          </motion.div>

          <Typography
            variant="h5"
            sx={{
              mb: 6,
              minHeight: '3em',
              position: 'relative',
              color: 'primary.main',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: 500,
              '&::after': {
                content: "'|'",
                marginLeft: '2px',
                animation: 'blink 1s step-end infinite',
                color: 'primary.main',
              },
            }}
          >
            {currentText}
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 1.5, sm: 2 }}
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={async () => {
                  const resolvedParams = await params;
                  router.push(`/${resolvedParams.locale}/apps/blog`);
                }}
                sx={{
                  px: { xs: 2.5, sm: 4 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 30px rgba(76, 175, 80, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {t('home.blog.button')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={async () => {
                  const resolvedParams = await params;
                  router.push(`/${resolvedParams.locale}/apps/web3`);
                }}
                sx={{
                  px: { xs: 2.5, sm: 4 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  borderWidth: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                  },
                }}
              >
                {t('home.playground.button')}
              </Button>
            </Stack>
          </motion.div>
        </Box>

        {/* Tech Showcase Section */}
        <ParallaxSection speed={0.3}>
          <Box sx={{ py: { xs: 6, md: 10 } }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('home.tech.title')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 6,
                  textAlign: 'center',
                  color: 'text.secondary',
                  maxWidth: '700px',
                  mx: 'auto',
                }}
              >
                {t('home.tech.description')}
              </Typography>
            </motion.div>

            <TechShowcase />
          </Box>
        </ParallaxSection>

        <Divider sx={{ my: 8, opacity: 0.3 }} />

        {/* Journey Timeline Section */}
        <ParallaxSection speed={0.4}>
          <Box sx={{ py: { xs: 6, md: 10 } }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('home.journey.title')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 6,
                  textAlign: 'center',
                  color: 'text.secondary',
                  maxWidth: '700px',
                  mx: 'auto',
                }}
              >
                {t('home.journey.description')}
              </Typography>
            </motion.div>

            <Timeline />
          </Box>
        </ParallaxSection>

        <Divider sx={{ my: 8, opacity: 0.3 }} />

        {/* AI Code Editor Section */}
        <ParallaxSection speed={0.45}>
          <CodeEditor />
        </ParallaxSection>

        <Divider sx={{ my: 8, opacity: 0.3 }} />

        {/* Sponsor Section */}
        <ParallaxSection speed={0.5}>
          <SponsorSection />
        </ParallaxSection>

        {/* Footer */}
        <Box
          sx={{
            py: 6,
            textAlign: 'center',
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 8,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            {t('home.connect.title')}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            {socialLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    background:
                      'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.2) 100%)',
                      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                    },
                  }}
                >
                  {link.icon}
                </IconButton>
              </motion.div>
            ))}
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
            {t('home.footer.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
