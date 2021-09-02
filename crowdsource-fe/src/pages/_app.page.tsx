import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';

import 'styles/custom.scss';
import 'styles/theme.scss';
import 'styles/globals.scss';

import Layout from 'components/Layout';

type MyAppProps = Partial<Exclude<AppProps, 'Component'>> & { Component: AppProps['Component'] };

const MyApp = ({ Component, pageProps = {} }: MyAppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
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

const App = appWithTranslation(MyApp) as typeof MyApp;

export default App;
