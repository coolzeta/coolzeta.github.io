'use client';

import { Box, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { DApp, dapps } from '../config/dapps';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded';

export default function DAppsList() {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();

  return (
    <Box className="lab-projects">
      {dapps.map((dapp: DApp, index: number) => (
        <motion.article
          key={dapp.id}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="lab-project"
          onClick={() => router.push(`/${locale}${dapp.url}`)}
          onKeyDown={event => event.key === 'Enter' && router.push(`/${locale}${dapp.url}`)}
          role="link"
          tabIndex={0}
        >
          <Box className="lab-project-media">
            <Image src={dapp.imageUrl} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" />
            <Box className="lab-project-overlay" />
            <span className="lab-project-index">EXP / {String(index + 1).padStart(2, '0')}</span>
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
        </motion.article>
      ))}
    </Box>
  );
}
