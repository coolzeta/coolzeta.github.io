'use client';

import { Box, Typography, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 如果用户直接访问根路径，中间件会处理重定向
    // 这个页面只是作为备用，显示加载状态
    const timer = setTimeout(() => {
      router.push('/en');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Redirecting...
      </Typography>
    </Box>
  );
}