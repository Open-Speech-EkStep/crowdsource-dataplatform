import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import ImageBasePath from 'components/ImageBasePath';
import Link from 'components/Link';
import { INITIATIVES_MEDIA } from 'constants/initiativeConstants';
import { RAW_LANGUAGES } from 'constants/localesConstants';
import { MEDALS } from 'constants/medalConstants';
import nodeConfig from 'constants/nodeConfig';
import routePaths from 'constants/routePaths';

import styles from './BadgesIntro.module.scss';

const BadgesIntro = () => {
  const badges = ['bronze', 'silver', 'gold', 'platinum'];
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <Row data-testid="BadgesIntro">
      <Col xs="12" lg="5">
        <h1 className="text-center text-md-start">{t('badgesIntroHeading')}</h1>
        <Link
          href={`${routePaths.badges}?initiative=${INITIATIVES_MEDIA.asr}&language=${RAW_LANGUAGES.en}&source=contribute&badge=${MEDALS[0]}`}
        >
          <a className="display-3 d-none d-lg-block mt-6">
            <b>{t('knowMore')}</b>
          </a>
        </Link>
      </Col>
      <Col xs="12" lg="7">
        <div className="d-flex mt-4 mt-lg-0 justify-content-between">
          {badges.map(badge => {
            return (
              <div key={badge} className={`${styles.badge} mx-3`}>
                <ImageBasePath
                  src={`/images/${nodeConfig.brand}/${currentLocale}/badges/${currentLocale}_asr_${badge}_contribute.svg`}
                  width="140"
                  height="180"
                  alt={`${badge} Badge ${currentLocale}`}
                />
              </div>
            );
          })}
        </div>
      </Col>
      <Col xs="12">
        <div className="d-flex justify-content-center justify-content-md-start mt-6 d-lg-none">
          <Link
            href={`${routePaths.badges}?initiative=${INITIATIVES_MEDIA.asr}&language=${RAW_LANGUAGES.en}&source=contribute&badge=${MEDALS[0]}`}
          >
            <a className="display-3">
              <b>{t('knowMore')}</b>
            </a>
          </Link>
        </div>
      </Col>
    </Row>
  );
};

export default BadgesIntro;
