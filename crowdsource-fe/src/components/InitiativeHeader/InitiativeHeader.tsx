import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import styles from './InitiativeHeader.module.scss';

interface PageHeaderProps {
  initiative: string;
}

const InitiativeHeader = ({ initiative }: PageHeaderProps) => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <div>
      <Row>
        <Col xs="auto">
          <div className={styles.initiativeHeaderImg}>
            <img src={`/images/${currentLocale}-${initiative}IndiaLogo.svg`} alt={t(`${initiative}Logo`)} />
          </div>
        </Col>
        <Col className="d-flex align-items-center">
          <div className={styles.initiativeHeaderText}>{t(`${initiative}SloganText`)}</div>
        </Col>
      </Row>
    </div>
  );
};
export default InitiativeHeader;
