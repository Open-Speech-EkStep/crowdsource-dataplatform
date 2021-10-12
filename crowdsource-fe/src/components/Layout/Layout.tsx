import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import Footer from 'components/Footer';
import Header from 'components/Header';
import { DEFAULT_LOCALE, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!localStorage.getItem(localStorageConstants.contributionLanguage))
      localStorage.setItem(localStorageConstants.contributionLanguage, RAW_LANGUAGES[DEFAULT_LOCALE]);
  });

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
        <link rel="icon" type="image/png" href="/img/favicon.png" />
      </Head>
      <Header />
      <main className="d-flex flex-column flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
