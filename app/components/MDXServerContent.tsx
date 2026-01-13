import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import { Box, Typography } from '@mui/material';
import CodeBlock from './CodeBlock';
import MermaidCodeBlock from './MermaidCodeBlock';
import 'prismjs/themes/prism-tomorrow.css';

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

const components = {
    code: ({ children, className }: { children: any; className?: string }) => {
        const language = getLanguage(className).trim();
        const codeString = getCodeString(children).trim();

        if (language === 'mermaid') {
            return <MermaidCodeBlock>{codeString}</MermaidCodeBlock>;
        }

        return <CodeBlock className={language === 'solidity' ? 'language-javascript' : `language-${language}`}>{codeString}</CodeBlock>;
    },
    img: (props: any) => (
        <Box
            component="img"
            sx={{
                display: 'block',
                margin: '0 auto',
                borderRadius: 2,
                boxShadow: 1,
                mb: 2,
                alignSelf: 'center',
                maxWidth: '100%',
                height: 'auto',
                width: 'auto',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                },
            }}
            {...props}
        />
    ),
    h1: (props: any) => (
        <Typography
            variant="h1"
            sx={{
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mt: { xs: 2, sm: 3, md: 4 },
                mb: 2,
                color: 'success.main',
                borderBottom: 1,
                borderColor: 'success.light',
                pb: 1,
                wordBreak: 'break-word',
            }}
            {...props}
        />
    ),
    h2: (props: any) => (
        <Typography
            variant="h2"
            sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                fontWeight: 600,
                mt: { xs: 3, sm: 3, md: 4 },
                mb: 2,
                color: 'success.light',
                wordBreak: 'break-word',
            }}
            {...props}
        />
    ),
    h3: (props: any) => (
        <Typography
            variant="h3"
            sx={{
                fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' },
                fontWeight: 600,
                mt: { xs: 2, sm: 2.5, md: 3 },
                mb: 2,
                color: 'info.main',
                wordBreak: 'break-word',
            }}
            {...props}
        />
    ),
    h4: (props: any) => (
        <Typography
            variant="h4"
            sx={{
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                fontWeight: 600,
                mt: { xs: 2, sm: 2, md: 2.5 },
                mb: 1.5,
                wordBreak: 'break-word',
            }}
            {...props}
        />
    ),
    h5: (props: any) => (
        <Typography
            variant="h5"
            sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                fontWeight: 600,
                mt: 2,
                mb: 1.5,
                wordBreak: 'break-word',
            }}
            {...props}
        />
    ),
    h6: (props: any) => (
        <Typography
            variant="h6"
            sx={{
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                fontWeight: 600,
                mt: 2,
                mb: 1.5,
                wordBreak: 'break-word',
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
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
            }}
            {...props}
        />
    ),
    ul: (props: any) => (
        <Box
            component="ul"
            sx={{
                my: 2,
                pl: { xs: 3, sm: 4 },
                '& li': {
                    my: 1,
                    color: 'text.primary',
                },
            }}
            {...props}
        />
    ),
    ol: (props: any) => (
        <Box
            component="ol"
            sx={{
                my: 2,
                pl: { xs: 3, sm: 4 },
                '& li': {
                    my: 1,
                    color: 'text.primary',
                },
            }}
            {...props}
        />
    ),
    li: (props: any) => (
        <Typography
            component="li"
            sx={{
                my: 0.5,
                color: 'text.primary',
                lineHeight: 1.8,
            }}
            {...props}
        />
    ),
    blockquote: (props: any) => (
        <Box
            component="blockquote"
            sx={{
                borderLeft: 4,
                borderColor: 'primary.main',
                pl: 2,
                py: 1,
                my: 2,
                bgcolor: 'action.hover',
                borderRadius: 1,
                '& p': {
                    my: 1,
                },
            }}
            {...props}
        />
    ),
    a: (props: any) => (
        <Box
            component="a"
            sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline',
                },
            }}
            {...props}
        />
    ),
    strong: (props: any) => (
        <Box
            component="strong"
            sx={{
                fontWeight: 700,
                color: 'success.main',
            }}
            {...props}
        />
    ),
    em: (props: any) => (
        <Box
            component="em"
            sx={{
                fontStyle: 'italic',
                color: 'text.secondary',
            }}
            {...props}
        />
    ),
    hr: (props: any) => (
        <Box
            component="hr"
            sx={{
                my: 4,
                border: 'none',
                borderTop: 1,
                borderColor: 'divider',
            }}
            {...props}
        />
    ),
    table: (props: any) => (
        <Box
            sx={{
                overflowX: 'auto',
                my: 2,
            }}
        >
            <Box
                component="table"
                sx={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    '& th, & td': {
                        border: 1,
                        borderColor: 'divider',
                        px: 2,
                        py: 1,
                    },
                    '& th': {
                        bgcolor: 'action.hover',
                        fontWeight: 600,
                    },
                }}
                {...props}
            />
        </Box>
    ),
};

interface MDXServerContentProps {
    source: string;
}

export default async function MDXServerContent({ source }: MDXServerContentProps) {
    return (
        <MDXRemote
            source={source}
            components={components}
            options={{
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypePrism],
                },
            }}
        />
    );
}
