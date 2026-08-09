import { Box } from '@mui/material';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Box component="main" sx={{ width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
