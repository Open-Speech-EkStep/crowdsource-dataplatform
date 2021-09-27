import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import styles from './Stats.module.scss';

interface ContentInterface {
  id: string;
  stat: string | null;
  label: string;
}

interface StatsProps {
  contents: Array<ContentInterface>;
}

const Stats = ({ contents }: StatsProps) => {
  return (
    <div className={`${styles.root} bg-info px-7 px-md-0 py-md-7`}>
      <Row data-testid="StatsRow">
        {contents.map(content => {
          const stat = content.stat;

          return (
            <Col xs="12" md="3" className={styles.stat} key={content.id}>
              <div className="d-flex flex-column align-items-center py-7 py-md-0">
                {
                  <span className={`${styles.count} text-warning display-1`}>
                    {stat ? stat : <Spinner data-testid="StatsSpinner" animation="border" variant="light" />}
                  </span>
                }
                <span className="text-light text-uppercase mt-1 display-2">{content.label}</span>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Stats;
