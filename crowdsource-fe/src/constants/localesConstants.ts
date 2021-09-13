import { LOCALES_MAPPING, i18n } from '../../next-i18next.config';

export const DEFAULT_LOCALE = i18n.defaultLocale;

export const DISPLAY_LANGUAGES = {
  [LOCALES_MAPPING.en]: 'English',
  [LOCALES_MAPPING.hi]: 'हिंदी',
} as const;

export const RAW_LANGUAGES = {
  [LOCALES_MAPPING.en]: 'English',
  [LOCALES_MAPPING.hi]: 'Hindi',
} as const;
