import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import LanguageMedals from 'components/LanguageMedals';
import { groupBy } from 'utils/utils';

interface BadgeSectionProps {
  initiative: string;
  initiativeBadge: Array<any>;
}

const BadgeSection = ({ initiative, initiativeBadge }: BadgeSectionProps) => {
  const groupByLanguage = groupBy(initiativeBadge, 'language');
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
      {Object.keys(groupByLanguage).map(language => (
        <LanguageMedals
          initiative={initiative}
          key={language}
          language={language}
          languageBadges={groupByLanguage[language]}
        />
      ))}
    </>
  );
};

export default BadgeSection;
