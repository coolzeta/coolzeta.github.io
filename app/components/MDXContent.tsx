'use client';

import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import CodeBlock from './CodeBlock';
import MermaidCodeBlock from './MermaidCodeBlock';
import Prism from 'prismjs';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-solidity';
import 'prismjs/themes/prism-tomorrow.css';

// Initialize Prism
if (typeof window !== 'undefined') {
    Prism.manual = true;
}

// Helper to extract the actual code string from MDX children
const getCodeString = (children: any): string => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) {
        return children.map(child => {
            if (typeof child === 'string') return child;
            if (child?.props?.children) return getCodeString(child.props.children);
            return '';
        }).join('');
    }
    if (children?.props?.children) return getCodeString(children.props.children);
    return '';
};

// Helper to extract language from className
const getLanguage = (className?: string): string => {
    if (!className) return 'text';
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : 'text';
};

// Custom components that can be used directly in MDX files
const customComponents = {
    CodeBlock: ({ children, language, className }: { children: any; language?: string; className?: string }) => {
        const codeString = getCodeString(children);
        const lang = language || getLanguage(className);
        return <CodeBlock className={`language-${lang}`}>{codeString}</CodeBlock>;
    },
    Mermaid: ({ children }: { children: any }) => {
        const codeString = getCodeString(children);
        return <MermaidCodeBlock>{codeString}</MermaidCodeBlock>;
    },
};

const components = {

    code: ({ children, className }: { children: any; className?: string }) => {
        const language = getLanguage(className).trim();
        const codeString = getCodeString(children).trim();
        console.log(codeString, language);
        if (language === 'mermaid') {
            return <MermaidCodeBlock>{codeString}</MermaidCodeBlock>;
        }

        return <CodeBlock className={language === 'solidity' ? 'language-javascript' : language}>{codeString}</CodeBlock>;
    },
    h1: (props: any) => (
        <Typography
            variant="h1"
            sx={{
                fontSize: '2.5rem',
                fontWeight: 700,
                mt: 4,
                mb: 2,
                color: 'success.main',
                borderBottom: 1,
                borderColor: 'success.light',
                pb: 1,
            }}
            {...props}
        />
    ),
    h2: (props: any) => (
        <Typography
            variant="h2"
            sx={{
                fontSize: '2rem',
                fontWeight: 600,
                mt: 4,
                mb: 2,
                color: 'success.light',
            }}
            {...props}
        />
    ),
    h3: (props: any) => (
        <Typography
            variant="h3"
            sx={{
                fontSize: '1.5rem',
                fontWeight: 600,
                mt: 3,
                mb: 2,
                color: 'info.main',
            }}
            {...props}
        />
    ),
    p: (props: any) => (
        <Typography
            variant="body1"
            component="div"
            sx={{
                my: 2,
                color: 'text.primary',
                lineHeight: 1.8,
            }}
            {...props}
        />
    ),
    ul: (props: any) => (
        <Box
            component="ul"
            sx={{
                pl: 4,
                my: 2,
                color: 'text.primary',
                '& li': {
                    mb: 1,
                    '&::marker': {
                        color: 'info.light',
                    },
                },
            }}
            {...props}
        />
    ),
    ol: (props: any) => (
        <Box
            component="ol"
            sx={{
                pl: 4,
                my: 2,
                color: 'text.primary',
                '& li': {
                    mb: 1,
                    '&::marker': {
                        color: 'info.light',
                    },
                },
            }}
            {...props}
        />
    ),
    li: (props: any) => (
        <Typography
            component="li"
            sx={{
                color: 'text.primary',
            }}
            {...props}
        />
    ),
    a: (props: any) => (
        <MuiLink
            sx={{
                color: 'warning.main',
                textDecoration: 'underline',
                '&:hover': {
                    color: 'warning.light',
                },
            }}
            {...props}
        />
    ),
    blockquote: (props: any) => (
        <Box
            component="blockquote"
            sx={{
                borderLeft: 4,
                borderColor: 'warning.main',
                pl: 2,
                my: 2,
                fontStyle: 'italic',
                color: 'warning.light',
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 1,
            }}
            {...props}
        />
    ),
    pre: (props: any) => (
        <Box
            component="pre"
            sx={{
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 1,
                overflowX: 'auto',
                my: 2,
                color: '#fff',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                '& code': {
                    color: '#fff',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    display: 'block',
                    minHeight: '2.5rem',
                    padding: '0.25rem 0',
                },
                '& .token.comment': {
                    color: '#a8b2c1',
                },
                '& .token.string': {
                    color: '#a5d6a7',
                },
                '& .token.number': {
                    color: '#90caf9',
                },
                '& .token.keyword': {
                    color: '#ef9a9a',
                },
                '& .token.function': {
                    color: '#ce93d8',
                },
                '& .token.class-name': {
                    color: '#80deea',
                },
                '& .token.operator': {
                    color: '#e0e0e0',
                },
                '& .token.punctuation': {
                    color: '#e0e0e0',
                },
                '& .token.property': {
                    color: '#90caf9',
                },
                '& .token.selector': {
                    color: '#a5d6a7',
                },
                '& .token.tag': {
                    color: '#ef9a9a',
                },
                '& .token.attr-name': {
                    color: '#90caf9',
                },
                '& .token.attr-value': {
                    color: '#a5d6a7',
                },
                '& .token.important': {
                    color: '#ef9a9a',
                    fontWeight: 'bold',
                },
                '& .token.bold': {
                    fontWeight: 'bold',
                },
                '& .token.italic': {
                    fontStyle: 'italic',
                },
                '& .token.entity': {
                    cursor: 'help',
                },
            }}
            {...props}
        />
    ),
    table: (props: any) => (
        <Box
            component="table"
            sx={{
                width: '100%',
                borderCollapse: 'collapse',
                my: 2,
                '& th, & td': {
                    border: 1,
                    borderColor: 'divider',
                    p: 1,
                },
                '& th': {
                    bgcolor: 'background.paper',
                    color: 'success.light',
                },
                '& tr:nth-of-type(even)': {
                    bgcolor: 'background.paper',
                },
            }}
            {...props}
        />
    ),
};

interface MDXContentProps {
    source: string;
}

export default function MDXContent({ source }: MDXContentProps) {
    const [mdxSource, setMdxSource] = useState<any>(null);

    useEffect(() => {
        const serializeMdx = async () => {
            const serialized = await serialize(source, {
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypePrism],
                },
                parseFrontmatter: true,
            });
            setMdxSource(serialized);
        };

        serializeMdx();
    }, [source]);

    if (!mdxSource) {
        return <Box sx={{ color: 'text.primary' }}>Loading...</Box>;
    }

    return (
        <Box sx={{ color: 'text.primary' }}>
            <MDXRemote {...mdxSource} components={{ ...components, ...customComponents }} />
        </Box>
    );
} 