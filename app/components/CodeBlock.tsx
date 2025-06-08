'use client';

import { Box } from '@mui/material';
import { CodeBlock as ReactCodeBlock } from 'react-code-block';

interface CodeBlockProps {
    children: any;
    className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
    const language = className ? className.replace('language-', '') : 'text';

    // Convert children to string, handling arrays and objects
    const codeContent = Array.isArray(children)
        ? children.map(child => String(child)).join('')
        : String(children);
    console.log(language, codeContent, 1322131);
    if (!className || language === 'text') {
        return (
            <Box
                component="code"
                sx={{
                    bgcolor: 'background.paper',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    color: 'text.primary',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    display: 'inline',
                }}
            >
                {codeContent.trim()}
            </Box>
        );
    }

    return (
        <Box sx={{ my: 2 }}>
            <ReactCodeBlock code={codeContent.trim()} language={language}>
                <ReactCodeBlock.Code
                    className="bg-background-paper"
                    style={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        minHeight: '2.5rem',
                        color: '#fff',
                    }}
                >
                    <ReactCodeBlock.LineContent style={{ padding: '0.25rem 0', color: '#fff' }}>
                        <ReactCodeBlock.Token />
                    </ReactCodeBlock.LineContent>
                </ReactCodeBlock.Code>
            </ReactCodeBlock>
        </Box>
    );
} 