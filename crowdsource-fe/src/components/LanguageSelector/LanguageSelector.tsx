import type { ChangeEvent } from 'react';
import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';

import DataLastUpdated from 'components/DataLastUpdated';
import { DISPLAY_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';

import styles from './LanguageSelector.module.scss';

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
    <Form.Group controlId="language">
      <Form.Label className="mb-2 mb-md-4">{t('selectLanguagePrompt')}:</Form.Label>
      <div className="d-md-flex align-items-md-center">
        <Form.Select
          value={selectedLanguage || 'all'}
          aria-label="Select Language"
          onChange={handleChange as any}
          className={`${styles.dropdown} me-5 mb-3 mb-md-0`}
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
        <DataLastUpdated />
      </div>
    </Form.Group>
  );
};

export default LanguageSelector;
