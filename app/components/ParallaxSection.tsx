'use client';

import { Box } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  offset?: number;
}

export default function ParallaxSection({
  children,
  speed = 0.5,
  offset = 0,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset + 100 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <Box ref={ref} sx={{ position: 'relative' }}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </Box>
  );
}
