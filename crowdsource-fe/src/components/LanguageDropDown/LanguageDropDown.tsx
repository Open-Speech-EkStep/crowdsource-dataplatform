import type { ChangeEvent } from 'react';

import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { CONTRIBUTION_LANGUAGE, DISPLAY_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';

import styles from './LanguageDropDown.module.scss';

interface LanguageDropDownProps {
  selectedLanguage: string;
  updateSelectedLanguage: (language: string) => void;
}

const LanguageDropDown = ({ selectedLanguage, updateSelectedLanguage }: LanguageDropDownProps) => {
  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateSelectedLanguage(value);
  };

  return (
    <Row>
      <Col data-testid="LanguageDropDown">
        <div className="contributionLanguage">
          <Form.Group
            controlId="languageDropDown"
            className="d-flex flex-column flex-md-row align-items-md-center"
          >
            <Form.Label className={`${styles.label} mb-0 me-md-2`}>
              {t('selectDropDownLanguagePrompt')}:
            </Form.Label>
            <Form.Select
              data-testid="SelectDropDownLanguage"
              value={selectedLanguage}
              aria-label="Your Language"
              className={`${styles.languageDropdown} mt-1 mt-md-0`}
              name="languageDropDown"
              onChange={handleChange as any}
            >
              {CONTRIBUTION_LANGUAGE?.map(locale => (
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
export default LanguageDropDown;
