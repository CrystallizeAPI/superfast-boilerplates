/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.symlinks = false;
        return config;
    },
    reactStrictMode: true,
    experimental: {
        appDir: true,
    },
};

module.exports = nextConfig;
