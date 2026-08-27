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
    url: 'https://rust-path-course.zetazhang2001.chatgpt.site',
    tags: ['Rust', 'Learning', 'Interactive', 'Compiler'],
    status: 'live',
    localeAware: false,
    external: true,
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
