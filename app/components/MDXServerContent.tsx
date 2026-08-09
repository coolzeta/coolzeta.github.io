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
    return children
      .map(child => {
        if (typeof child === 'string') return child;
        if (child?.props?.children) return getCodeString(child.props.children);
        return '';
      })
      .join('');
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

    return (
      <CodeBlock
        className={language === 'solidity' ? 'language-javascript' : `language-${language}`}
      >
        {codeString}
      </CodeBlock>
    );
  },
  img: (props: any) => (
    <Box
      component="img"
      sx={{
        display: 'block',
        margin: '0 auto',
        borderRadius: '3px 28px 3px 3px',
        boxShadow: '0 24px 70px rgba(0,0,0,.28)',
        border: '1px solid rgba(238,244,232,.1)',
        my: 5,
        alignSelf: 'center',
        maxWidth: '100%',
        height: 'auto',
        width: 'auto',
        transition: 'transform .35s ease',
        '&:hover': { transform: 'translateY(-3px)' },
      }}
      {...props}
    />
  ),
  h1: (props: any) => (
    <Typography
      variant="h1"
      sx={{
        fontSize: { xs: '2rem', sm: '2.6rem', md: '3.25rem' },
        lineHeight: 1.06,
        letterSpacing: '-.055em',
        fontWeight: 600,
        mt: { xs: 5, md: 8 },
        mb: 3,
        color: 'text.primary',
        wordBreak: 'break-word',
      }}
      {...props}
    />
  ),
  h2: (props: any) => (
    <Typography
      variant="h2"
      sx={{
        fontSize: { xs: '1.55rem', sm: '1.85rem', md: '2.15rem' },
        lineHeight: 1.2,
        letterSpacing: '-.04em',
        fontWeight: 560,
        mt: { xs: 5, md: 7 },
        mb: 2.5,
        color: 'text.primary',
        '&::before': {
          content: '""',
          display: 'inline-block',
          width: 18,
          height: 2,
          mr: 1.5,
          verticalAlign: 'middle',
          bgcolor: 'primary.main',
        },
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
        color: 'primary.dark',
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
        my: 2.5,
        color: 'rgba(238,244,232,.72)',
        fontSize: { xs: '1rem', md: '1.08rem' },
        lineHeight: 1.95,
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
        borderLeft: 2,
        borderColor: 'primary.main',
        px: { xs: 2.5, md: 4 },
        py: 2,
        my: 4,
        bgcolor: 'rgba(184,255,97,.035)',
        borderRadius: '0 18px 18px 0',
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
