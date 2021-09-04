import { useTranslation } from 'next-i18next';
import Image from 'next/image';
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
            <Image
              src={`/images/${currentLocale}-${initiative}IndiaLogo.svg`}
              alt={t(`${initiative}Logo`)}
              width="126"
              height="103"
            />
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
