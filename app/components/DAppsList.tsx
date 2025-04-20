'use client';

import { Box, Card, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material';
import { DApp, dapps } from '../config/dapps';
import Image from 'next/image';

const statusColors = {
    live: 'success',
    beta: 'warning',
    development: 'info'
} as const;

export default function DAppsList() {
    return (
        <Box sx={{ py: 4, px: 4 }}>
            <Grid container spacing={3} justifyContent="center">
                {dapps.map((dapp: DApp, index: number) => (
                    <Grid item xs={12} sm={6} md={4} key={dapp.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.2s ease-in-out',
                                    boxShadow: 3
                                }
                            }}
                            onClick={() => window.open(dapp.url, '_blank')}
                        >
                            <Image
                                src={dapp.imageUrl}
                                alt={dapp.name}
                                width={800}
                                height={600}
                                layout='responsive'
                                priority={index <= 5}
                                style={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" component="h2">
                                        {dapp.name}
                                    </Typography>
                                    <Chip
                                        label={dapp.status}
                                        color={statusColors[dapp.status]}
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {dapp.description}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {dapp.tags.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
} 