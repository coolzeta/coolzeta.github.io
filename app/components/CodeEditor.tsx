'use client';

import { Box, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SendIcon from '@mui/icons-material/Send';

const developerCode = `class Developer {
  name = "Zeta";
  role = "Frontend Engineer";
  location = "Hong Kong 🇭🇰";
  personality = "INTJ";
  
  experience = {
    years: 3,
    current: "Licensed Crypto Exchange",
    focus: ["Web3", "DeFi", "Frontend"]
  };
  
  skills = {
    web3: ["Solidity", "Web3.js", "Smart Contracts"],
    ai: ["LangChain", "ComfyUI", "Stable Diffusion", "RAG"],
    frontend: ["React", "Next.js", "TypeScript", "MUI"]
  };
  
  passion = [
    "🔗 Blockchain & Cryptography",
    "🤖 AI & AIGC Technology", 
    "💻 Building Cool Stuff",
    "📚 Continuous Learning"
  ];
  
  getCurrentMission() {
    return "Exploring the intersection of Web3 and AI";
  }
}

const zeta = new Developer();
console.log(zeta.getCurrentMission());
// Output: "Exploring the intersection of Web3 and AI"`;

export default function CodeEditor() {
  const t = useTranslations();
  const [hasClicked, setHasClicked] = useState(false);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (hasClicked) return;
    setHasClicked(true);
    setIsTyping(true);

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < developerCode.length) {
        setDisplayedCode(developerCode.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 20);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 6, md: 10 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            textAlign: 'center',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('home.codeEditor.sectionTitle')}
        </Typography>

        <Box
          sx={{
            maxWidth: '900px',
            margin: '0 auto',
            background:
              'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2d2d2d 0%, #1e1e1e 100%)',
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderBottom: '1px solid rgba(76, 175, 80, 0.2)',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              AI
            </Box>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                {t('home.codeEditor.chat.aiName')}
              </Typography>
              <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                {t('home.codeEditor.chat.status')}
              </Typography>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              minHeight: '400px',
              maxHeight: '600px',
              overflowY: 'auto',
              // Custom scrollbar styling
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(76, 175, 80, 0.5)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(76, 175, 80, 0.7)',
                },
              },
            }}
          >
            {/* AI Initial Message */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                <Box
                  sx={{
                    maxWidth: '80%',
                    background: 'rgba(45, 45, 45, 0.8)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    color: '#d4d4d4',
                    px: 3,
                    py: 2,
                    borderRadius: 3,
                    borderBottomLeftRadius: 0.5,
                  }}
                >
                  <Typography sx={{ fontSize: '0.95rem' }}>
                    {t('home.codeEditor.chat.aiGreeting')}
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* User Response (after click) */}
            {hasClicked && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Box
                    sx={{
                      maxWidth: '80%',
                      background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                      color: '#fff',
                      px: 3,
                      py: 2,
                      borderRadius: 3,
                      borderBottomRightRadius: 0.5,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      {t('home.codeEditor.chat.userMessage')}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* AI Code Response */}
            {hasClicked && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      maxWidth: '90%',
                      background: 'rgba(45, 45, 45, 0.8)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      color: '#d4d4d4',
                      px: 3,
                      py: 2,
                      borderRadius: 3,
                      borderBottomLeftRadius: 0.5,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.95rem', mb: 2, color: '#a0a0a0' }}>
                      {t('home.codeEditor.chat.aiResponse')}
                    </Typography>

                    {/* Code Block */}
                    <Box
                      sx={{
                        background: '#1e1e1e',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                      }}
                    >
                      {/* Code Header */}
                      <Box
                        sx={{
                          background: '#2d2d2d',
                          px: 2,
                          py: 1,
                          borderBottom: '1px solid rgba(76, 175, 80, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#ff5f56',
                          }}
                        />
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#ffbd2e',
                          }}
                        />
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#27c93f',
                          }}
                        />
                        <Typography
                          sx={{
                            ml: 1,
                            color: '#a0a0a0',
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                          }}
                        >
                          developer.ts
                        </Typography>
                      </Box>

                      {/* Code Content */}
                      <Box
                        sx={{
                          p: 2,
                          fontFamily: '"Fira Code", "Courier New", monospace',
                          fontSize: { xs: '0.7rem', sm: '0.85rem' },
                          lineHeight: 1.6,
                          overflowY: 'auto',
                          // Custom scrollbar styling
                          '&::-webkit-scrollbar': {
                            width: '8px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '4px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(76, 175, 80, 0.5)',
                            borderRadius: '4px',
                            '&:hover': {
                              background: 'rgba(76, 175, 80, 0.7)',
                            },
                          },
                        }}
                      >
                        <pre
                          style={{
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontFamily: 'inherit',
                          }}
                        >
                          <code>
                            {displayedCode.split('\n').map((line, index) => (
                              <Box
                                key={index}
                                component="span"
                                sx={{ display: 'block', lineHeight: 1.6 }}
                              >
                                {highlightCode(line)}
                              </Box>
                            ))}
                            {isTyping && (
                              <Box
                                component="span"
                                sx={{
                                  display: 'inline-block',
                                  width: '8px',
                                  height: '16px',
                                  bgcolor: '#4caf50',
                                  animation: 'blink 1s step-end infinite',
                                  ml: 0.5,
                                  '@keyframes blink': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0 },
                                  },
                                }}
                              />
                            )}
                          </code>
                        </pre>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            )}
          </Box>

          {/* Chat Input */}
          <Box
            sx={{
              borderTop: '1px solid rgba(76, 175, 80, 0.2)',
              p: 2,
              background: 'rgba(30, 30, 30, 0.5)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                background: 'rgba(45, 45, 45, 0.8)',
                borderRadius: 3,
                px: 2,
                py: 1.5,
                border: '1px solid rgba(76, 175, 80, 0.3)',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  color: hasClicked ? '#666' : '#d4d4d4',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  py: 0.5,
                  cursor: hasClicked ? 'not-allowed' : 'text',
                }}
              >
                {hasClicked
                  ? t('home.codeEditor.chat.inputPlaceholderSent')
                  : t('home.codeEditor.chat.inputPlaceholder')}
              </Box>
              <IconButton
                onClick={handleSend}
                disabled={hasClicked}
                sx={{
                  background: hasClicked
                    ? 'rgba(76, 175, 80, 0.3)'
                    : 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: '#fff',
                  animation: hasClicked ? 'none' : 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.9), 0 0 20px rgba(76, 175, 80, 0.5)',
                      transform: 'scale(1)',
                    },
                    '50%': {
                      boxShadow: '0 0 0 15px rgba(76, 175, 80, 0), 0 0 30px rgba(76, 175, 80, 0.8)',
                      transform: 'scale(1.15)',
                    },
                  },
                  '&:hover': {
                    background: hasClicked
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                    animation: 'none',
                  },
                  '&.Mui-disabled': {
                    color: '#888',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}

// Syntax highlighting
function highlightCode(line: string) {
  if (!line) return line;

  const escapeHtml = (str: string) => {
    return str.replace(/[&<>]/g, char => {
      switch (char) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        default:
          return char;
      }
    });
  };

  const tokens: Array<{ type: string; value: string }> = [];
  let remaining = line;

  const commentMatch = remaining.match(/\/\/.*/);
  if (commentMatch) {
    const beforeComment = remaining.slice(0, commentMatch.index);
    const comment = commentMatch[0];

    if (beforeComment) {
      processNonComment(beforeComment, tokens);
    }
    tokens.push({ type: 'comment', value: comment });
  } else {
    processNonComment(remaining, tokens);
  }

  function processNonComment(text: string, tokens: Array<{ type: string; value: string }>) {
    const keywords = ['const', 'let', 'var', 'new', 'return', 'class', 'console', 'log'];
    const stringRegex = /["'`][^"'`]*["'`]/g;

    const stringMatches: Array<{ start: number; end: number; value: string }> = [];
    let match;

    while ((match = stringRegex.exec(text)) !== null) {
      stringMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        value: match[0],
      });
    }

    let pos = 0;
    for (const strMatch of stringMatches) {
      if (pos < strMatch.start) {
        const beforeString = text.slice(pos, strMatch.start);
        processKeywords(beforeString, tokens, keywords);
      }
      tokens.push({ type: 'string', value: strMatch.value });
      pos = strMatch.end;
    }

    if (pos < text.length) {
      const remaining = text.slice(pos);
      processKeywords(remaining, tokens, keywords);
    }
  }

  function processKeywords(
    text: string,
    tokens: Array<{ type: string; value: string }>,
    keywords: string[]
  ) {
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    let lastIndex = 0;
    let match;

    while ((match = keywordRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'normal', value: text.slice(lastIndex, match.index) });
      }
      tokens.push({ type: 'keyword', value: match[0] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      tokens.push({ type: 'normal', value: text.slice(lastIndex) });
    }
  }

  const html = tokens
    .map(token => {
      const escaped = escapeHtml(token.value);
      switch (token.type) {
        case 'keyword':
          return `<span style="color: #569cd6">${escaped}</span>`;
        case 'string':
          return `<span style="color: #ce9178">${escaped}</span>`;
        case 'comment':
          return `<span style="color: #6a9955">${escaped}</span>`;
        default:
          return escaped;
      }
    })
    .join('');

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
