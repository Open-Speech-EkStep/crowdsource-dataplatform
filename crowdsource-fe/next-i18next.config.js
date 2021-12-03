const LOCALES_MAPPING = {
  en: 'en',
  hi: 'hi',
  ta: 'ta',
  te: 'te',
  as: 'as',
  bn: 'bn',
  gu: 'gu',
  kn: 'kn',
  ml: 'ml',
  mr: 'mr',
  or: 'or',
  pa: 'pa',
};

module.exports = {
  LOCALES_MAPPING,
  i18n: {
    defaultLocale: LOCALES_MAPPING.en,
    locales: Object.values(LOCALES_MAPPING),
    reloadOnPrerender: process.env.NODE_ENV !== 'production',
  },
};
