// eslint-disable-next-line import/order
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const config = require('config');
const ConfigWebpackPlugin = require('config-webpack');
const withTM = require('next-transpile-modules')(['@amcharts/amcharts4']);

const { i18n } = require('./next-i18next.config');

// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  basePath: config.get('fe.contextRoot'),
  reactStrictMode: true,
  poweredByHeader: false,
  i18n,
  // Force .page prefix on page files (ex. index.page.tsx) so generated files can be included in /pages directory without Next.js throwing build errors
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  webpack: config => {
    config.module.rules.push({ test: /\.test.(jsx?|tsx?)$/, loader: 'ignore-loader' });
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });

    config.plugins.push(new ConfigWebpackPlugin('CROWDSOURCE_FE_NODE_CONFIG'));

    config.externals.push(function ({ context, request }, callback) {
      if (/xlsx|canvg|pdfmake/.test(request)) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    });

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
      @import '~bootstrap/scss/_utilities.scss';
    `,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: process.env.NODE_CONFIG_ENV === 'dev',

  // generateBuildId: async () => {
  //   return 'v1.0.0';
  // },

  async headers() {
    return [
      {
        source: '/(.*)',
        locale: false,
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/(.*)(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=9999999999, must-revalidate',
          },
        ],
      },
    ];
  },
  // assetPrefix: process.env.NODE_CONFIG_ENV ? `${config.get('fe.staticFileUrl')}/assets` : '',
};

module.exports = withBundleAnalyzer(withTM(nextConfig));
