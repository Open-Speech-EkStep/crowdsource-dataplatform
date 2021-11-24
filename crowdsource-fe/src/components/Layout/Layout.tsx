import type { ReactNode } from 'react';

import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Footer from 'components/Footer';
import Header from 'components/Header';
import nodeConfig from 'constants/nodeConfig';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div data-testid="Layout" className="d-flex flex-column flex-fill">
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
        <link rel="icon" type="image/png" href={`${nodeConfig.contextRoot}/images/favicon.png`} />
      </Head>
      {router.pathname !== '/404' && <Header />}
      <main className="d-flex flex-column flex-grow-1">{children}</main>
      {router.pathname !== '/404' && <Footer />}
    </div>
  );
};

export default Layout;
