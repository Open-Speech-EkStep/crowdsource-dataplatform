import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import Body from 'components/Body';
import Footer from 'components/Footer';
import Header from 'components/Header';

function Layout({ children }) {
  const { t } = useTranslation();

  return (
    <div data-testid="Layout">
      <Head>
        <title>{t('metaTitle')}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="google-site-verification" content="WzZdl_-Ka4oElzowGxq3Y8knBPs31AOHFnEqSUtjGFU" />
        <meta name="description" content={t('metaDescription')} />
        <meta property="og:title" content={t('metaOGTitle')} />
        <meta property="og:description" content={t('metaOGDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={t('metaOGSiteName')} />
        <meta property="og:url" content="https://bhashini.gov.in/bhashadaan" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Header />
      <Body>{children}</Body>
      <Footer />
    </div>
  );
}

export default Layout;
