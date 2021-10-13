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

const MAX_COL_LENGTH = 12;

const Stats = ({ contents }: StatsProps) => {
  const mdNum = MAX_COL_LENGTH / contents.length;
  return (
    <div className={`${styles.root} rounded-20 bg-info px-7 px-md-0 py-md-7`}>
      <Row data-testid="StatsRow" className="m-md-0">
        {contents.map(content => {
          const stat = content.stat;

          return (
            <Col xs={MAX_COL_LENGTH} md={mdNum} className={styles.stat} key={content.id}>
              <div className="d-flex flex-column align-items-center py-7 py-md-0">
                <span className={`${styles.count} text-warning display-1`}>
                  {stat ? stat : <Spinner data-testid="StatsSpinner" animation="border" variant="light" />}
                </span>
                <span className="text-light mt-1 display-3 text-center">{content.label}</span>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Stats;
