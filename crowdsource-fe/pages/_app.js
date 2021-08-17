import 'bootstrap/dist/css/bootstrap.css';

import 'styles/theme.css';
import 'styles/globals.css';

import Layout from 'components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
