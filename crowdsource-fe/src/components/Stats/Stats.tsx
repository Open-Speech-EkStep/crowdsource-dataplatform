import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import apiPaths from 'constants/apiPaths';
import useFetch from 'hooks/useFetch';

import styles from './Stats.module.scss';

const SUNO = 'suno';
const BOLO = 'bolo';
const LIKHO = 'likho';
const DEKHO = 'dekho';
const initiativeOrder = [SUNO, BOLO, LIKHO, DEKHO];
const typeMap: Record<string, string> = {
  suno: 'asr',
  bolo: 'text',
  likho: 'parallel',
  dekho: 'ocr',
};

const Stats = () => {
  const { t } = useTranslation();

  const { data: participationStats, error } = useFetch<Array<{ count: string; type: string }>>(
    apiPaths.participationStats
  );

  return (
    <div className={`${styles.stats} px-7 px-md-0 py-md-7`}>
      <Row>
        {initiativeOrder.map(initiative => {
          const stat =
            !participationStats || error
              ? null
              : participationStats.filter(stats => stats['type'] === typeMap[initiative])[0];

          return (
            <Col xs="12" md="3" className={styles.stat} key={initiative}>
              <div className="d-flex flex-column align-items-center py-7 py-md-0">
                {
                  <span className={styles.count}>
                    {stat ? (
                      stat.count || 0
                    ) : (
                      <Spinner data-testid="StatsSpinner" animation="border" variant="primary" />
                    )}
                  </span>
                }
                <span className={`${styles.initiative} mt-1`}>{`${t(initiative)} ${t('india')}`}</span>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Stats;
