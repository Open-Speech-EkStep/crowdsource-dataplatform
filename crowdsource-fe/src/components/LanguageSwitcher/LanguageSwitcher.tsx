import React from 'react';

import { useRouter } from 'next/router';
import Dropdown from 'react-bootstrap/Dropdown';
import { useCookies } from 'react-cookie';

import ImageBasePath from 'components/ImageBasePath';
import Link from 'components/Link';
import {
  DEFAULT_LOCALE,
  DISPLAY_LANGUAGES,
  localeCookieName,
  LOCALES_MAPPING,
  LOCALE_LANGUAGES,
  RAW_LANGUAGES,
} from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import routePaths from 'constants/routePaths';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher = () => {
  const { asPath: currentRoutePath, locale: currentLocale = DEFAULT_LOCALE, locales } = useRouter();
  const [cookie, setCookie] = useCookies([localeCookieName]);

  let localeValues: any | undefined;
  const [contributionLanguage, setContributionLanguage] = useLocalStorage<string>(
    localStorageConstants.contributionLanguage
  );

  const doSetContributionLanguage = contributionLanguage && currentRoutePath !== routePaths.home;

  if (contributionLanguage && currentRoutePath !== routePaths.home) {
    const filteredLanguage = locales?.filter(locale => locale === LOCALE_LANGUAGES[contributionLanguage]);
    if (!(filteredLanguage && filteredLanguage.includes(LOCALES_MAPPING.en))) {
      filteredLanguage?.unshift('en');
    }
    localeValues = filteredLanguage;
  } else {
    localeValues = locales?.slice().sort();
  }
  return (
    <Dropdown
      data-testid="LanguageSwitcher"
      id="languageSwitcher"
      className={`${styles.root} position-relative`}
      align="end"
    >
      <Dropdown.Toggle
        id="languageSwitcherToggle"
        variant="light"
        className={`${styles.toggle} d-flex h-100 justify-content-center align-items-center px-3`}
      >
        <ImageBasePath src="/images/locale_logo.svg" width="24" height="24" alt="Language Icon" />
        <span className="d-none d-xl-block mx-1">{DISPLAY_LANGUAGES[currentLocale]}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {localeValues?.map((locale: any, index: number) => (
          <Link key={index} href={currentRoutePath} locale={locale} passHref>
            <Dropdown.Item
              eventKey={locale}
              className={`${styles.item} text-primary display-5 px-4 py-2`}
              onClick={() => {
                if (!doSetContributionLanguage) {
                  setContributionLanguage(RAW_LANGUAGES[locale]);
                }
                if (cookie.NEXT_LOCALE !== locale) {
                  setCookie(localeCookieName, locale, { path: '/' });
                }
              }}
            >
              {DISPLAY_LANGUAGES[locale]}
            </Dropdown.Item>
          </Link>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
