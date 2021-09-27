import type { ChangeEvent } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import ContributionActions from 'components/ContributionActions';
import { INITIATIVES_MAPPING, INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import { DISPLAY_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './SunoIndiaDetails.module.scss';

const SunoIndiaActions = () => {
  const { t } = useTranslation();
  const { locales } = useRouter();

  const [contributionLanguage, setContributionLanguage] = useLocalStorage<string>(
    localStorageConstants.contributionLanguage
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContributionLanguage(e.target.value);
  };

  return (
    <section data-testid="SunoIndiaActions" className="mt-7 mt-md-9">
      <Row>
        <Col xs="6">
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
      <ContributionActions
        initiativeMedia={INITIATIVES_MEDIA_MAPPING.suno}
        contributionLanguage={contributionLanguage ?? ''}
        initiative={INITIATIVES_MAPPING.suno}
      />
    </section>
  );
};

export default SunoIndiaActions;
