'use client';

import { Box, Chip, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TechStack {
  category: string;
  technologies: Array<{
    name: string;
    icon: React.ReactNode;
    color: string;
  }>;
}

// SVG Icon Components
const EthereumIcon = () => (
  <svg width="20" height="20" viewBox="0 0 256 417" fill="currentColor">
    <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fillOpacity="0.6" />
    <path d="M127.962 0L0 212.32l127.962 75.639V0z" fillOpacity="0.45" />
    <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fillOpacity="0.6" />
    <path d="M127.962 416.905v-104.72L0 236.585z" fillOpacity="0.45" />
  </svg>
);

const SolidityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.409 6.608L7.981.255l3.572 6.353H4.409zM8.411 0l3.569 6.348L15.552 0H8.411zm4.036 17.392l3.572 6.354 3.573-6.354h-7.145zm.428-14.135l-3.569 6.349h7.139L12.875 3.257zm-8.03 13.316l-3.574 6.355h7.145l-3.571-6.355zm11.16-10.063l-3.571-6.354-3.572 6.354h7.143zm-3.571 10.063l-3.572 6.355h7.145l-3.573-6.355zM15.982 20.75l3.572-6.354-3.572-6.355-3.571 6.355 3.571 6.354z" />
  </svg>
);

const Web3Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const HardhatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l7 3.82v8c0 4.51-3.08 8.71-7 9.92-3.92-1.21-7-5.41-7-9.92V8l7-3.82zM11 10v8h2v-8h-2z" />
  </svg>
);

const IPFSIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ContractIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const AIAgentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="8.5" cy="16" r="0.5" fill="currentColor" />
    <circle cx="15.5" cy="16" r="0.5" fill="currentColor" />
  </svg>
);

const LangChainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const ComfyUIIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="9" x2="15" y2="15" />
    <line x1="15" y1="9" x2="9" y2="15" />
  </svg>
);

const StableDiffusionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <path d="M14 10h7" />
    <path d="M14 7h4" />
    <path d="M10 14v7" />
    <path d="M7 14v4" />
  </svg>
);

const LLMIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="9" y1="14" x2="13" y2="14" />
  </svg>
);

const RAGIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="12" y1="9" x2="12" y2="15" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

const ReactIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const NextJSIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.049-.106.005-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
  </svg>
);

const TypeScriptIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 12v12h24V0H0zm19.341-.956c.61.152 1.074.423 1.501.865.221.236.549.666.575.77.008.03-1.036.73-1.668 1.123-.023.015-.115-.084-.217-.236-.31-.45-.633-.644-1.128-.678-.728-.05-1.196.331-1.192.967a.88.88 0 0 0 .102.45c.16.331.458.53 1.39.934 1.719.74 2.454 1.227 2.911 1.92.51.773.625 2.008.278 2.926-.38.998-1.325 1.676-2.655 1.9-.411.073-1.386.062-1.828-.018-.964-.172-1.878-.648-2.442-1.273-.221-.244-.651-.88-.625-.925.011-.016.11-.077.22-.141.108-.061.511-.294.892-.515l.69-.4.145.214c.202.308.643.731.91.872.766.404 1.817.347 2.335-.118a.883.883 0 0 0 .272-.651c0-.27-.033-.4-.178-.61-.187-.266-.568-.491-1.588-.94-1.163-.509-1.66-.817-2.116-1.31-.613-.662-.904-1.413-.908-2.335-.002-.883.284-1.576.87-2.113.731-.67 1.746-.955 2.952-.833zM13.116 7.28h2.187v2.12h-4.55V7.28h2.363z" />
  </svg>
);

const TailwindIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z" />
  </svg>
);

const FramerMotionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L24 8v8L12 8l12 8v8L12 24 0 16V8l12 8L0 8V0l12 8L12 0z" />
  </svg>
);

const MUIIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 2.475v10.39l3 1.733V7.67l6 3.465 6-3.465v3.465l-6 3.463v3.464l6 3.463 9-5.195V9.402l-3 1.733v3.464l-6 3.464-3-1.732 9-5.195V2.475L12 7.67 0 2.475zm18 0v3.464l3 1.732V3.207l-3-0.732z" />
  </svg>
);

export default function TechShowcase() {
  const t = useTranslations();

  const techStacks: TechStack[] = [
    {
      category: 'home.tech.web3.title',
      technologies: [
        { name: 'Ethereum', icon: <EthereumIcon />, color: '#4caf50' },
        { name: 'Solidity', icon: <SolidityIcon />, color: '#66bb6a' },
        { name: 'Web3.js', icon: <Web3Icon />, color: '#81c784' },
        { name: 'Hardhat', icon: <HardhatIcon />, color: '#a5d6a7' },
        { name: 'IPFS', icon: <IPFSIcon />, color: '#4caf50' },
        { name: 'Smart Contracts', icon: <ContractIcon />, color: '#66bb6a' },
      ],
    },
    {
      category: 'home.tech.ai.title',
      technologies: [
        { name: 'AI Agent', icon: <AIAgentIcon />, color: '#9c27b0' },
        { name: 'LangChain', icon: <LangChainIcon />, color: '#ba68c8' },
        { name: 'ComfyUI', icon: <ComfyUIIcon />, color: '#ab47bc' },
        { name: 'Stable Diffusion', icon: <StableDiffusionIcon />, color: '#ce93d8' },
        { name: 'LLM', icon: <LLMIcon />, color: '#9c27b0' },
        { name: 'RAG', icon: <RAGIcon />, color: '#ba68c8' },
      ],
    },
    {
      category: 'home.tech.frontend.title',
      technologies: [
        { name: 'React', icon: <ReactIcon />, color: '#2196f3' },
        { name: 'Next.js', icon: <NextJSIcon />, color: '#64b5f6' },
        { name: 'TypeScript', icon: <TypeScriptIcon />, color: '#42a5f5' },
        { name: 'Tailwind', icon: <TailwindIcon />, color: '#90caf9' },
        { name: 'Framer Motion', icon: <FramerMotionIcon />, color: '#2196f3' },
        { name: 'Material-UI', icon: <MUIIcon />, color: '#64b5f6' },
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
                    icon={
                      <Box sx={{ display: 'flex', alignItems: 'center', color: tech.color }}>
                        {tech.icon}
                      </Box>
                    }
                    label={tech.name}
                    sx={{
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 2, sm: 2.5 },
                      fontSize: { xs: '0.8rem', sm: '0.95rem' },
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
