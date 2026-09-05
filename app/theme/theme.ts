'use client';

import { createTheme } from '@mui/material/styles';

// 定义颜色
export const colors = {
  primary: {
    main: '#C1DC91',
    light: '#D9E9BC',
    dark: '#A0BA72',
  },
  secondary: {
    main: '#FFFFFF', // 白色
    light: '#E0E0E0', // 浅灰
    dark: '#BDBDBD', // 浅灰
  },
  background: {
    default: '#141513',
    paper: '#1C1E1A',
  },
  text: {
    primary: '#F0EEE7',
    secondary: 'rgba(255, 255, 255, 0.7)', // 半透明白
  },
  border: {
    light: 'rgba(255, 255, 255, 0.12)',
  },
  accent: {
    green: '#4CAF50', // 强调绿色
    white: '#FFFFFF', // 强调白色
  },
};

// 创建主题配置
export const themeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },
  typography: {
    fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          backgroundImage: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '3px',
        },
        contained: {
          background: colors.primary.main,
          '&:hover': {
            background: colors.primary.light,
          },
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colors.primary.main,
          '&:hover': {
            color: colors.primary.light,
          },
        },
      },
    },
  },
} as const;

// 创建主题的钩子
export function useAppTheme() {
  return createTheme(themeOptions);
}

// 导出颜色对象供 Tailwind 使用
export default colors;
