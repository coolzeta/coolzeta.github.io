'use client';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';
type LoadingProps = {
    loadingText: string;
}
export default function Loading() {
    return (
        <Box sx={{ display: 'flex', maxHeight: '100vh', maxWidth: '100vw', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #f0f0f0, #d0d0d0)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%' }}>

                <Box sx={{ textAlign: 'center' }}>
                    <motion.h2
                        style={{ color: '#3b82f6' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Loading...
                    </motion.h2>
                    <motion.p
                        style={{ color: '#3b82f6' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Preparing the stablecoin protocol...
                    </motion.p>
                </Box>
                <motion.div
                    style={{
                        position: 'relative'
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Outer ring */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            border: '4px solid transparent',
                            borderTopColor: '#3b82f6',
                            borderRightColor: '#3b82f6',
                            maxWidth: '128px',
                            maxHeight: '256px'
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Inner ring */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: '16px',
                            borderRadius: '50%',
                            border: '4px solid transparent',
                            borderTopColor: '#a855f7',
                            borderLeftColor: '#a855f7',
                            width: '128px',
                            height: '256px'
                        }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Center dot */}
                    <motion.div
                        style={{
                            inset: '40%',
                            borderRadius: '50%',
                            background: 'linear-gradient(to bottom right, #3b82f6, #a855f7)',
                            width: '64px',
                            height: '64px'
                        }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                </motion.div>
            </Box>
        </Box>
    );
} 