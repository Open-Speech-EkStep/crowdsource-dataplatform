import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import DataLastUpdated from 'components/DataLastUpdated';
import { DISPLAY_LANGUAGES, LOCALE_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';

import styles from './LanguagePairSelector.module.scss';

const LanguagePairSelector = ({
  fromLanguage,
  toLanguage,
  updateSelectedLanguages,
}: {
  fromLanguage: string | undefined;
  toLanguage: string | undefined;
  updateSelectedLanguages: (language1: string | undefined, language2: string | undefined) => void;
}) => {
  const { t } = useTranslation();
  const { locales } = useRouter();
  const [selectedFromLanguage, setSelectedFromLanguage] = useState<string | undefined>();
  const [selectedToLanguage, setSelectedToLanguage] = useState<string | undefined>();

  useEffect(() => {
    if (fromLanguage) {
      setSelectedFromLanguage(fromLanguage);
    } else {
      setSelectedFromLanguage(undefined);
    }
  }, [fromLanguage]);

  useEffect(() => {
    if (toLanguage) {
      setSelectedToLanguage(toLanguage);
    } else {
      setSelectedToLanguage(undefined);
    }
  }, [toLanguage]);

  const setLanguagePair = (from: string | undefined, to: string | undefined) => {
    if (from && to) {
      if (from == 'all' || to === 'all') {
        updateSelectedLanguages(undefined, undefined);
      } else {
        updateSelectedLanguages(from, to);
      }
    }
  };

  const remainingLanguages = selectedFromLanguage
    ? locales?.filter(item => item !== LOCALE_LANGUAGES[selectedFromLanguage || 'en'])
    : locales;

  const handleFromChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      updateSelectedLanguages(undefined, undefined);
    } else setSelectedFromLanguage(value);
    setSelectedToLanguage(undefined);
  };

  const handleToChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedToLanguage(e.target.value);
    setLanguagePair(selectedFromLanguage, e.target.value);
  };

  const toSelectEnabled = !!selectedFromLanguage;
  return (
    <Form.Group controlId="language">
      <Form.Label className="mb-2 mb-md-4 ">{t('selectLanguagePairPrompt')}:</Form.Label>
      <Row>
        <div className="d-md-flex align-items-md-center">
          <Col xs="12" md="5">
            <div className="d-flex">
              <Form.Select
                value={selectedFromLanguage || 'all'}
                aria-label="Select From Language"
                onChange={handleFromChange as any}
                className={`${styles.dropdown} mb-3 mb-md-0`}
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
              <span className="d-flex mb-md-0 mb-3 mx-1 mx-md-4 flex-shrink-0">
                <Image src="/images/arrow_right.svg" width="24" height="24" alt="Right Arrow" />
              </span>
              <Form.Select
                disabled={!toSelectEnabled}
                value={selectedToLanguage || 'all'}
                aria-label="Select To Language"
                className={`${styles.dropdown} mb-3 mb-md-0`}
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
            </div>
          </Col>
          <Col xs="12" md="6" className="px-2">
            <DataLastUpdated />
          </Col>
        </div>
      </Row>
    </Form.Group>
  );
};

export default LanguagePairSelector;
