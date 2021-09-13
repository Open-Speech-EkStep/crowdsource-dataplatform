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
        <Col xs="12" md="4" className="d-flex justify-content-center">
          <div className={styles.initiativeHeaderImg}>
            <Image
              src={`/images/${currentLocale}-${initiative}IndiaLogo.svg`}
              alt={t(`${initiative}Logo`)}
              width="126"
              height="103"
              priority
            />
          </div>
        </Col>
        <Col
          xs="12"
          md="8"
          className="d-flex justify-content-center justify-content-md-start text-center align-items-md-center text-md-start"
        >
          <div className={styles.initiativeHeaderText}>{t(`${initiative}SloganText`)}</div>
        </Col>
      </Row>
    </div>
  );
};
export default InitiativeHeader;
