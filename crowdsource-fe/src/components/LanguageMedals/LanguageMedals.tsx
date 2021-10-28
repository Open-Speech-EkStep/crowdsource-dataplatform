import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Medal from 'components/Medal';
import MedalPlaceholder from 'components/MedalPlaceholder';
import { groupBy } from 'utils/utils';

import styles from './LanguageMedals.module.scss';

interface LanguageMedalsProps {
  initiative: string;
  language: string;
  languageBadges: any;
}

const LanguageMedals = ({ initiative, language, languageBadges }: LanguageMedalsProps) => {
  const { t } = useTranslation();
  const medals = ['Bronze', 'Silver', 'Gold', 'Platinum'];

  const groupByAction = groupBy(languageBadges, 'category');

  const actions = ['contribute', 'validate'];

  return (
    <Row className="py-3">
      <Col lg="2" className="d-flex align-items-center fw-light display-3">
        {language}
      </Col>
      <Col lg="10">
        <Row>
          <Col lg="6" className="d-lg-flex py-3 py-lg-0">
            <article>
              <h6 className="d-lg-none text-primary-60 fw-light">{t('contribute')}</h6>
              <div className="d-flex mt-3 mt-lg-0">
                {medals.map(medal => (
                  <div key={medal} className={styles.medal}>
                    {groupByAction[actions[0]] &&
                    groupByAction[actions[0]].some((ele: any) => ele.grade == medal) ? (
                      <Medal initiative={initiative} medal={medal} action={actions[0]} language={language} />
                    ) : (
                      <MedalPlaceholder medal={medal} />
                    )}
                  </div>
                ))}
              </div>
            </article>
          </Col>
          <Col lg="6" className="d-lg-flex py-3 py-lg-0">
            <article>
              <h6 className="d-lg-none text-primary-60 fw-light">{t('validate')}</h6>
              <div className="d-flex mt-3 mt-lg-0">
                {medals.map(medal => (
                  <div key={medal} className={styles.medal}>
                    {groupByAction[actions[1]] &&
                    groupByAction[actions[1]].some((ele: any) => ele.grade == medal) ? (
                      <Medal initiative={initiative} medal={medal} action={actions[1]} language={language} />
                    ) : (
                      <MedalPlaceholder medal={medal} />
                    )}
                  </div>
                ))}
              </div>
            </article>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LanguageMedals;
