import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import styles from './MapLegend.module.scss';

const MapLegend = ({ data }: { data: { value: string }[] }) => {
  return (
    <Row>
      {data.map((quarter, index) => (
        <Col key={index} md="3" xs="12" className="p-0">
          <div className={`${styles[`legendsBG${index}`]}`}></div>
          <div>{quarter.value}</div>
        </Col>
      ))}
    </Row>
  );
};

export default MapLegend;
