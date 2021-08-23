import '@testing-library/jest-dom/extend-expect';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import jestFetchMock from 'jest-fetch-mock';

jest.mock('next/router', () => {
  const router = require('next-router-mock');
  const i18nConfig = require('./next-i18next.config');

  router.default.locales = i18nConfig.i18n.locales;
  router.default.locale = i18nConfig.i18n.defaultLocale;

  return router;
});

jest.mock('next/link', () => {
  const { cloneElement } = require('react');
  const router = require('next-router-mock');

  return ({ children, href, replace, as, shallow, locale, scroll }) => {
    const onClick = () =>
      router.default[replace ? 'replace' : 'push'](href, as, {
        shallow,
        locale,
        scroll,
      });

    return cloneElement(children, {
      href,
      onClick,
    });
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

jestFetchMock.enableMocks();

// As we're testing on the JSDOM, color-contrast testing can't run.
// The types of results fetched are limited for performance reasons
configureAxe({
  rules: {
    'color-contrast': { enabled: false },
  },
  resultTypes: ['violations', 'incomplete'],
});
expect.extend(toHaveNoViolations);
