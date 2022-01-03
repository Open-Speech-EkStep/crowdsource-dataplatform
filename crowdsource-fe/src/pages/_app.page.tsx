import React, { useEffect, useRef, useState } from 'react';

import 'styles/custom.scss';
import 'styles/globals.scss';
import 'styles/slickCarousel.scss';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';

import ErrorPopup from 'components/ErrorPopup';
import Float from 'components/Float';
import LanguageChangeNotification from 'components/LanguageChangeNotification';
import Layout from 'components/Layout';
import apiPaths from 'constants/apiPaths';
import { ErrorStatusCode } from 'constants/errorStatusCode';
import { DEFAULT_LOCALE, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import { initiativeBaseRoute, INITIATIVES_URL } from 'constants/routePaths';
import { useFetchWithInit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import { fetchLocationInfo } from 'utils/utils';

type MyAppProps = Partial<Exclude<AppProps, 'Component'>> & { Component: AppProps['Component'] };

const MyApp = ({ Component, pageProps }: MyAppProps) => {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const [, setContributionLanguage, , storageObj] = useLocalStorage<string>(
    localStorageConstants.contributionLanguage
  );
  const [showModal, setShowModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const isInitiativePage = INITIATIVES_URL.some(initiativeKey =>
      routerRef.current.pathname.includes(initiativeBaseRoute[initiativeKey])
    );

    if (
      storageObj.key === localStorageConstants.contributionLanguage &&
      storageObj.oldValue !== storageObj.newValue &&
      isInitiativePage &&
      routerRef.current.pathname !== '/404'
    ) {
      setShowModal(true);
    }
  }, [storageObj]);

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

  /* istanbul ignore next */
  const closeModal = () => {
    setShowModal(false);
    setContributionLanguage(storageObj.newValue);
  };

  return (
    <SWRConfig
      value={{
        /* istanbul ignore next */
        onError: error => {
          /* istanbul ignore next */
          if (error) {
            setHasError(true);
            if (error.status && error.status === ErrorStatusCode.SERVICE_UNAVAILABLE) {
              setErrorMsg('multipleRequestApiError');
            } else {
              setErrorMsg('apiFailureError');
            }
          }
        },
      }}
    >
      <Layout>
        <Component {...pageProps} />
        {router.pathname !== '/404' && <Float />}
        <LanguageChangeNotification
          show={showModal}
          onHide={closeModal}
          oldValue={storageObj.oldValue}
          newValue={storageObj.newValue}
        />
        <ErrorPopup
          show={hasError}
          onHide={() => {
            /* istanbul ignore next */
            setHasError(false);
          }}
          errorMsg={errorMsg}
        />
      </Layout>
    </SWRConfig>
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

if (
  typeof window !== 'undefined' &&
  (!localStorage.getItem(localStorageConstants.contributionLanguage) ||
    !localStorage.getItem(localStorageConstants.translatedLanguage))
) {
  localStorage.setItem(localStorageConstants.contributionLanguage, RAW_LANGUAGES[DEFAULT_LOCALE]);
  localStorage.setItem(localStorageConstants.translatedLanguage, RAW_LANGUAGES['as']);
}

const App = appWithTranslation(MyApp) as typeof MyApp;

export default App;
