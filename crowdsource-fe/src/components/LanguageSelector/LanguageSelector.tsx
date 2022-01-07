import type { ChangeEvent } from 'react';
import React from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Form from 'react-bootstrap/Form';

import { DISPLAY_LANGUAGES, RAW_LANGUAGES, CONTRIBUTION_LANGUAGE } from 'constants/localesConstants';

import styles from './LanguageSelector.module.scss';

const DataLastUpdated = dynamic(() => import('components/DataLastUpdated'));

const LanguageSelector = ({
  selectedLanguage,
  updateSelectedLanguage,
}: {
  selectedLanguage: string | undefined;
  updateSelectedLanguage: (language: string | undefined) => void;
}) => {
  const { t } = useTranslation();

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
          {CONTRIBUTION_LANGUAGE?.map(locale => (
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
