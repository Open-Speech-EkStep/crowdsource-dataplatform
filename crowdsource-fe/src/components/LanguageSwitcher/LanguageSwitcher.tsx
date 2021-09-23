import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Dropdown from 'react-bootstrap/Dropdown';

import Link from 'components/Link';
import {
  DEFAULT_LOCALE,
  DISPLAY_LANGUAGES,
  LOCALE_LANGUAGES,
  RAW_LANGUAGES,
} from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import routePaths from 'constants/routePaths';
import useLocalStorage from 'hooks/useLocalStorage';

import { LOCALES_MAPPING } from '../../../next-i18next.config';

import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher = () => {
  const { asPath: currentRoutePath, locale: currentLocale = DEFAULT_LOCALE, locales } = useRouter();
  const { t } = useTranslation();
  let localeValues: any | undefined;
  const [contributionLanguage, setContributionLanguage] = useLocalStorage<string>(
    localStorageConstants.contributionLanguage
  );

  const doSetContributionLanguage = contributionLanguage && currentRoutePath !== routePaths.home;

  if (contributionLanguage && currentRoutePath !== routePaths.home) {
    const filteredLanguage = locales?.filter(locale => locale === LOCALE_LANGUAGES[contributionLanguage]);
    filteredLanguage && filteredLanguage.includes(LOCALES_MAPPING.en) ? '' : filteredLanguage?.unshift('en');
    localeValues = filteredLanguage;
  } else {
    localeValues = locales;
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
        className={`${styles.toggle} d-flex h-100 justify-content-center align-items-center`}
      >
        <Image src="/images/locale_logo.svg" width="24" height="24" alt={t('languageIconAlt')} />
        <span className="d-none d-xl-block mx-1">{DISPLAY_LANGUAGES[currentLocale]}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {localeValues?.map((locale: any, index: number) => (
          <Link key={index} href={currentRoutePath} locale={locale} passHref>
            <Dropdown.Item
              eventKey={locale}
              className={styles.item}
              onClick={() =>
                doSetContributionLanguage ? null : setContributionLanguage(RAW_LANGUAGES[locale])
              }
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
