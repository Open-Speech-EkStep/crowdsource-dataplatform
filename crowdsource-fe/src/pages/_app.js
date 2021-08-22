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

export default appWithTranslation(MyApp);
