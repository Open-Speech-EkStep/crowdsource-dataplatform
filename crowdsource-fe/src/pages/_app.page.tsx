import { useEffect } from 'react';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import 'styles/custom.scss';
import 'styles/theme.scss';
import 'styles/globals.scss';
import 'styles/slickCarousel.scss';
import Float from 'components/Float';
import Layout from 'components/Layout';
import apiPaths from 'constants/apiPaths';
import { DEFAULT_LOCALE, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import sessionStorageConstants from 'constants/sessionStorageConstants';
import { useFetchWithInit } from 'hooks/useFetch';
import { fetchLocationInfo } from 'utils/utils';

type MyAppProps = Partial<Exclude<AppProps, 'Component'>> & { Component: AppProps['Component'] };

const MyApp = ({ Component, pageProps }: MyAppProps) => {
  /* istanbul ignore next */
  const { mutate } = useFetchWithInit(apiPaths.setCookie, { revalidateOnMount: false });
  /* istanbul ignore next */
  useEffect(() => {
    if (!localStorage.getItem(localStorageConstants.locationInfo)) {
      const getLocationInfo = async () => {
        localStorage.setItem(localStorageConstants.locationInfo, JSON.stringify(await fetchLocationInfo()));
      };
      getLocationInfo();
      mutate();
    }
  }, [mutate]);

  const router = useRouter();

  useEffect(() => storePathValues(router.asPath), [router.asPath]);
  function storePathValues(currentUrl: string) {
    const prevPath = sessionStorage.getItem(sessionStorageConstants.currentPath) || '';

    sessionStorage.setItem(sessionStorageConstants.prevPath, prevPath);
    sessionStorage.setItem(sessionStorageConstants.currentPath, currentUrl);
  }

  return (
    <Layout>
      <Component {...pageProps} />
      {router.pathname !== '/404' && <Float />}
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

/* istanbul ignore next */
if (typeof window !== 'undefined' && !localStorage.getItem(localStorageConstants.contributionLanguage)) {
  localStorage.setItem(localStorageConstants.contributionLanguage, RAW_LANGUAGES[DEFAULT_LOCALE]);
  localStorage.setItem(localStorageConstants.translatedLanguage, RAW_LANGUAGES['as']);
}

const App = appWithTranslation(MyApp) as typeof MyApp;

export default App;
