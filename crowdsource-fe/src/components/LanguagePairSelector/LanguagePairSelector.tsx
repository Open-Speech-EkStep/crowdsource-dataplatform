import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';

import DataLastUpdated from 'components/DataLastUpdated';
import { DISPLAY_LANGUAGES, LOCALE_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';

import styles from './LanguagePairSelector.module.scss';

const LanguagePairSelector = ({
  // selectedLanguage,
  updateSelectedLanguage,
}: {
  // selectedLanguage: string | undefined;
  updateSelectedLanguage: (language: string | undefined) => void;
}) => {
  const { t } = useTranslation();
  const { locales } = useRouter();

  const [fromLanguage, setFromLanguage] = useState<string | undefined>();
  const [toLanguage, setToLanguage] = useState<string | undefined>();

  const remainingLanguages = fromLanguage
    ? locales?.filter(item => item !== LOCALE_LANGUAGES[fromLanguage])
    : locales;

  const handleFromChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'all') {
      setFromLanguage(undefined);
      setToLanguage(undefined);
      updateSelectedLanguage(undefined);
    } else {
      setFromLanguage(value);
    }
  };

  const handleToChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setToLanguage(value);
    updateSelectedLanguage(`${fromLanguage}-${value}`);
  };

  const toSelectEnabled = !!fromLanguage;
  return (
    <Form.Group controlId="language">
      <Form.Label className="mb-2 mb-md-4">{t('selectLanguagePairPrompt')}:</Form.Label>
      <div className="d-md-flex align-items-md-center">
        <Form.Select
          value={fromLanguage || 'all'}
          aria-label="Select From Language"
          onChange={handleFromChange as any}
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
        <span className="d-flex mx-3 mx-md-4 flex-shrink-0">
          <Image src="/images/arrow_right.svg" width="24" height="24" alt="Right Arrow" />
        </span>
        <Form.Select
          disabled={!toSelectEnabled}
          value={toLanguage || 'all'}
          aria-label="Select To Language"
          className={`${styles.dropdown} mx-5 mb-3 mb-md-0`}
          onChange={handleToChange as any}
        >
          <option key="all" value="all">
            {t('allLanguages')}
          </option>
          {remainingLanguages?.map(locale => (
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

export default LanguagePairSelector;
