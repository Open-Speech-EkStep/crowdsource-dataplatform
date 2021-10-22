import type { ReactNode } from 'react';

import classNames from 'classnames';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import styles from './TwoColumn.module.scss';

interface TwoColumnProps {
  left?: ReactNode;
  right?: ReactNode;
  withSep?: boolean;
}

const TwoColumn = ({ left, right, withSep = true }: TwoColumnProps) => {
  return (
    <Row>
      <Col xs="12" md="4" className="pb-4 pb-md-0">
        {left}
      </Col>
      <Col xs="12" md="auto">
        <span className={classNames('d-flex h-100', { [styles.sep]: withSep })} />
      </Col>
      <Col className="pt-4 pt-md-0">{right}</Col>
    </Row>
  );
};

export default TwoColumn;
