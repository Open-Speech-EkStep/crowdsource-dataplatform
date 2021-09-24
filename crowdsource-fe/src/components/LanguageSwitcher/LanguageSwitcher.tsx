import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Dropdown from 'react-bootstrap/Dropdown';
import { useCookies } from 'react-cookie';

import Link from 'components/Link';
import { DEFAULT_LOCALE, DISPLAY_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './LanguageSwitcher.module.scss';

const localeCookieName = 'NEXT_LOCALE';

const LanguageSwitcher = () => {
  const { asPath: currentRoutePath, locale: currentLocale = DEFAULT_LOCALE, locales } = useRouter();
  const { t } = useTranslation();
  const [, setContributionLanguage] = useLocalStorage<string>(localStorageConstants.contributionLanguage);
  const [cookie, setCookie] = useCookies([localeCookieName]);

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
        {locales?.map(locale => (
          <Link key={locale} href={currentRoutePath} locale={locale} passHref>
            <Dropdown.Item
              eventKey={locale}
              className={`${styles.item} text-primary display-5 px-4 py-2`}
              onClick={() => {
                setContributionLanguage(RAW_LANGUAGES[locale]);

                if (cookie.NEXT_LOCALE !== locale) {
                  // TODO: Some issue is still there with redirection to locale set in cookie.
                  // Check this comment on github: https://github.com/vercel/next.js/issues/22375#issuecomment-926827951
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
