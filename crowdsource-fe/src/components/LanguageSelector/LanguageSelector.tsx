import type { ChangeEvent } from 'react';
import { Fragment } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { DISPLAY_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';

const LanguageSelector = ({
  selectedLanguage,
  updateSelectedLanguage,
}: {
  selectedLanguage: string | undefined;
  updateSelectedLanguage: (language: string | undefined) => void;
}) => {
  const { t } = useTranslation();
  const { locales } = useRouter();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'all') updateSelectedLanguage(undefined);
    else updateSelectedLanguage(value);
  };

  return (
    <Fragment>
      <Row>
        <Col>
          <div>
            <Form.Group controlId="language">
              <Form.Label>{t('selectLanguagePrompt')}:</Form.Label>
              <Form.Select
                value={selectedLanguage}
                aria-label="Select Language"
                onChange={handleChange as any}
              >
                <option key="all" value="all">
                  {t('allLanguages')}
                </option>
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
    </Fragment>
  );
};

export default LanguageSelector;
