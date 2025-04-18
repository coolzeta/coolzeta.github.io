'use client';

import { Box, Button, Container, Typography, Paper, IconButton, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const texts = [
  'Welcome to Zeta\'s Secret Base',
  'I\'m a software engineer',
  'I\'m a web3 and blockchain developer',
  'I\'m a cryptography enthusiast',
  'I like to share and connect with other developers',
  'if you want to know more about me, you can click the social media icons below',
];

const socialLinks = [
  { icon: <GitHubIcon />, url: 'https://github.com/yourusername', label: 'GitHub' },
  { icon: <TwitterIcon />, url: 'https://twitter.com/yourusername', label: 'Twitter' },
  { icon: <InstagramIcon />, url: 'https://instagram.com/yourusername', label: 'Instagram' },
  { icon: <LinkedInIcon />, url: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
];

export default function Home() {
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(currentText.slice(0, -1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
          setIndex(0);
        }
      } else {
        setCurrentText(texts[textIndex].slice(0, index + 1));
        if (index + 1 === texts[textIndex].length) {
          setTimeout(() => {
            setIsDeleting(true);
            setCurrentText(texts[textIndex])
          }, 1000);
        } else {
          setIndex(index + 1);
        }
      }
    }, isDeleting ? 25 : 50);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, textIndex, index]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ py: 8, textAlign: 'center' }}
        >
          <Typography
            variant="h1"
            sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            Zeta's Secret Base
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              minHeight: '2.5em',
              position: 'relative',
              color: 'primary.main',
              '&::after': {
                content: "'|'",
                marginLeft: '2px',
                animation: 'blink 1s step-end infinite'
              }
            }}
          >
            {currentText}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ mb: 8 }}
        >
          <Box flex={1}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ height: '100%' }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
                  Blog
                </Typography>
                <Typography sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                  See my latest blogs, and get to know me better
                </Typography>
                <Button variant="contained">
                  Explore Blogs
                </Button>
              </Paper>
            </motion.div>
          </Box>

          <Box flex={1}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ height: '100%' }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
                  DApp Playground
                </Typography>
                <Typography sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                  Experiment with smart contracts and decentralized applications
                </Typography>
                <Button variant="contained">
                  Launch Playground
                </Button>
              </Paper>
            </motion.div>
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 'auto',
            py: 4,
            textAlign: 'center',
            borderTop: '1px solid',
            borderColor: 'border.light'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Connect With Me
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            {socialLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </IconButton>
              </motion.div>
            ))}
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © 2025 Zeta's Secret Base. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}