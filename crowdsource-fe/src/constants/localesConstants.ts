import { LOCALES_MAPPING, i18n } from '../../next-i18next.config';

export const DEFAULT_LOCALE = i18n.defaultLocale;
export const localeCookieName = 'NEXT_LOCALE';

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

export const LOCALES_LANGUAGE_MAPPING = {
  English: 'English',
  Hindi: 'Hindi',
  Tamil: 'Tamil',
  Telugu: 'Telugu',
  Assamese: 'Assamese',
  Bengali: 'Bengali',
  Gujarati: 'Gujarati',
  Kannada: 'Kannada',
  Malayalam: 'Malayalam',
  Marathi: 'Marathi',
  Odia: 'Odia',
  Punjabi: 'Punjabi',
};

export const LOCALE_LANGUAGES = {
  [LOCALES_LANGUAGE_MAPPING.English]: 'en',
  [LOCALES_LANGUAGE_MAPPING.Hindi]: 'hi',
  [LOCALES_LANGUAGE_MAPPING.Tamil]: 'ta',
  [LOCALES_LANGUAGE_MAPPING.Telugu]: 'te',
  [LOCALES_LANGUAGE_MAPPING.Assamese]: 'as',
  [LOCALES_LANGUAGE_MAPPING.Bengali]: 'bn',
  [LOCALES_LANGUAGE_MAPPING.Gujarati]: 'gu',
  [LOCALES_LANGUAGE_MAPPING.Kannada]: 'kn',
  [LOCALES_LANGUAGE_MAPPING.Malayalam]: 'ml',
  [LOCALES_LANGUAGE_MAPPING.Marathi]: 'mr',
  [LOCALES_LANGUAGE_MAPPING.Odia]: 'or',
  [LOCALES_LANGUAGE_MAPPING.Punjabi]: 'pa',
} as const;
