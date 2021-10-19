import type { ChangeEvent } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useCookies } from 'react-cookie';

import { INITIATIVES_MEDIA, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import {
  DEFAULT_LOCALE,
  DISPLAY_LANGUAGES,
  localeCookieName,
  RAW_LANGUAGES,
} from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';

import styles from './ContributionLanguage.module.scss';

interface ContributionLanguageProps {
  initiative: Initiative;
}

const ContributionLanguage = ({ initiative }: ContributionLanguageProps) => {
  const { t } = useTranslation();
  const { locales, locale: currentLocale } = useRouter();
  const [, setCookie] = useCookies([localeCookieName]);
  const router = useRouter();

  const [contributionLanguage, setContributionLanguage] = useLocalStorage<string>(
    localStorageConstants.contributionLanguage
  );

  const [translatedLanguage, setTranslatedLanguage] = useLocalStorage<string>(
    localStorageConstants.translatedLanguage
  );

  const handleContributionLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (DEFAULT_LOCALE !== currentLocale) {
      router.push(`/${DEFAULT_LOCALE}${router.asPath}`, undefined, { locale: DEFAULT_LOCALE });
      setCookie(localeCookieName, DEFAULT_LOCALE, { path: '/' });
    }
    setContributionLanguage(e.target.value);
  };

  const handleTranslatedLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (DEFAULT_LOCALE !== currentLocale) {
      router.push(`/${DEFAULT_LOCALE}${router.asPath}`, undefined, { locale: DEFAULT_LOCALE });
      setCookie(localeCookieName, DEFAULT_LOCALE, { path: '/' });
    }
    setTranslatedLanguage(e.target.value);
  };

  return (
    <Row>
      <Col data-testid="ContributionLanguage">
        <div className="contributionLanguage">
          <Form.Group
            controlId="contribution"
            className="d-flex flex-column flex-md-row align-items-md-center"
          >
            <Form.Label className={`${styles.label} mb-0 me-md-2`}>{t('selectLanguagePrompt1')}:</Form.Label>
            <Form.Select
              data-testid="SelectContributionLanguage"
              value={contributionLanguage || DISPLAY_LANGUAGES[currentLocale ?? DEFAULT_LOCALE]}
              aria-label="Select the language for contribution"
              className={`${styles.languageDropdown} mt-1 mt-md-0`}
              name="contribution"
              onChange={handleContributionLanguageChange as any}
            >
              {locales?.map(locale => (
                <option key={locale} value={RAW_LANGUAGES[locale]}>
                  {DISPLAY_LANGUAGES[locale]}
                </option>
              ))}
            </Form.Select>
            {INITIATIVES_MEDIA_MAPPING[initiative] === INITIATIVES_MEDIA.parallel && (
              <span className="d-flex mx-8">
                <Image src="/images/arrow_right.svg" width="24" height="24" alt="Right Arrow" />
              </span>
            )}
            {INITIATIVES_MEDIA_MAPPING[initiative] === INITIATIVES_MEDIA.parallel && (
              <Form.Select
                data-testid="SelectTranslatedLanguage"
                value={translatedLanguage || DISPLAY_LANGUAGES[currentLocale ?? DEFAULT_LOCALE]}
                aria-label="Select the translated language"
                className={`${styles.languageDropdown} mt-1 mt-md-0`}
                name="translation"
                onChange={handleTranslatedLanguageChange as any}
              >
                {locales?.map(locale => (
                  <option key={locale} value={RAW_LANGUAGES[locale]}>
                    {DISPLAY_LANGUAGES[locale]}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
        </div>
      </Col>
    </Row>
  );
};

export default ContributionLanguage;
