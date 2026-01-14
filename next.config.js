const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
    },
})

const withNextIntl = require('next-intl/plugin')(
    // This is the default (also the `src` folder is supported out of the box)
    './i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    experimental: {
        mdxRs: true,
    },
    transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material', '@mui/lab'],
    // Use standalone for better SSR/SSG hybrid support
    output: 'standalone',
}

module.exports = withNextIntl(withMDX(nextConfig)) 