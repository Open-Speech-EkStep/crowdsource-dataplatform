import { useEffect } from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import routePaths from 'constants/routePaths';

function Index() {
  const router = useRouter();

  // language detection
  // not recommended for production, use server redirection instead of this
  useEffect(() => {
    for (const locale of router.locales) {
      for (const lang of navigator.languages) {
        if (lang.startsWith(locale)) {
          router.replace(`${locale}${routePaths.home}`);
          return;
        }
      }
    }
  }, [router]);

  return null;
}

export async function getStaticProps({ locale }) {
  return {
    notFound: process.env.NODE_ENV !== 'development',
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Index;
