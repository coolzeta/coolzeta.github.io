'use client';

import { Box, Button, Container, Typography, Paper, IconButton, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/app/contexts/LocaleProvider';

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
    // { icon: <LinkedInIcon />, url: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
];

interface HomePageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default function Home({ params }: HomePageProps) {
    const router = useRouter();
    const { locale, setLocale, t, loading } = useLocale();
    const [currentText, setCurrentText] = useState('');
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [textIndex, setTextIndex] = useState(0);


    useEffect(() => {
        if (loading) return; // 等待翻译加载完成

        const timeout = setTimeout(() => {
            if (isDeleting) {
                setCurrentText(currentText.slice(0, -1));
                if (currentText.length === 0) {
                    setIsDeleting(false);
                    setTextIndex((textIndex + 1) % typewriterTextKeys.length);
                    setIndex(0);
                }
            } else {
                const currentTextContent = t(typewriterTextKeys[textIndex]);
                setCurrentText(currentTextContent.slice(0, index + 1));
                if (index + 1 === currentTextContent.length) {
                    setTimeout(() => {
                        setIsDeleting(true);
                        setCurrentText(currentTextContent)
                    }, 1000);
                } else {
                    setIndex(index + 1);
                }
            }
        }, isDeleting ? 20 : 40);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, textIndex, index, locale, loading, t]);



    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
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
                        {loading ? "Zeta's Secret Base" : t('app.title')}
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
                    sx={{ mb: { xs: 4, md: 8 } }}
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
                                    {loading ? 'Blog' : t('home.blog.title')}
                                </Typography>
                                <Typography sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                                    {loading ? 'See my latest blogs, and get to know me better' : t('home.blog.description')}
                                </Typography>
                                <Button variant="contained" onClick={() => router.push(`/${locale}/apps/blog`)}>
                                    {loading ? 'Explore Blogs' : t('home.blog.button')}
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
                                    {loading ? 'App Playground' : t('home.playground.title')}
                                </Typography>
                                <Typography sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                                    {loading ? 'Experiment with smart contracts, decentralized applications, and more' : t('home.playground.description')}
                                </Typography>
                                <Button variant="contained" onClick={() => router.push(`/${locale}/apps/web3`)}>
                                    {loading ? 'Launch Playground' : t('home.playground.button')}
                                </Button>
                            </Paper>
                        </motion.div>
                    </Box>
                </Stack>
                <Paper
                    sx={{
                        p: 4,
                        mt: { xs: 0, md: 4 },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" alignSelf='flex-start' sx={{ mb: 2, color: 'primary.main' }}>
                        {loading ? 'About Me' : t('home.about.title')}
                    </Typography>
                    <Typography sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                        {loading ? 'I\'m a web3 newbie trying to learn and share my knowledge about web3, an INTJ, currently working in an exchange at Hong Kong. I work as a Frontend Engineer, but I also have a passion in smart contract development, and I\'m interested in the intersection of cryptography and web3.' : t('home.about.description')}
                    </Typography>
                </Paper>
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
                        {loading ? 'Connect With Me' : t('home.connect.title')}
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
                        {loading ? '© 2025 Zeta\'s Secret Base. All rights reserved.' : t('home.footer.copyright')}
                    </Typography>
                </Box>
            </Container>
        </Box >
    );
}