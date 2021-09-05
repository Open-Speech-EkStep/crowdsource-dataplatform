import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Link from 'components/Link';
import TriColorBorder from 'components/TriColorBorder';
import routePaths from 'constants/routePaths';

import styles from './BronzeContribute.module.scss';

const BronzeContribute = () => {
  const { locale: currentLocale } = useRouter();
  const { t } = useTranslation();
  const initiatives = ['suno', 'bolo', 'likho', 'dekho'];

  return (
    <div className={`${styles.root} text-center text-md-start`}>
      <div className="p-3 py-md-5 px-md-10">
        <Row>
          <Col xs="12" md="2">
            <Image
              src={`/images/${currentLocale}_bolo_bronze_contribute.svg`}
              width="125"
              height="160"
              alt={`Bronze Badge ${currentLocale}`}
            />
          </Col>
          <Col xs="12" md="10">
            <h1 className={`${styles.header} mt-1 mt-md-0`}>{t('bronzeBhashaSamarthakBadge')}</h1>
            <p className={`${styles.text} mt-5 mt-md-3 mb-0`}>{t('bronzeContributeFive')}</p>
            <div
              className={`${styles.initiatives} d-flex flex-wrap justify-content-center justify-content-md-start mt-6`}
            >
              {initiatives.map(initiative => {
                return (
                  <Link href={routePaths[`${initiative}IndiaHome`]} key={initiative}>
                    <button
                      className={`${styles.link} d-flex align-items-center justify-content-center text-uppercase`}
                    >
                      {t(`${initiative}`)} {t('india')}
                    </button>
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