'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

type LoadingProps = {
    loadingText?: string;
}

export default function Loading({ loadingText = 'Loading...' }: LoadingProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                width: '100vw',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4
                }}
            >
                {/* Loading Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                        {/* Outer ring */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: '50%',
                                border: '4px solid rgba(255, 255, 255, 0.1)',
                                borderTopColor: '#fff',
                                borderRightColor: '#fff',
                            }}
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />

                        {/* Middle ring */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                right: 16,
                                bottom: 16,
                                borderRadius: '50%',
                                border: '4px solid rgba(255, 255, 255, 0.1)',
                                borderTopColor: 'rgba(255, 255, 255, 0.6)',
                                borderLeftColor: 'rgba(255, 255, 255, 0.6)',
                            }}
                            animate={{ rotate: -360 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />

                        {/* Inner dot */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </Box>
                </motion.div>

                {/* Loading Text */}
                <Box sx={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                color: 'white',
                                fontWeight: 600,
                                mb: 1,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            {loadingText}
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                            }}
                        >
                            Preparing the stablecoin protocol...
                        </Typography>
                    </motion.div>

                    {/* Animated dots */}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                }}
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
} 