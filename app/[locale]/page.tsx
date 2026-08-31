'use client';

import { Box, Button, Chip, Container, IconButton, Stack, Typography } from '@mui/material';
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded';
import GitHub from '@mui/icons-material/GitHub';
import LinkedIn from '@mui/icons-material/LinkedIn';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import LightningCloudsWebGL from '../components/LightningCloudsWebGL';
import ProjectOrbit from '../components/ProjectOrbit';
import ScrollLinkedArtifact from '../components/ScrollLinkedArtifact';
import { AUTHOR_ID, SITE_URL, SOCIAL_LINKS, localePath, safeJsonLd } from '../seo';

const notes = [
  {
    slug: '2026-the-year-agents-became-real',
    date: '2026.08.09',
    tag: 'PERSONAL NOTE',
    title: {
      zh: '2026，或许才是 Agent 元年',
      en: '2026 might be the year agents became real',
    },
    description: {
      zh: '从终端、浏览器到真实生活：我为什么在今年第一次感到 Agent 真正到来了。',
      en: 'From terminals and browsers to real life: why agents finally feel real to me.',
    },
  },
  {
    slug: 'deep-dive-openclaw-core-architecture',
    date: '2026.03.17',
    tag: 'AI AGENT',
    title: {
      zh: '深度解析 OpenClaw 的核心：现代 AI Agent 架构',
      en: 'Inside OpenClaw: the architecture of a modern AI agent',
    },
    description: {
      zh: '从 Agent Loop 到实时干预机制，一次写给好奇心的底层漫游。',
      en: 'A curious walk from the agent loop to real-time steering.',
    },
  },
  {
    slug: 'ai-mcp-skills-modern-development-workflow',
    date: '2026.01.22',
    tag: 'FIELD NOTE',
    title: {
      zh: 'AI + MCP + Skills：重构前端开发流',
      en: 'AI + MCP + Skills: reshaping frontend workflows',
    },
    description: {
      zh: '把近期真实使用中的新工具链、惊喜和摩擦都记录下来。',
      en: 'Notes on the surprises and friction in a new creative toolchain.',
    },
  },
];

const socialLinks = [
  { icon: <GitHub />, url: 'https://github.com/coolzeta', label: 'GitHub' },
  {
    icon: <LinkedIn />,
    url: 'https://www.linkedin.com/in/zeta-zhang-98065334b/',
    label: 'LinkedIn',
  },
];

export default function Home() {
  const t = useTranslations('home.personal');
  const locale = useLocale() as 'zh' | 'en';
  const router = useRouter();

  const go = (path: string) => router.push(`/${locale}${path}`);
  const profileDescription =
    locale === 'zh'
      ? 'Zeta Zhang（coolzeta），居住在香港的独立开发者与产品创作者，制作 AI 工具、互动学习实验和链上产品。'
      : 'Zeta Zhang (coolzeta) is an independent maker in Hong Kong building AI tools, interactive learning experiments, and onchain products.';
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Zeta Zhang / coolzeta',
        alternateName: ["Zeta's Notes", 'coolzeta'],
        inLanguage: ['en', 'zh'],
        publisher: { '@id': AUTHOR_ID },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${localePath(locale)}/#profile`,
        url: localePath(locale),
        name: locale === 'zh' ? '关于 Zeta Zhang' : 'About Zeta Zhang',
        inLanguage: locale,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': AUTHOR_ID },
      },
      {
        '@type': 'Person',
        '@id': AUTHOR_ID,
        name: 'Zeta Zhang',
        alternateName: ['Zeta', 'coolzeta'],
        url: SITE_URL,
        description: profileDescription,
        homeLocation: { '@type': 'Place', name: 'Hong Kong' },
        sameAs: SOCIAL_LINKS,
        knowsAbout: [
          'Artificial intelligence agents',
          'Creative tools',
          'Interactive learning',
          'Web development',
          'Blockchain systems',
          'Electronic music',
        ],
        owns: [
          { '@type': 'SoftwareApplication', name: 'PrompterOne', url: 'https://prompterone.app' },
          { '@type': 'CreativeWork', name: 'Mechanism Lab', url: 'https://chainlab.zeta.lol' },
          {
            '@type': 'CreativeWork',
            name: 'Soundcraft',
            url: 'https://soundcraft-electronic-music-lab.zetazhang2001.chatgpt.site',
          },
        ],
      },
    ],
  };

  return (
    <Box className="personal-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />
      <Box className="ambient-canvas" aria-hidden="true">
        <LightningCloudsWebGL />
      </Box>
      <Box className="scroll-artifact-layer" aria-hidden="true">
        <ScrollLinkedArtifact />
      </Box>

      <Container maxWidth="lg" className="personal-shell">
        <Box component="section" className="personal-hero">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Stack direction="row" alignItems="center" spacing={1} className="eyebrow">
              <Box className="status-dot" />
              <Typography component="span">{t('eyebrow')}</Typography>
            </Stack>

            <Typography component="h1" className="personal-title">
              {t('hello')}
              <br />
              <Box component="span">{t('name')}</Box>
            </Typography>

            <Typography className="personal-intro">{t('intro')}</Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} className="hero-actions">
              <Button
                variant="contained"
                endIcon={<ArrowOutwardRounded />}
                onClick={() => go('/apps/blog')}
              >
                {t('read')}
              </Button>
              <Button variant="text" onClick={() => go('/apps/playground')}>
                {t('play')}
              </Button>
            </Stack>
          </motion.div>

          <motion.div
            className="hero-interests"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15 }}
          >
            <ProjectOrbit locale={locale} />
          </motion.div>

          <Box className="scroll-note" aria-hidden="true">
            <span />
            {t('scroll')}
          </Box>
        </Box>

        <Box component="section" className="now-section">
          <Box className="section-index">01 / NOW</Box>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="now-grid"
          >
            <Box>
              <Typography component="h2" className="section-title">
                {t('nowTitle')}
              </Typography>
              <Typography className="now-lead">{t('nowLead')}</Typography>
            </Box>
            <Box className="project-stack">
              {[
                {
                  index: '01',
                  name: 'PrompterOne',
                  status: t('statusLive'),
                  text: t('prompterone'),
                  tags: ['Flutter', 'Speech', 'Creator tool'],
                  url: 'https://prompterone.app',
                },
                {
                  index: '02',
                  name: 'Mechanism Lab',
                  status: t('statusGrowing'),
                  text: t('mechanismLab'),
                  tags: ['Interactive', 'Onchain', 'Learn by doing'],
                  url: 'https://chainlab.zeta.lol/zh/',
                },
                {
                  index: '03',
                  name: 'Soundcraft',
                  status: t('statusExperiment'),
                  text: t('soundcraft'),
                  tags: ['Music', 'Web audio', 'Learning lab'],
                  url: 'https://soundcraft-electronic-music-lab.zetazhang2001.chatgpt.site',
                },
              ].map(project => (
                <Box
                  component="a"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="building-card"
                  key={project.name}
                >
                  <Box className="building-number">{project.index}</Box>
                  <Box className="building-main">
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Typography component="h3">{project.name}</Typography>
                      <span className="building-status">{project.status}</span>
                    </Stack>
                    <Typography>{project.text}</Typography>
                    <Stack direction="row" flexWrap="wrap" useFlexGap gap={0.7} sx={{ mt: 2 }}>
                      {project.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Stack>
                  </Box>
                  <ArrowOutwardRounded className="building-arrow" />
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>

        <Box component="section" className="notes-section">
          <Box className="notes-heading">
            <Box>
              <Box className="section-index">02 / NOTES</Box>
              <Typography component="h2" className="section-title">
                {t('notesTitle')}
              </Typography>
            </Box>
            <Button endIcon={<ArrowOutwardRounded />} onClick={() => go('/apps/blog')}>
              {t('allNotes')}
            </Button>
          </Box>

          <Box className="notes-list">
            {notes.map((note, index) => (
              <motion.article
                key={note.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08 }}
                className="note-row"
                onClick={() => go(`/apps/blog/${note.slug}`)}
                tabIndex={0}
                role="link"
                onKeyDown={event => event.key === 'Enter' && go(`/apps/blog/${note.slug}`)}
              >
                <Box className="note-meta">
                  <span>{note.date}</span>
                  <span>{note.tag}</span>
                </Box>
                <Box>
                  <Typography component="h3">{note.title[locale]}</Typography>
                  <Typography>{note.description[locale]}</Typography>
                </Box>
                <ArrowOutwardRounded className="note-arrow" />
              </motion.article>
            ))}
          </Box>
        </Box>

        <Box component="footer" className="personal-footer">
          <Box>
            <Typography className="footer-kicker">{t('footerKicker')}</Typography>
            <Typography component="h2">{t('footerTitle')}</Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            {socialLinks.map(link => (
              <IconButton
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                {link.icon}
              </IconButton>
            ))}
          </Stack>
          <Typography className="footer-note">
            © {new Date().getFullYear()} Zeta · {t('footerNote')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
