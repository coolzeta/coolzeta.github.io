'use client';

import { Box, Button, Chip, Container, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ConstructionRounded from '@mui/icons-material/ConstructionRounded';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function Dapp2() {
  const locale = useLocale();
  const router = useRouter();
  const isZh = locale === 'zh';

  return (
    <Box className="experiment-shell">
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => router.push(`/${locale}/apps/web3`)}
        >
          {isZh ? '返回实验室' : 'Back to playground'}
        </Button>
        <Box className="experiment-coming">
          <Box className="coming-orbit">
            <ConstructionRounded />
          </Box>
          <Typography className="subpage-kicker">EXPERIMENT / 02</Typography>
          <Typography component="h1">Crypto Plants vs. Zombies</Typography>
          <Typography>
            {isZh
              ? '正在把塔防、NFT 角色与链上经济拆成一个可以玩的小实验。现在还在长叶子。'
              : 'Turning tower defense, NFT characters, and an onchain economy into a small playable experiment. Still growing leaves.'}
          </Typography>
          <Box className="coming-tags">
            {['GAMEFI', 'NFT', 'IN PROGRESS'].map(tag => (
              <Chip key={tag} label={tag} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
