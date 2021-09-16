import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './BadgesIntro.module.scss';

const BadgesIntro = () => {
  const badges = ['bronze', 'silver', 'gold', 'platinum'];
  const { t } = useTranslation();
  const { locale: currentLocale } = useRouter();

  return (
    <Row data-testid="BadgesIntro">
      <Col xs="12" lg="5">
        <h1 className={`${styles.header} text-center text-md-start`}>{t('badgesIntroHeading')}</h1>
        <Link href={routePaths.badges}>
          <a className={`${styles.knowMore} d-none d-lg-block mt-6`}>{t('knowMore')}</a>
        </Link>
      </Col>
      <Col xs="12" lg="7">
        <div className="d-flex mt-4 mt-lg-0 justify-content-between">
          {badges.map(badge => {
            return (
              <div key={badge} className={styles.badge}>
                <Image
                  src={`/images/${currentLocale}/badges/${currentLocale}_bolo_${badge}_contribute.svg`}
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
          <Link href={routePaths.badges}>
            <a className={styles.knowMore}>{t('knowMore')}</a>
          </Link>
        </div>
      </Col>
    </Row>
  );
};

export default BadgesIntro;
