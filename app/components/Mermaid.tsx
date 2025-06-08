'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Box } from '@mui/material';

// Configure mermaid with better default styling
mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
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
        mainBkg: '#1a1a1a',
        // Text colors
        textColor: '#ffffff',
        // Special node colors
        errorBkgColor: '#ff4444',
        errorTextColor: '#ffffff',
        // Additional colors for better visibility
        nodeBorder: '#326de6',
        clusterBkg: '#2a2a2a',
        clusterBorder: '#326de6',
        labelBoxBkgColor: '#2a2a2a',
        labelBoxBorderColor: '#326de6',
        labelTextColor: '#ffffff',
        loopTextColor: '#ffffff',
        sectionBkgColor: '#2a2a2a',
        sectionBkgColor2: '#1a1a1a',
        sectionBkgColor3: '#2a2a2a',
        sectionBkgColor4: '#1a1a1a',
        sectionBkgColor5: '#2a2a2a',
        sectionBkgColor6: '#1a1a1a',
        sectionBkgColor7: '#2a2a2a',
        sectionBkgColor8: '#1a1a1a',
        sectionBkgColor9: '#2a2a2a',
        sectionBkgColor10: '#1a1a1a',
    },
    flowchart: {
        curve: 'basis',
        nodeSpacing: 50,
        rankSpacing: 50,
        useMaxWidth: true,
    },
    sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        bottomMarginAdj: 1,
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
                    theme: 'dark',
                    themeVariables: {
                        primaryColor: '#326de6',
                        primaryTextColor: '#ffffff',
                        primaryBorderColor: '#1a56d6',
                        lineColor: '#666666',
                        mainBkg: '#1a1a1a',
                        textColor: '#ffffff',
                        nodeBorder: '#326de6',
                        clusterBkg: '#2a2a2a',
                        clusterBorder: '#326de6',
                        labelBoxBkgColor: '#2a2a2a',
                        labelBoxBorderColor: '#326de6',
                        labelTextColor: '#ffffff',
                        loopTextColor: '#ffffff',
                        sectionBkgColor: '#2a2a2a',
                        sectionBkgColor2: '#1a1a1a',
                        sectionBkgColor3: '#2a2a2a',
                        sectionBkgColor4: '#1a1a1a',
                        sectionBkgColor5: '#2a2a2a',
                        sectionBkgColor6: '#1a1a1a',
                        sectionBkgColor7: '#2a2a2a',
                        sectionBkgColor8: '#1a1a1a',
                        sectionBkgColor9: '#2a2a2a',
                        sectionBkgColor10: '#1a1a1a',
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
                bgcolor: 'background.paper',
                minWidth: '100%',
                m: 0,
                p: 2,
                borderRadius: 2,
                '& p': {
                    color: 'text.primary',
                },
                '& .mermaid': {
                    display: 'flex',
                    justifyContent: 'center',
                    '& svg': {
                        maxWidth: '100%',
                        height: 'auto',
                    },
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