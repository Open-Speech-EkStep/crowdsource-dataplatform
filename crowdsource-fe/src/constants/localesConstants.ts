import { LOCALES_MAPPING, i18n } from '../../next-i18next.config';

export const DEFAULT_LOCALE = i18n.defaultLocale;

export const DISPLAY_LANGUAGES = {
  [LOCALES_MAPPING.en]: 'English',
  [LOCALES_MAPPING.hi]: 'हिंदी',
  [LOCALES_MAPPING.ta]: 'தமிழ்',
  [LOCALES_MAPPING.te]: 'తెలుగు',
  [LOCALES_MAPPING.as]: 'অসমীয়া',
  [LOCALES_MAPPING.bn]: 'বাংলা',
  [LOCALES_MAPPING.gu]: 'ગુજરાતી',
  [LOCALES_MAPPING.kn]: 'ಕನ್ನಡ',
  [LOCALES_MAPPING.ml]: 'മലയാളം',
  [LOCALES_MAPPING.mr]: 'मराठी',
  [LOCALES_MAPPING.or]: 'ଓଡିଆ',
  [LOCALES_MAPPING.pa]: 'ਪੰਜਾਬੀ',
} as const;

export const RAW_LANGUAGES = {
  [LOCALES_MAPPING.en]: 'English',
  [LOCALES_MAPPING.hi]: 'Hindi',
  [LOCALES_MAPPING.ta]: 'Tamil',
  [LOCALES_MAPPING.te]: 'Telugu',
  [LOCALES_MAPPING.as]: 'Assamese',
  [LOCALES_MAPPING.bn]: 'Bengali',
  [LOCALES_MAPPING.gu]: 'Gujarati',
  [LOCALES_MAPPING.kn]: 'Kannada',
  [LOCALES_MAPPING.ml]: 'Malayalam',
  [LOCALES_MAPPING.mr]: 'Marathi',
  [LOCALES_MAPPING.or]: 'Odia',
  [LOCALES_MAPPING.pa]: 'Punjabi',
} as const;
