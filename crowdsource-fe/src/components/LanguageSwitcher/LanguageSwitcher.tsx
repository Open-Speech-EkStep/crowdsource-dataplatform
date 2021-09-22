import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Dropdown from 'react-bootstrap/Dropdown';

import Link from 'components/Link';
import { DEFAULT_LOCALE, DISPLAY_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher = () => {
  const { asPath: currentRoutePath, locale: currentLocale = DEFAULT_LOCALE, locales } = useRouter();
  const { t } = useTranslation();
  const [, setContributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);

  return (
    <Dropdown data-testid="LanguageSwitcher" id="languageSwitcher" className={styles.root} align="end">
      <Dropdown.Toggle
        id="languageSwitcherToggle"
        variant="light"
        className={`${styles.toggle} d-flex h-100 justify-content-center align-items-center`}
      >
        <Image src="/images/locale_logo.svg" width="24" height="24" alt={t('languageIconAlt')} />
        <span className="d-none d-xl-block mx-1">{DISPLAY_LANGUAGES[currentLocale]}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {locales?.map(locale => (
          <Link key={locale} href={currentRoutePath} locale={locale} passHref>
            <Dropdown.Item
              eventKey={locale}
              className={styles.item}
              onClick={() => setContributionLanguage(RAW_LANGUAGES[locale])}
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
