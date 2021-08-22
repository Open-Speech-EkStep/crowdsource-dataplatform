const LOCALES_MAPPING = {
  en: 'en',
  hi: 'hi',
  gu: 'gu',
  pa: 'pa',
};

module.exports = {
  LOCALES_MAPPING,
  i18n: {
    defaultLocale: LOCALES_MAPPING.en,
    locales: Object.values(LOCALES_MAPPING),
  },
};
