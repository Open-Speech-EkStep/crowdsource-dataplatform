import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import jestFetchMock from 'jest-fetch-mock';

jest.mock('next/dist/client/router', () => {
  const router = require('next-router-mock');
  const i18nConfig = require('./next-i18next.config');

  router.default.locales = i18nConfig.i18n.locales;
  router.default.locale = i18nConfig.i18n.defaultLocale;

  return router;
});

jest.mock('react-i18next', () => {
  const { Fragment } = require('react');

  return {
    useTranslation: () => ({ t: key => key }),
    Trans: ({ components }) =>
      Object.values(components).map((component, index) => <Fragment key={index}>{component}</Fragment>),
  };
});

// As we're testing on the JSDOM, color-contrast testing can't run.
// The types of results fetched are limited for performance reasons
configureAxe({
  rules: {
    'color-contrast': { enabled: false },
  },
  resultTypes: ['violations', 'incomplete'],
});
expect.extend(toHaveNoViolations);

global.CROWDSOURCE_FE_NODE_CONFIG = {
  fe: {
    apiUrl: '',
    cdnUrl: '',
    staticFileUrl: '',
    whitelistingEmail: false,
    showDataSource: false,
    feedbackTopComponent: false,
    contextRoot: '',
    enabled_languages: ['as', 'bn', 'en', 'gu', 'hi', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te'],
    enabledPages: {},
  },
};

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

jest.setTimeout(30000);

configure({
  asyncUtilTimeout: 15000,
});

console.error = message => {
  throw new Error(message);
};

beforeEach(() => {
  jestFetchMock.enableMocks();

  localStorage.clear();

  jest.spyOn(Storage.prototype, 'getItem');
  jest.spyOn(Storage.prototype, 'setItem');
  jest.spyOn(Storage.prototype, 'removeItem');
});

afterEach(() => {
  fetchMock.resetMocks();

  Storage.prototype.getItem.mockClear();
  Storage.prototype.setItem.mockClear();
  Storage.prototype.removeItem.mockClear();
});
