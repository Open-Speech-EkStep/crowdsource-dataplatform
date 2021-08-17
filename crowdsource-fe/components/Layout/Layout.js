import Head from 'next/head';

import Body from 'components/Body';
import Footer from 'components/Footer';
import Header from 'components/Header';
import useTranslate from 'hooks/useTranslate';

function Layout({ children }) {
  const { translate } = useTranslate();

  return (
    <>
      <Head>
        <title>{translate('metaTitle')}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="google-site-verification" content="WzZdl_-Ka4oElzowGxq3Y8knBPs31AOHFnEqSUtjGFU" />
        <meta name="description" content={translate('metaDescription')} />
        <meta property="og:title" content={translate('metaOGTitle')} />
        <meta property="og:description" content={translate('metaOGDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={translate('metaOGSiteName')} />
        <meta property="og:url" content="https://bhashini.gov.in/bhashadaan" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Header />
      <Body>{children}</Body>
      <Footer />
    </>
  );
}

export default Layout;
