const path = require('path');

process.env['NODE_CONFIG_DIR'] = path.resolve(__dirname, '../crowdsource-api/config');

const config = require('config');

const { i18n } = require('./next-i18next.config');

// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  i18n,
  // Force .page prefix on page files (ex. index.page.tsx) so generated files can be included in /pages directory without Next.js throwing build errors
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  webpack: config => {
    config.module.rules.push({ test: /\.test.(jsx?|tsx?)$/, loader: 'ignore-loader' });

    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: config.util.getEnv('NODE_CONFIG_ENV') === 'dev',
};

module.exports = nextConfig;
