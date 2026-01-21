'use client';

import { Box, Chip, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TechStack {
  category: string;
  technologies: Array<{
    name: string;
    icon: string;
    color: string;
  }>;
}

export default function TechShowcase() {
  const t = useTranslations();

  const techStacks: TechStack[] = [
    {
      category: 'home.tech.web3.title',
      technologies: [
        { name: 'Ethereum', icon: '⟠', color: '#4caf50' },
        { name: 'Solidity', icon: '◆', color: '#81c784' },
        { name: 'Web3.js', icon: '🌐', color: '#66bb6a' },
        { name: 'Hardhat', icon: '⚒️', color: '#a5d6a7' },
        { name: 'IPFS', icon: '📦', color: '#4caf50' },
        { name: 'Smart Contracts', icon: '📜', color: '#81c784' },
      ],
    },
    {
      category: 'home.tech.ai.title',
      technologies: [
        { name: 'AI Agent', icon: '🤖', color: '#4caf50' },
        { name: 'LangChain', icon: '⛓️', color: '#81c784' },
        { name: 'ComfyUI', icon: '🎨', color: '#66bb6a' },
        { name: 'Stable Diffusion', icon: '🖼️', color: '#4caf50' },
        { name: 'LLM', icon: '🧠', color: '#81c784' },
        { name: 'RAG', icon: '📚', color: '#66bb6a' },
      ],
    },
    {
      category: 'home.tech.frontend.title',
      technologies: [
        { name: 'React', icon: '⚛️', color: '#4caf50' },
        { name: 'Next.js', icon: '▲', color: '#81c784' },
        { name: 'TypeScript', icon: 'TS', color: '#66bb6a' },
        { name: 'Tailwind', icon: '🎨', color: '#a5d6a7' },
        { name: 'Framer Motion', icon: '✨', color: '#4caf50' },
        { name: 'Material-UI', icon: '🎯', color: '#81c784' },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box sx={{ py: 6 }}>
      {techStacks.map((stack, stackIndex) => (
        <Box key={stackIndex} sx={{ mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                color: 'primary.main',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&::before': {
                  content: '""',
                  width: 4,
                  height: 24,
                  borderRadius: 2,
                  background: 'linear-gradient(to bottom, #4caf50, #81c784)',
                },
              }}
            >
              {t(stack.category)}
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {stack.technologies.map((tech, techIndex) => (
                <motion.div
                  key={techIndex}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.3 },
                  }}
                >
                  <Chip
                    icon={<span style={{ fontSize: '1.2rem' }}>{tech.icon}</span>}
                    label={tech.name}
                    sx={{
                      px: 2,
                      py: 2.5,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${tech.color}33 0%, ${tech.color}11 100%)`,
                      border: `1px solid ${tech.color}66`,
                      color: 'text.primary',
                      backdropFilter: 'blur(10px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${tech.color}55 0%, ${tech.color}33 100%)`,
                        boxShadow: `0 4px 20px ${tech.color}66`,
                        transform: 'translateY(-2px)',
                      },
                      '& .MuiChip-icon': {
                        marginLeft: 1,
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </Box>
      ))}
    </Box>
  );
}
