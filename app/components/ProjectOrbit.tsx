'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

interface ProjectOrbitProps {
  locale: 'zh' | 'en';
}

const interests = [
  {
    name: { en: 'AI Agents', zh: 'AI 智能体' },
    type: { en: 'AUTONOMY / TOOLS', zh: '自主 / 工具' },
    state: { en: 'EXPLORING', zh: '探索中' },
    accent: '#b8ff61',
  },
  {
    name: { en: 'Prediction Markets', zh: '预测市场' },
    type: { en: 'SIGNALS / BELIEF', zh: '信号 / 概率' },
    state: { en: 'WATCHING', zh: '关注中' },
    accent: '#7fdc9a',
  },
  {
    name: { en: 'Mechanism Design', zh: '机制设计' },
    type: { en: 'INCENTIVES / SYSTEMS', zh: '激励 / 系统' },
    state: { en: 'STUDYING', zh: '学习中' },
    accent: '#d9ff8c',
  },
  {
    name: { en: 'Human–AI Interfaces', zh: '人机交互' },
    type: { en: 'VOICE / INTERACTION', zh: '语音 / 交互' },
    state: { en: 'BUILDING', zh: '制作中' },
    accent: '#9eeec0',
  },
  {
    name: { en: 'Onchain Coordination', zh: '链上协作' },
    type: { en: 'GOVERNANCE / MARKETS', zh: '治理 / 市场' },
    state: { en: 'THINKING', zh: '思考中' },
    accent: '#79d9a5',
  },
  {
    name: { en: 'Creative Coding', zh: '创意编程' },
    type: { en: 'VISUAL / PLAY', zh: '视觉 / 玩耍' },
    state: { en: 'MAKING', zh: '实验中' },
    accent: '#c9ff77',
  },
  {
    name: { en: 'Electronic Music', zh: '电子音乐' },
    type: { en: 'SOUND / SYNTHESIS', zh: '声音 / 合成' },
    state: { en: 'PLAYING', zh: '玩耍中' },
    accent: '#a7df75',
  },
];

export default function ProjectOrbit({ locale }: ProjectOrbitProps) {
  const orbitRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pausedRef = useRef(false);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = { width: orbit.clientWidth, height: orbit.clientHeight };
    const orbitTilt = -8 * (Math.PI / 180);
    const tiltCos = Math.cos(orbitTilt);
    const tiltSin = Math.sin(orbitTilt);
    let phase = 0;
    let previousTime = performance.now();
    let animationFrame = 0;

    const positionPlanets = () => {
      const radiusX = size.width * 0.37;
      const radiusY = size.height * 0.235;
      const depthRadius = Math.min(size.width, size.height) * 0.25;

      planetRefs.current.forEach((planet, index) => {
        if (!planet) return;

        const angle = phase + Math.PI / 2 + index * ((Math.PI * 2) / interests.length);
        const lane = index % 2 === 0 ? 1 : 0.78;
        const orbitX = Math.cos(angle) * radiusX * lane;
        const orbitY = Math.sin(angle) * radiusY * lane;
        const depth = Math.sin(angle);
        const x = orbitX * tiltCos - orbitY * tiltSin;
        const y = orbitX * tiltSin + orbitY * tiltCos;
        const z = depth * depthRadius;

        planet.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        // The star sits at translateZ(42px); only planets that have travelled
        // past that plane are allowed to paint in front of it.
        planet.style.zIndex = z > 42 ? '5' : '1';
        planet.style.opacity = `${0.82 + ((depth + 1) / 2) * 0.18}`;
      });
    };

    const animate = (time: number) => {
      const delta = Math.min(time - previousTime, 50);
      previousTime = time;
      if (!pausedRef.current) phase += delta * ((Math.PI * 2) / 42000);
      positionPlanets();
      animationFrame = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(entries => {
      const bounds = entries[0]?.contentRect;
      if (!bounds) return;
      size.width = bounds.width;
      size.height = bounds.height;
      positionPlanets();
    });

    resizeObserver.observe(orbit);
    positionPlanets();
    if (!reducedMotion) animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Box
      ref={orbitRef}
      className="project-orbit"
      aria-label={locale === 'zh' ? 'Zeta 最近感兴趣的方向' : "Zeta's current interests"}
    >
      <Box className="project-plane project-plane-one" />
      <Box className="project-plane project-plane-two" />
      <Box className="project-core">
        <Box className="core-pulse" />
        <Typography>{locale === 'zh' ? '最近' : 'NOW'}</Typography>
        <Typography component="strong">{locale === 'zh' ? '好奇' : 'CURIOUS'}</Typography>
        <Typography component="span">
          {locale === 'zh' ? '07 个兴趣方向' : '07 OPEN THREADS'}
        </Typography>
      </Box>

      {interests.map((interest, index) => (
        <Box
          className={`project-planet interest-planet-${index + 1}`}
          key={interest.name.en}
          ref={element => {
            planetRefs.current[index] = element as HTMLDivElement | null;
          }}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onFocus={() => {
            pausedRef.current = true;
          }}
          onBlur={() => {
            pausedRef.current = false;
          }}
        >
          <Box
            component="article"
            className="floating-interest"
            sx={
              {
                '--project-accent': interest.accent,
              } as React.CSSProperties
            }
          >
            <Box className="interest-card-top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{interest.state[locale]}</span>
            </Box>
            <Typography component="strong">{interest.name[locale]}</Typography>
            <Typography component="small">{interest.type[locale]}</Typography>
          </Box>
        </Box>
      ))}

      <Box className="project-orbit-note">
        <span>
          {locale === 'zh' ? '一些最近总会想到的东西' : 'A FEW THINGS I KEEP THINKING ABOUT'}
        </span>
      </Box>
    </Box>
  );
}
