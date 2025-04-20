'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useAppTheme } from '../theme/theme';
import { Box } from '@mui/material';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <Box sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        minWidth: '100%',
        m: 0,
        p: 0,
        border: 0
      }}>
        {children}
      </Box>
    </MuiThemeProvider>
  );
} 