export interface DApp {
  id: string;
  nameKey: string;
  descriptionKey: string;
  imageUrl: string;
  url: string;
  tags: string[];
  status: 'live' | 'beta' | 'development';
  localeAware?: boolean;
  external?: boolean;
}

// 预设配置数组，您可以根据需要修改
export const dapps: DApp[] = [
  {
    id: 'boss-arena',
    nameKey: 'dapp.bossArena.name',
    descriptionKey: 'dapp.bossArena.description',
    imageUrl: '/covers/wasteland-cats.png',
    url: '/tools/boss-arena/',
    tags: ['Game', 'Boss Battle', 'Pixel Art', 'Touch'],
    status: 'beta',
    localeAware: false,
  },
  {
    id: 'wasteland-cats',
    nameKey: 'dapp.wastelandCats.name',
    descriptionKey: 'dapp.wastelandCats.description',
    imageUrl: '/covers/wasteland-cats.png',
    url: '/tools/wasteland-cats/',
    tags: ['Game', 'Roguelike', 'Vehicles', 'Cats'],
    status: 'beta',
    localeAware: false,
  },
  {
    id: 'cat-meme-lab',
    nameKey: 'dapp.catMemeLab.name',
    descriptionKey: 'dapp.catMemeLab.description',
    imageUrl: '/tools/cat-meme-lab/assets/pixel-cat-studio.webp',
    url: '/tools/cat-meme-lab/',
    tags: ['Canvas', 'Pixel Art', 'Privacy', 'Cats'],
    status: 'live',
    localeAware: false,
  },
  {
    id: 'pattern-atelier',
    nameKey: 'dapp.patternAtelier.name',
    descriptionKey: 'dapp.patternAtelier.description',
    imageUrl: '/tools/pattern-atelier/assets/pattern-atelier-hero-v3.webp',
    url: '/tools/pattern-atelier/',
    tags: ['Canvas', 'Pattern', 'Craft', 'Privacy'],
    status: 'live',
    localeAware: false,
  },
  {
    id: 'rust-path',
    nameKey: 'dapp.rustPath.name',
    descriptionKey: 'dapp.rustPath.description',
    imageUrl: '/covers/rust-path.png',
    url: '/tools/rust-path/',
    tags: ['Rust', 'Learning', 'Interactive', 'Compiler'],
    status: 'live',
    localeAware: false,
  },
  {
    id: 'classical-guitar',
    nameKey: 'dapp.classicalGuitar.name',
    descriptionKey: 'dapp.classicalGuitar.description',
    imageUrl: '/covers/classical-guitar.svg',
    url: '/tools/classical-guitar/',
    tags: ['Guitar', 'Learning', 'Interactive', 'Music'],
    status: 'live',
    localeAware: false,
  },
  {
    id: 'prompter-one',
    nameKey: 'dapp.prompterOne.name',
    descriptionKey: 'dapp.prompterOne.description',
    imageUrl: '/covers/prompterone.webp',
    url: 'https://prompterone.app/',
    tags: ['Teleprompter', 'Voice', 'Recording', 'Privacy'],
    status: 'live',
    localeAware: false,
    external: true,
  },
];
