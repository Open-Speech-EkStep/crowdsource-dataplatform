import type { ChangeEvent } from 'react';
import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useCookies } from 'react-cookie';

import { localeCookieName, RAW_LANGUAGES, DISPLAY_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './ContributionLanguage.module.scss';

const ContributionLanguage = () => {
  const { t } = useTranslation();
  const { locales, locale: currentLocale } = useRouter();
  const [cookie] = useCookies([localeCookieName]);
  const router = useRouter();

  const [contributionLanguage, setContributionLanguage] = useLocalStorage<string>(
    localStorageConstants.contributionLanguage
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(currentLocale);
    if (cookie.NEXT_LOCALE !== currentLocale) {
      console.log(router);
      console.log('Need to refresh the page with en');
    }
    setContributionLanguage(e.target.value);
  };

  return (
    <Row>
      <Col xs="6" data-testid="ContributionLanguage">
        <div className="contributionLanguage">
          <Form.Group
            controlId="contribution"
            className="d-flex flex-column flex-md-row align-items-md-center"
          >
            <Form.Label className={`${styles.label} mb-0`}>{t('selectLanguagePrompt1')}:</Form.Label>
            <Form.Select
              data-testid="select"
              value={contributionLanguage || ''}
              aria-label="Select the language for contribution"
              className={`${styles.selectContributionLanguage} mt-3 mt-md-0 ms-md-2`}
              name="contribution"
              onChange={handleChange as any}
            >
              {locales?.map(locale => (
                <option key={locale} value={RAW_LANGUAGES[locale]}>
                  {DISPLAY_LANGUAGES[locale]}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
      </Col>
    </Row>
  );
};

export default ContributionLanguage;
