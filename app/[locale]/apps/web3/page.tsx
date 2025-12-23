'use client';

import DAppsList from '@/app/components/DAppsList';
import { Box, Typography } from '@mui/material';

export default function Web3Page() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="h1" sx={{ textAlign: 'center', color: 'primary.main' }}>My DApps</Typography>
            <DAppsList />
        </Box>
    );
}