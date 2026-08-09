'use client';

import { Box, Button, Snackbar, Alert, Typography } from '@mui/material';
import { Twitter, LinkedIn, ContentCopy, Share as ShareIcon } from '@mui/icons-material';
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

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        '_blank'
      );
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
    } else if (platform === 'native' && navigator.share) {
      await navigator.share({ title, url: shareUrl }).catch(() => undefined);
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setSnackbar({ open: true, message: 'Link copied' });
      } catch {
        setSnackbar({ open: true, message: 'Could not copy link' });
      }
    }
  };

  return (
    <>
      <Box className="article-share">
        <Typography>PASS IT ON</Typography>
        <Box>
          <Button startIcon={<ContentCopy />} onClick={() => handleShare('copy')}>
            Copy
          </Button>
          <Button startIcon={<Twitter />} onClick={() => handleShare('twitter')}>
            X
          </Button>
          <Button startIcon={<LinkedIn />} onClick={() => handleShare('linkedin')}>
            LinkedIn
          </Button>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button startIcon={<ShareIcon />} onClick={() => handleShare('native')}>
              Share
            </Button>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
