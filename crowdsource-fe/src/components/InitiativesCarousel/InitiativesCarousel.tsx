import type { LegacyRef } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Slider from 'react-slick';

import InitiativeAction from 'components/InitiativeAction';
import InitiativeHeader from 'components/InitiativeHeader';
import Link from 'components/Link';
import TriColorBackground from 'components/TriColorBackground';
import routePaths from 'constants/routePaths';

import styles from './InitiativesCarousel.module.scss';

const InitiativesCarousel = () => {
  const initiatives = ['suno', 'bolo', 'likho', 'dekho'];
  const { t } = useTranslation();
  const [sliders, setNavs] = useState({ sliderOne: undefined, sliderTwo: undefined });
  const sliderOneRef = useRef(undefined);
  const sliderTwoRef = useRef(undefined);

  const carouselDefaultSettings = {
    swipeToSlide: true,
    arrows: false,
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 2000,
  };

  const labelCarouselSettings = {
    ...carouselDefaultSettings,
    asNavFor: sliders.sliderOne,
    ref: sliderTwoRef as LegacyRef<any>,
    slidesToShow: 4,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          centerMode: true,
          centerPadding: '18',
          slidesToShow: 2.25,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const initiativeCarouselSettings = {
    ...carouselDefaultSettings,
    asNavFor: sliders.sliderTwo,
    ref: sliderOneRef as LegacyRef<any>,
    slidesToShow: 1,
  };

  useEffect(() => {
    setNavs({
      sliderOne: sliderOneRef.current,
      sliderTwo: sliderTwoRef.current,
    });
  }, []);

  return (
    <div data-testid="InitiativesCarousel" className={`${styles.root} mx-auto`}>
      <div className={styles.bottomShadow}>
        <TriColorBackground>
          <div className={`${styles.initiativesCarousel} slickCarousel pt-6 pb-3 py-md-8`}>
            <div className={`${styles.labelCarousel} mb-4`}>
              <Slider {...labelCarouselSettings}>
                {initiatives.map(initiative => (
                  <div key={initiative}>
                    <span className={`${styles.slideLabel} d-inline-block position-relative pb-2`}>{`${t(
                      `${initiative}`
                    )} ${t('india')}`}</span>
                  </div>
                ))}
              </Slider>
            </div>
            <div className="py-md-5">
              <Slider {...initiativeCarouselSettings}>
                {initiatives.map(initiative => (
                  <div key={initiative} className={`${styles.initiative} px-5 px-md-9 px-lg-14`}>
                    <Row>
                      <Col xs="12" md="6" lg="4" className="d-flex align-items-center py-6">
                        <InitiativeHeader initiative={initiative} />
                      </Col>
                      <Col xs="6" md="3" lg="4" className="d-flex justify-content-center py-5 ">
                        <InitiativeAction
                          actionIcon={`${initiative}-contribute-icon.svg`}
                          initiative={initiative}
                        />
                      </Col>
                      <Col xs="6" md="3" lg="4" className="d-flex justify-content-center py-5">
                        <InitiativeAction actionIcon="validate.svg" initiative={initiative} />
                      </Col>
                      <Col className="mt-3 d-flex justify-content-center justify-content-md-start">
                        <Link href={routePaths[`${initiative}IndiaHome`]}>
                          <a
                            data-testid="StartParticipating"
                            className={`${styles.startParticipatingBtn} d-flex justify-content-center align-items-center w-100`}
                          >
                            {t('startParticipating')}
                          </a>
                        </Link>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </TriColorBackground>
      </div>
    </div>
  );
};

export default InitiativesCarousel;
