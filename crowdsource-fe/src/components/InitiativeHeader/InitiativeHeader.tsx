import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import type { Initiative } from 'types/Initiatives';

import styles from './InitiativeHeader.module.scss';

interface PageHeaderProps {
  initiative: Initiative;
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
              src={`/images/${currentLocale}/logos/${currentLocale}-${initiative}IndiaLogo.svg`}
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
          <div className={`${styles.initiativeHeaderText} display-3`}>
            {t(`${INITIATIVES_MEDIA_MAPPING[initiative]}SloganText`)}
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default InitiativeHeader;
