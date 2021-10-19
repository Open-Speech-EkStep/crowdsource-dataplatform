import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';

import 'styles/custom.scss';
import 'styles/theme.scss';
import 'styles/globals.scss';
import 'styles/slickCarousel.scss';

import Feedback from 'components/Feedback';
import Layout from 'components/Layout';
import { DEFAULT_LOCALE, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';

type MyAppProps = Partial<Exclude<AppProps, 'Component'>> & { Component: AppProps['Component'] };

const MyApp = ({ Component, pageProps }: MyAppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
      <Feedback />
    </Layout>
  );
};

/* istanbul ignore next */
if (
  typeof window !== 'undefined' &&
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PUBLIC_AXE_CORE
) {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const axe = require('@axe-core/react');

  axe(React, ReactDOM, 1000);
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && !localStorage.getItem(localStorageConstants.contributionLanguage)) {
  localStorage.setItem(localStorageConstants.contributionLanguage, RAW_LANGUAGES[DEFAULT_LOCALE]);
  localStorage.setItem(localStorageConstants.translatedLanguage, RAW_LANGUAGES['as']);
}

const App = appWithTranslation(MyApp) as typeof MyApp;

export default App;
