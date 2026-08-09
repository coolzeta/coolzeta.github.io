import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zeta Zhang / coolzeta',
    short_name: 'Zeta',
    description:
      'Personal notes, useful tools, and interactive experiments by Zeta Zhang in Hong Kong.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#080b09',
    theme_color: '#b8ff61',
    lang: 'en',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}
