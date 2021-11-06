import { useState, useEffect } from 'react';

import { useTranslation, Trans } from 'next-i18next';
import Image from 'next/image';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import Medal from 'components/Medal';
import TriColorGradientBg from 'components/TriColorGradientBg';
import { LOCALE_LANGUAGES } from 'constants/localesConstants';
import { capitalizeFirstLetter } from 'utils/utils';

import styles from './InitiativeBadgeDetail.module.scss';

interface InitiativeBadgeDetailProps {
  action: string;
  initiative: string;
  language: string;
}

const InitiativeBadgeDetail = ({ initiative, action, language }: InitiativeBadgeDetailProps) => {
  const medals = ['bronze', 'silver', 'gold', 'platinum'];
  const languageCode = LOCALE_LANGUAGES[language];
  const { t } = useTranslation();

  const [participatedAction, setParticipatedAction] = useState<string>(action);
  const [selectedMedal, setSelectedMedal] = useState<string>(medals[0]);

  useEffect(() => {
    setParticipatedAction(action);
  }, [action]);

  return (
    <div data-testid="InitiativeBadgeDetail">
      <Row className="py-5">
        <Col md="3" className="d-flex align-items-center fw-light display-3">
          {t('selectBadgeLevelPrompt')}
        </Col>
        <Col md="9" className="d-flex justify-content-between justify-content-lg-start mt-5 mt-md-0">
          {medals.map(medal => (
            <div key={medal} className={styles.medal}>
              <Medal
                initiative={initiative}
                selectedMedal={selectedMedal}
                medal={medal}
                action={participatedAction}
                language={language}
                handleClick={() => setSelectedMedal(medal)}
              />
            </div>
          ))}
        </Col>
      </Row>
      <Row className="py-5">
        <Col md="3" className="d-flex align-items-center fw-light display-3">
          {t('participation')}
        </Col>
        <Col md="9" className="d-flex justify-content-between justify-content-md-start mt-5 mt-md-0">
          <Form.Group className="fw-light display-3" controlId="action">
            <Form.Check
              inline
              type="radio"
              id="action1"
              data-testid="action1"
              label={t('contribution')}
              value="Contribution"
              name="action"
              className="me-9"
              checked={participatedAction == 'contribute'}
              onChange={() => setParticipatedAction('contribute')}
            />
            <Form.Check
              inline
              type="radio"
              id="action2"
              data-testid="action2"
              label={t('validation')}
              value="Validation"
              name="action"
              checked={participatedAction == 'validate'}
              onChange={() => setParticipatedAction('validate')}
            />
          </Form.Group>
        </Col>
      </Row>
      <section className="py-5">
        <TriColorGradientBg>
          <Row>
            <Col
              xs={{ order: 1, span: 12 }}
              md={{ order: 2, span: 4 }}
              className="d-flex align-items-center justify-content-center"
            >
              <div className={styles.medalImg}>
                <Image
                  src={`/images/${languageCode}/badges/${languageCode}_${initiative}_${selectedMedal}_${participatedAction.toLowerCase()}.svg`}
                  width="250"
                  height="320"
                  alt={`Bronze Badge ${language}`}
                />
              </div>
            </Col>
            <Col
              xs={{ order: 2, span: 12 }}
              md={{ order: 1, span: 8 }}
              className="d-flex align-items-center justify-content-center text-center text-md-start mt-5 mt-md-0"
            >
              <div className={styles.heading}>
                <h2>
                  <Trans
                    i18nKey={`${participatedAction}BadgeDetailText`}
                    defaults={`${participatedAction}BadgeDetailText`}
                    values={{
                      initiativeName: capitalizeFirstLetter(`${t(initiative)} ${t('india')}`),
                      badge: capitalizeFirstLetter(t(selectedMedal.toLowerCase())),
                      language: capitalizeFirstLetter(t(language.toLowerCase())),
                      sourceType: 'sentences',
                      count: 5,
                    }}
                    components={{ span: <span className="text-warning" /> }}
                  />
                </h2>
              </div>
            </Col>
          </Row>
        </TriColorGradientBg>
      </section>
    </div>
  );
};

export default InitiativeBadgeDetail;
