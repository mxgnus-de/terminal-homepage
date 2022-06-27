/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    images: {
        domains: ['github-readme-stats.vercel.app'],
    }
};

module.exports = nextConfig;
