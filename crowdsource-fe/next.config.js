const ConfigWebpackPlugin = require('config-webpack');

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
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });

    config.plugins.push(new ConfigWebpackPlugin('CROWDSOURCE_FE_NODE_CONFIG'));

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
  sassOptions: {
    prependData: `
      @import '~bootstrap/scss/_functions.scss';
      @import '~bootstrap/scss/_variables.scss';
      @import '~bootstrap/scss/_mixins.scss';
    `,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: process.env.NODE_CONFIG_ENV === 'dev',
};

module.exports = nextConfig;
