import LanguageMedals from 'components/LanguageMedals';
import Image from 'next/image';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import styles from './BadgeSection.module.scss';

interface BadgeSectionProps {
  languages: Array<string>;
  initiative: string;
}

const BadgeSection = ({ languages, initiative }: BadgeSectionProps) => {
  return (
    <>
      <Row className="d-none d-lg-flex">
        <Col lg="2">&nbsp;</Col>
        <Col lg="10">
          <Row>
            <Col lg="6">
              <h6 className="fw-light">Contribution</h6>
            </Col>
            <Col lg="6">
              <h6 className="fw-light">Validation</h6>
            </Col>
          </Row>
        </Col>
      </Row>
      {languages.map(language => (
        <LanguageMedals initiative={initiative} key={language} language={language} />
      ))}
    </>
  );
};

export default BadgeSection;
