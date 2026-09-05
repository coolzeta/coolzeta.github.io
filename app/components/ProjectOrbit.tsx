import { Box, Typography } from '@mui/material';

interface ProjectOrbitProps {
  locale: 'zh' | 'en';
}

const interests = [
  {
    name: { en: 'AI Agents', zh: 'AI 智能体' },
    type: { en: 'AUTONOMY / TOOLS', zh: '自主 / 工具' },
    state: { en: 'EXPLORING', zh: '探索中' },
    accent: '#b8ff61',
    offset: '4%',
  },
  {
    name: { en: 'Prediction Markets', zh: '预测市场' },
    type: { en: 'SIGNALS / BELIEF', zh: '信号 / 概率' },
    state: { en: 'WATCHING', zh: '关注中' },
    accent: '#7fdc9a',
    offset: '13%',
  },
  {
    name: { en: 'Mechanism Design', zh: '机制设计' },
    type: { en: 'INCENTIVES / SYSTEMS', zh: '激励 / 系统' },
    state: { en: 'STUDYING', zh: '学习中' },
    accent: '#d9ff8c',
    offset: '1%',
  },
  {
    name: { en: 'Human–AI Interfaces', zh: '人机交互' },
    type: { en: 'VOICE / INTERACTION', zh: '语音 / 交互' },
    state: { en: 'BUILDING', zh: '制作中' },
    accent: '#9eeec0',
    offset: '9%',
  },
  {
    name: { en: 'Onchain Coordination', zh: '链上协作' },
    type: { en: 'GOVERNANCE / MARKETS', zh: '治理 / 市场' },
    state: { en: 'THINKING', zh: '思考中' },
    accent: '#79d9a5',
    offset: '18%',
  },
  {
    name: { en: 'Creative Coding', zh: '创意编程' },
    type: { en: 'VISUAL / PLAY', zh: '视觉 / 玩耍' },
    state: { en: 'MAKING', zh: '实验中' },
    accent: '#c9ff77',
    offset: '6%',
  },
  {
    name: { en: 'Electronic Music', zh: '电子音乐' },
    type: { en: 'SOUND / SYNTHESIS', zh: '声音 / 合成' },
    state: { en: 'PLAYING', zh: '玩耍中' },
    accent: '#a7df75',
    offset: '15%',
  },
];

export default function ProjectOrbit({ locale }: ProjectOrbitProps) {
  return (
    <Box
      className="interest-board"
      aria-label={locale === 'zh' ? 'Zeta 最近感兴趣的方向' : "Zeta's current interests"}
    >
      <Box className="interest-board-head">
        <Typography component="span">
          {locale === 'zh' ? '兴趣索引 / 近期' : 'INTEREST INDEX / RECENT'}
        </Typography>
      </Box>

      <Box className="interest-list">
        {interests.map((interest, index) => (
          <Box
            component="article"
            className="interest-line"
            key={interest.name.en}
            sx={
              {
                '--interest-accent': interest.accent,
                '--interest-offset': interest.offset,
              } as React.CSSProperties
            }
          >
            <span className="interest-number">{String(index + 1).padStart(2, '0')}</span>
            <Box className="interest-line-copy">
              <Typography component="strong">{interest.name[locale]}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
