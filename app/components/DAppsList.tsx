'use client';

import { Box, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { DApp, dapps } from '../config/dapps';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded';

export default function DAppsList() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Box className="lab-projects">
      {dapps.map((dapp: DApp, index: number) => (
        <motion.a
          key={dapp.id}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="lab-project"
          href={dapp.external || dapp.localeAware === false ? dapp.url : `/${locale}${dapp.url}`}
        >
          <Box className="lab-project-media">
            <Image
              src={dapp.imageUrl}
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, 50vw"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <Box className="lab-project-overlay" />
            <span className="lab-project-index">TOOL / {String(index + 1).padStart(2, '0')}</span>
          </Box>
          <Box className="lab-project-body">
            <Box className="lab-project-status">
              <i /> {t(`dapp.status.${dapp.status}`)}
            </Box>
            <Typography component="h2">{t(dapp.nameKey)}</Typography>
            <Typography>{t(dapp.descriptionKey)}</Typography>
            <Box className="lab-project-bottom">
              <Box className="lab-project-tags">
                {dapp.tags.slice(0, 4).map(tag => (
                  <Chip key={tag} label={t(`dapp.tags.${tag}`)} size="small" />
                ))}
              </Box>
              <ArrowOutwardRounded />
            </Box>
          </Box>
        </motion.a>
      ))}
    </Box>
  );
}
