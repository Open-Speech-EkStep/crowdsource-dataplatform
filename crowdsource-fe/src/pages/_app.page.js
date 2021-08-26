import { appWithTranslation } from 'next-i18next';
import PropTypes from 'prop-types';

import 'bootstrap/dist/css/bootstrap.css';

import 'styles/theme.css';
import 'styles/globals.css';

import Layout from 'components/Layout';

const propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object,
};

function MyApp({ Component, pageProps = {} }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

MyApp.propTypes = propTypes;

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

export default appWithTranslation(MyApp);
