import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import ImageBasePath from 'components/ImageBasePath';
import Link from 'components/Link';
import TriColorBorder from 'components/TriColorBorder';
import { INITIATIVES } from 'constants/initiativeConstants';
import nodeConfig from 'constants/nodeConfig';
import routePaths from 'constants/routePaths';

import styles from './BronzeContribute.module.scss';

const BronzeContribute = () => {
  const { locale: currentLocale } = useRouter();
  const { t } = useTranslation();
  return (
    <div data-testid="BronzeContribute" className={`${styles.root} bg-secondary text-center text-md-start`}>
      <div className="p-3 py-md-5 px-md-10">
        <Row>
          <Col xs="12" md="2">
            <ImageBasePath
              src={`/images/${nodeConfig.brand}/${currentLocale}/badges/${currentLocale}_asr_bronze_contribute.svg`}
              width="125"
              height="160"
              alt={`Bronze Badge ${currentLocale}`}
            />
          </Col>
          <Col xs="12" md="10">
            <h2 className="mt-1 mt-md-0">{t('bronzeBrandContributorBadge')}</h2>
            <p className="display-3 mt-5 mt-md-3 mb-0">{t('bronzeContributeFive')}</p>
            <div className={`fx-bold d-flex flex-wrap justify-content-center justify-content-md-start mt-6`}>
              {INITIATIVES.map(initiative => {
                return (
                  <Link href={routePaths[`${initiative}InitiativeHome`]} key={initiative}>
                    <a
                      data-testid={`${initiative}Home`}
                      className={`${styles.link} rounded-24 bg-primary border-0 text-light text-center display-4 d-flex align-items-center justify-content-center text-uppercase`}
                    >
                      {t(`${initiative}`)} {t('initiativeTextSuffix')}
                    </a>
                  </Link>
                );
              })}
            </div>
          </Col>
        </Row>
      </div>
      <TriColorBorder />
    </div>
  );
};

export default BronzeContribute;
