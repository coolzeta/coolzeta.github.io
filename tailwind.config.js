import colors from './app/theme/theme';

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.primary.main,
          light: colors.primary.light,
          dark: colors.primary.dark,
        },
        secondary: {
          DEFAULT: colors.secondary.main,
          light: colors.secondary.light,
          dark: colors.secondary.dark,
        },
        background: {
          DEFAULT: colors.background.default,
          paper: colors.background.paper,
        },
        text: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
        },
        border: {
          light: colors.border.light,
        },
        accent: {
          green: colors.accent.green,
          white: colors.accent.white,
        },
      },
      backgroundImage: {
        gradient: {
          'green': `linear-gradient(45deg, ${colors.primary.main} 30%, ${colors.primary.light} 90%)`,
          'blue': `linear-gradient(45deg, ${colors.secondary.main} 30%, ${colors.secondary.light} 90%)`,
          'purple': `linear-gradient(45deg, ${colors.accent.purple} 30%, ${colors.accent.lightPurple} 90%)`,
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': `0 0 15px ${colors.primary.main}`,
        'glow-light': `0 0 10px ${colors.primary.light}`,
      },
    },
  },
  plugins: [],
};

export default config; 