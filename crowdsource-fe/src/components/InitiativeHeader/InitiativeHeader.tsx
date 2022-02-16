import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import ImageBasePath from 'components/ImageBasePath';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import nodeConfig from 'constants/nodeConfig';
import type { Initiative } from 'types/Initiatives';
import { isLanguageImageAvailable } from 'utils/utils';

import styles from './InitiativeHeader.module.scss';

interface PageHeaderProps {
  initiative: Initiative;
}

const InitiativeHeader = ({ initiative }: PageHeaderProps) => {
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  const locale = isLanguageImageAvailable(currentLocale);

  return (
    <div>
      <Row>
        <Col xs="12" md="4" className="d-flex justify-content-center">
          <div className={styles.initiativeHeaderImg}>
            <ImageBasePath
              src={`/images/${nodeConfig.brand}/${locale}/logos/${locale}-${INITIATIVES_MAPPING[initiative]}InitiativeLogo.svg`}
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
            {t(`${INITIATIVES_MAPPING[initiative]}SloganText`)}
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default InitiativeHeader;
