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
  const { locale } = useRouter();
  const socialSharingTextWithRank = t('socialSharingTextWithoutRank', {
    url: `${nodeConfig.appUrl}${nodeConfig.contextRoot}/${locale}/home`,
  });

  return (
    <div data-testid="Layout" className="d-flex flex-column flex-fill">
      <Head>
        <title>{`${t('metaOGTitle')} (Beta)`}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="google-site-verification" content="WzZdl_-Ka4oElzowGxq3Y8knBPs31AOHFnEqSUtjGFU" />
        <meta name="description" content={t('metaDescription')} />
        <link rel="canonical" href={`${nodeConfig.appUrl}${nodeConfig.contextRoot}/${locale}/home`} />
        <meta property="og:title" content={t('metaOGTitle')} />
        <meta property="og:description" content={socialSharingTextWithRank} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={`${t('logoTitlePrefix')} ${t('logoTitleSuffix')}`} />
        <meta property="og:url" content={`${nodeConfig.appUrl}${nodeConfig.contextRoot}/${locale}/home`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={`${t('logoTitlePrefix')} ${t('logoTitleSuffix')}`} />
        <meta
          name="twitter:image"
          content={`${nodeConfig.appUrl}${nodeConfig.contextRoot}/images/${nodeConfig.brand}/favicon.png`}
        />
        <meta
          name="twitter:image:src"
          content={`${nodeConfig.appUrl}${nodeConfig.contextRoot}/images/${nodeConfig.brand}/favicon.png`}
        />
        <meta
          name="image"
          property="og:image"
          content={`${nodeConfig.appUrl}${nodeConfig.contextRoot}/images/${nodeConfig.brand}/favicon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          href={`${nodeConfig.contextRoot}/images/${nodeConfig.brand}/favicon.png`}
        />
      </Head>
      {router.pathname !== '/404' && <Header />}
      <main className="d-flex flex-column flex-grow-1">{children}</main>
      {router.pathname !== '/404' && <Footer />}
    </div>
  );
};

export default Layout;
