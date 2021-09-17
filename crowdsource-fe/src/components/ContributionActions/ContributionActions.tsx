import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import ActionCard from 'components/ActionCard';
import { INITIATIVE_ACTIONS, INITIATIVES_MAPPING } from 'constants/initiativeConstants';

import styles from './ContributionActions.module.scss';
import { DISPLAY_LANGUAGES } from 'constants/localesConstants';

const ContributionActions = () => {
  const { locales } = useRouter();
  const { t } = useTranslation();
  const initiative = INITIATIVES_MAPPING.suno;

  return (
    <div className={styles.root} data-testid="ContributionActions">
      <Row>
        <Col xs="12">
          <div className="contributionLanguage">
            <Form.Group
              controlId="formGroupContributionLanguage"
              className="d-flex flex-column flex-md-row align-items-md-center"
            >
              <Form.Label className={`${styles.label} mb-0`}>
                Select the language for contribution:
              </Form.Label>
              <Form.Select
                aria-label="Select the language for contribution"
                className={`${styles.selectContributionLanguage} mt-3 mt-md-0 ms-md-2`}
                name="category"
              >
                {locales?.map(locale => (
                  <option key={locale} value="">
                    {DISPLAY_LANGUAGES[locale]}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        </Col>
        <Col md="6" className="mt-7 mt-md-9">
          <ActionCard
            type={INITIATIVE_ACTIONS.transcribe}
            icon={`${initiative}_contribute_icon.svg`}
            text="Type what you hear"
            shadow='Green'
          />
        </Col>
        <Col md="6" className="mt-9 mt-md-9">
          <ActionCard
            type={INITIATIVE_ACTIONS.validate}
            icon="validate.svg"
            text="Validate what others have contributed"
            shadow='Blue'
          />
        </Col>
      </Row>
    </div>
  );
};

export default ContributionActions;
