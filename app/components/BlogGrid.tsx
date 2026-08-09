'use client';

import NextLink from 'next/link';
import { Box, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

interface BlogGridProps {
  posts: BlogPost[];
  locale: string;
}

export default function BlogGrid({ posts, locale }: BlogGridProps) {
  return (
    <Box className="journal-grid">
      {posts.map((post, index) => (
        <motion.article
          key={post.slug}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.35) }}
          className={`journal-card ${index === 0 ? 'journal-card-featured' : ''}`}
        >
          <NextLink href={`/${locale}/apps/blog/${post.slug}`}>
            <Box className="journal-image-wrap">
              <Box
                component="img"
                src={`/images/blog/${post.slug}/cover.png`}
                alt=""
                className="journal-image"
              />
              <Box className="journal-image-shade" />
              <Box className="journal-number">{String(index + 1).padStart(2, '0')}</Box>
            </Box>

            <Box className="journal-content">
              <Box className="journal-meta">
                <span>
                  {new Date(post.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  })}
                </span>
                <span>{post.tags[0] || 'NOTE'}</span>
              </Box>
              <Typography component="h2">{post.title}</Typography>
              <Typography className="journal-description">{post.description}</Typography>
              <Box className="journal-bottom">
                <Box className="journal-tags">
                  {post.tags.slice(0, index === 0 ? 4 : 3).map(tag => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
                <ArrowOutwardRounded />
              </Box>
            </Box>
          </NextLink>
        </motion.article>
      ))}
    </Box>
  );
}
