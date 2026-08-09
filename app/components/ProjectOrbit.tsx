'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

interface ProjectOrbitProps {
  locale: 'zh' | 'en';
}

const projects = [
  {
    name: 'PrompterOne',
    type: 'VOICE / TOOL',
    state: 'LIVE',
    accent: '#b8ff61',
    url: 'https://prompterone.app',
  },
  {
    name: 'Mechanism Lab',
    type: 'ONCHAIN / LEARN',
    state: 'GROWING',
    accent: '#7fdc9a',
    url: 'https://chainlab.zeta.lol',
  },
  {
    name: 'Soundcraft',
    type: 'MUSIC / PLAY',
    state: 'EXPERIMENT',
    accent: '#d9ff8c',
    url: 'https://soundcraft-electronic-music-lab.zetazhang2001.chatgpt.site',
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

        const angle = phase + Math.PI / 2 + index * ((Math.PI * 2) / projects.length);
        const orbitX = Math.cos(angle) * radiusX;
        const orbitY = Math.sin(angle) * radiusY;
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
      aria-label={locale === 'zh' ? 'Zeta 最近正在制作的项目' : "Zeta's current projects"}
    >
      <Box className="project-plane project-plane-one" />
      <Box className="project-plane project-plane-two" />
      <Box className="project-core">
        <Box className="core-pulse" />
        <Typography>NOW</Typography>
        <Typography component="strong">BUILDING</Typography>
        <Typography component="span">03 ACTIVE SIGNALS</Typography>
      </Box>

      {projects.map((project, index) => (
        <Box
          className={`project-planet project-planet-${index + 1}`}
          key={project.name}
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
            component="a"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={locale === 'zh' ? `打开 ${project.name}` : `Open ${project.name}`}
            className="floating-project"
            sx={
              {
                '--project-accent': project.accent,
              } as React.CSSProperties
            }
          >
            <Box className="project-card-top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{project.state}</span>
            </Box>
            <Typography component="strong">{project.name}</Typography>
            <Typography component="small">{project.type}</Typography>
            <Box className="project-progress">
              <span />
            </Box>
          </Box>
        </Box>
      ))}

      <Box className="project-orbit-note">
        <span>
          {locale === 'zh'
            ? '把好奇心做成可以使用的东西'
            : 'TURNING CURIOSITY INTO THINGS YOU CAN USE'}
        </span>
      </Box>
    </Box>
  );
}
