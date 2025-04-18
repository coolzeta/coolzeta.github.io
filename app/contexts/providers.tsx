'use client';

import { ThemeProvider } from '@mui/material/styles';
import { useAppTheme } from '../theme/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useAppTheme();

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
} 