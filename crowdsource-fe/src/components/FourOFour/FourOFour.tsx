import React, { Fragment } from 'react';

import { Trans, useTranslation } from 'next-i18next';
import Container from 'react-bootstrap/Container';

import ImageBasePath from 'components/ImageBasePath';
import Logo from 'components/Logo';

import styles from './FourOFour.module.scss';
import HomepageLink from './HomepageLink';

const FourOFour = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <header
        data-testid="Header"
        role="banner"
        className={`${styles.header} shadow-blue d-flex bg-light text-primary p-0 position-sticky w-100 d-flex justify-content-center`}
      >
        <Logo />
      </header>
      <div className={`${styles.wrapper} d-flex flex-fill bg-secondary`}>
        <Container fluid="lg" className="flex-fill">
          <div className={`${styles.content} text-center`}>
            <ImageBasePath src={`/images/error_page_icon.svg`} alt="404 Icon" width="48" height="48" />
            <h2>{t('pageNotFoundHeading')}</h2>
            <p className="mt-2 display-3">{t('pageNotFoundText')}</p>
            <p className="mt-8 display-5">
              <Trans
                i18nKey="visitHome"
                defaults="visitHome"
                components={{
                  homepageLink: <HomepageLink />,
                }}
              />
            </p>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default FourOFour;
