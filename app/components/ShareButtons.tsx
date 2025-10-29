'use client';

import { Box, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import {
    Share as ShareIcon,
    Twitter,
    Facebook,
    LinkedIn,
    ContentCopy,
} from '@mui/icons-material';
import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
    url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const handleShare = async (platform: string) => {
        const shareUrl = `${window.location.origin}${url}`;
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(shareUrl);

        switch (platform) {
            case 'twitter':
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
                    '_blank'
                );
                break;
            case 'facebook':
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                    '_blank'
                );
                break;
            case 'linkedin':
                window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
                    '_blank'
                );
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    setSnackbar({ open: true, message: 'Copied to clipboard!' });
                } catch (err) {
                    setSnackbar({ open: true, message: 'Failed to copy to clipboard' });
                }
                break;
            case 'native':
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: title,
                            url: shareUrl,
                        });
                    } catch (err) {
                        console.error('Error sharing:', err);
                    }
                }
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    right: { xs: 8, sm: 16, md: 32 },
                    top: { xs: 'auto', sm: '50%' },
                    bottom: { xs: 80, sm: 'auto' },
                    transform: { xs: 'none', sm: 'translateY(-50%)' },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 0.5, sm: 1 },
                    zIndex: 1000,
                }}
            >
                <Tooltip title="Copy link" placement="left">
                    <IconButton
                        color="primary"
                        onClick={() => handleShare('copy')}
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 2,
                            '&:hover': {
                                bgcolor: 'primary.light',
                            },
                        }}
                    >
                        <ContentCopy />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Twitter" placement="left">
                    <IconButton
                        color="info"
                        onClick={() => handleShare('twitter')}
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 2,
                            '&:hover': {
                                bgcolor: '#1DA1F2',
                                color: 'white',
                            },
                        }}
                    >
                        <Twitter />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Facebook" placement="left">
                    <IconButton
                        color="primary"
                        onClick={() => handleShare('facebook')}
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 2,
                            '&:hover': {
                                bgcolor: '#1877F2',
                                color: 'white',
                            },
                        }}
                    >
                        <Facebook />
                    </IconButton>
                </Tooltip>

                <Tooltip title="LinkedIn" placement="left">
                    <IconButton
                        color="primary"
                        onClick={() => handleShare('linkedin')}
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 2,
                            '&:hover': {
                                bgcolor: '#0077B5',
                                color: 'white',
                            },
                        }}
                    >
                        <LinkedIn />
                    </IconButton>
                </Tooltip>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <Tooltip title="Share using system" placement="left">
                        <IconButton
                            color="success"
                            onClick={() => handleShare('native')}
                            sx={{
                                bgcolor: 'background.paper',
                                boxShadow: 2,
                                '&:hover': {
                                    bgcolor: 'success.light',
                                },
                            }}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar({ open: false, message: '' })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ open: false, message: '' })}
                    severity="success"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
