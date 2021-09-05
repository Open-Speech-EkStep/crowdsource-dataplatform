import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import styles from './Stats.module.scss';

const Stats = () => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.stats} px-7 px-md-0 py-md-7`}>
      <Row>
        <Col xs="12" md="3" className={styles.stat}>
          <div className="d-flex flex-column align-items-center py-7 py-md-0">
            <span className={styles.count}>10345</span>
            <span className={`${styles.initiative} mt-1`}>{`${t('suno')} ${t('india')}`}</span>
          </div>
        </Col>
        <Col xs="12" md="3" className={styles.stat}>
          <div className="d-flex flex-column align-items-center py-7 py-md-0">
            <span className={styles.count}>10345</span>
            <span className={`${styles.initiative} mt-1`}>{`${t('bolo')} ${t('india')}`}</span>
          </div>
        </Col>
        <Col xs="12" md="3" className={styles.stat}>
          <div className="d-flex flex-column align-items-center py-7 py-md-0">
            <span className={styles.count}>10345</span>
            <span className={`${styles.initiative} mt-1`}>{`${t('likho')} ${t('india')}`}</span>
          </div>
        </Col>
        <Col xs="12" md="3" className={styles.stat}>
          <div className="d-flex flex-column align-items-center py-7 py-md-0">
            <span className={styles.count}>10345</span>
            <span className={`${styles.initiative} mt-1`}>{`${t('dekho')} ${t('india')}`}</span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Stats;
