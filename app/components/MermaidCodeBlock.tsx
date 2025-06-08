'use client';

import { Box } from '@mui/material';
import Mermaid from './Mermaid';

interface MermaidCodeBlockProps {
    children: any;
}

export default function MermaidCodeBlock({ children }: MermaidCodeBlockProps) {
    // Convert children to string, handling arrays and objects
    const chart = typeof children === 'string'
        ? children
        : Array.isArray(children)
            ? children.map(child => {
                if (typeof child === 'string') return child;
                if (child?.props?.children) return String(child.props.children);
                return '';
            }).join('')
            : String(children);

    // Generate a stable ID based on the chart content
    const id = Buffer.from(chart).toString('base64').slice(0, 8);

    if (!chart.trim()) {
        return (
            <Box sx={{ color: 'error.main', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                Empty Mermaid chart content
            </Box>
        );
    }

    return (
        <Box sx={{ my: 2 }}>
            <Mermaid chart={chart.trim()} id={id} />
        </Box>
    );
} 