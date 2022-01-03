const config = require('config');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: config.get('fe.enabled_locales'),
    reloadOnPrerender: process.env.NODE_ENV !== 'production',
  },
};
