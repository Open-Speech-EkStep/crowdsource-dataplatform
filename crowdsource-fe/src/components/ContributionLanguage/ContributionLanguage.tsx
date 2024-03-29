import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useCookies } from 'react-cookie';

import ImageBasePath from 'components/ImageBasePath';
import { INITIATIVES_MEDIA, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import {
  DEFAULT_LOCALE,
  DISPLAY_LANGUAGES,
  localeCookieName,
  LOCALE_LANGUAGES,
  RAW_LANGUAGES,
  CONTRIBUTION_LANGUAGE,
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
  const { locale: currentLocale } = useRouter();
  const [, setCookie] = useCookies([localeCookieName]);
  const [translatedDropdownValue, setTranslatedDropdownValue] = useState(CONTRIBUTION_LANGUAGE);
  const router = useRouter();

  const [contributionLanguage, setContributionLanguage] = useLocalStorage<string>(
    localStorageConstants.contributionLanguage
  );

  const [translatedLanguage, setTranslatedLanguage] = useLocalStorage<string>(
    localStorageConstants.translatedLanguage,
    DISPLAY_LANGUAGES['as']
  );

  useEffect(() => {
    if (contributionLanguage) {
      const filteredResult: any = CONTRIBUTION_LANGUAGE?.filter(
        item => item !== LOCALE_LANGUAGES[contributionLanguage]
      );
      setTranslatedDropdownValue(filteredResult);
    }
  }, [contributionLanguage]);

  const handleContributionLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (DEFAULT_LOCALE !== currentLocale) {
      router.push(`/${DEFAULT_LOCALE}${router.asPath}`, undefined, { locale: DEFAULT_LOCALE });
      setCookie(localeCookieName, DEFAULT_LOCALE, { path: '/' });
    }
    if (e.target.value === translatedLanguage) {
      const filteredResult: any = CONTRIBUTION_LANGUAGE?.filter(
        item => item !== LOCALE_LANGUAGES[e.target.value]
      );
      setTranslatedDropdownValue(filteredResult);
      setTranslatedLanguage(RAW_LANGUAGES[filteredResult[0]]);
    }
    setContributionLanguage(e.target.value);
  };

  const handleTranslatedLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
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
            <Form.Label className={`${styles.label} mb-0 me-md-2`}>
              {t('selectContributionLanguagePrompt1')}:
            </Form.Label>
            <div className="d-flex">
              <Form.Select
                data-testid="SelectContributionLanguage"
                value={contributionLanguage || DISPLAY_LANGUAGES[currentLocale ?? DEFAULT_LOCALE]}
                aria-label="Select the language for contribution"
                className={`${styles.languageDropdown} mt-1 mt-md-0`}
                name="contribution"
                onChange={handleContributionLanguageChange as any}
              >
                {CONTRIBUTION_LANGUAGE?.map(locale => (
                  <option key={locale} value={RAW_LANGUAGES[locale]}>
                    {DISPLAY_LANGUAGES[locale]}
                  </option>
                ))}
              </Form.Select>
              {INITIATIVES_MEDIA_MAPPING[initiative] === INITIATIVES_MEDIA.parallel && (
                <span className="d-flex mx-3 mx-md-4 flex-shrink-0">
                  <ImageBasePath src="/images/arrow_right.svg" width="24" height="24" alt="Right Arrow" />
                </span>
              )}
              {INITIATIVES_MEDIA_MAPPING[initiative] === INITIATIVES_MEDIA.parallel && (
                <Form.Select
                  data-testid="SelectTranslatedLanguage"
                  value={translatedLanguage || DISPLAY_LANGUAGES['as']}
                  aria-label="Select the translated language"
                  className={`${styles.languageDropdown} mt-1 mt-md-0`}
                  name="translation"
                  onChange={handleTranslatedLanguageChange as any}
                >
                  {translatedDropdownValue?.map(locale => (
                    <option key={locale} value={RAW_LANGUAGES[locale]}>
                      {DISPLAY_LANGUAGES[locale]}
                    </option>
                  ))}
                </Form.Select>
              )}
            </div>
          </Form.Group>
        </div>
      </Col>
    </Row>
  );
};

export default ContributionLanguage;
