'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Box } from '@mui/material';

// Configure mermaid with better default styling
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'monospace',
    themeVariables: {
        // Node colors
        primaryColor: '#326de6',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#1a56d6',
        // Line colors
        lineColor: '#666666',
        // Background colors
        mainBkg: '#ffffff',
        // Text colors
        textColor: '#000000',
        // Special node colors
        errorBkgColor: '#ff4444',
        errorTextColor: '#ffffff',
    },
    flowchart: {
        curve: 'basis',
        nodeSpacing: 50,
        rankSpacing: 50,
        useMaxWidth: true,
    }
});

interface MermaidProps {
    chart: string;
    id: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart, id }) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMermaid = async () => {
            if (elementRef.current) {

                // Update theme variables based on color scheme
                mermaid.initialize({
                    theme: 'default',
                    themeVariables: {
                        primaryColor: '#326de6',
                        primaryTextColor: '#ffffff',
                        primaryBorderColor: '#1a56d6',
                        lineColor: '#666666',
                        mainBkg: '#ffffff',
                        textColor: '#000000',
                        nodeBorder: '#326de6',
                        clusterBkg: '#f7fafc',
                    }
                });

                await mermaid.init(undefined, elementRef.current);
            }
        };

        initMermaid();
    }, [chart, id]);

    return (
        <div className="mermaid-wrapper my-8">
            <Box sx={{
                bgcolor: 'grey.600',
                minWidth: '100%',
                m: 0,
                p: 0,
                borderRadius: 5,
                '& p': {
                    color: 'primary.main',
                },
            }}>
                <div
                    className={`mermaid-${id}`}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'flex',
                        alignSelf: 'center',
                        justifyContent: 'center',
                    }}
                    ref={elementRef}
                >
                    {chart}
                </div>
            </Box>
        </div>
    );
};

export default Mermaid; 