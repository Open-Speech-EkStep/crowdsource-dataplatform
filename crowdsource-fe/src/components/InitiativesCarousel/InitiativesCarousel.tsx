import type { LegacyRef } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Slider from 'react-slick';

import Button from 'components/Button';
import InitiativeAction from 'components/InitiativeAction';
import InitiativeHeader from 'components/InitiativeHeader';
import Link from 'components/Link';
import TriColorBackground from 'components/TriColorBackground';
import { INITIATIVES, INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import routePaths from 'constants/routePaths';

import styles from './InitiativesCarousel.module.scss';

const InitiativesCarousel = () => {
  const { t } = useTranslation();
  const [sliders, setNavs] = useState({ sliderOne: undefined, sliderTwo: undefined });
  const sliderOneRef = useRef(undefined);
  const sliderTwoRef = useRef(undefined);

  const carouselDefaultSettings = {
    swipeToSlide: true,
    arrows: false,
    dots: false,
    infinite: true,
    autoplay: false,
    speed: 500,
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
    <div data-testid="InitiativesCarousel" className={`${styles.root} rounded-20 shadow-blue-lg mx-auto`}>
      <div className={`${styles.bottomShadow} rounded-20 overflow-hidden`}>
        <TriColorBackground>
          <div className={`${styles.initiativesCarousel} slickCarousel pt-6 pb-5 pb-md-3 py-md-8`}>
            <div className={`${styles.labelCarousel} mb-4`}>
              <Slider {...labelCarouselSettings}>
                {INITIATIVES.map(initiative => (
                  <div key={initiative}>
                    <span
                      className={`${styles.slideLabel} d-inline-block position-relative pb-2 display-2`}
                    >{`${t(`${initiative}`)} ${t('initiativeTextSuffix')}`}</span>
                  </div>
                ))}
              </Slider>
            </div>
            <div className="py-md-5">
              <Slider {...initiativeCarouselSettings}>
                {INITIATIVES.map(initiative => (
                  <div key={initiative} className="px-5 px-md-9 px-lg-10 px-xl-14 pb-3 pb-md-0">
                    <Row>
                      <Col
                        xs="12"
                        md="6"
                        lg="4"
                        className="d-flex justify-content-center justify-content-md-start align-items-md-center py-6"
                      >
                        <InitiativeHeader initiative={initiative} />
                      </Col>
                      <Col xs="6" md="3" lg="4" className="d-flex justify-content-center py-5 ">
                        <InitiativeAction
                          actionIcon={`${INITIATIVES_MAPPING[initiative]}_contribute_icon.svg`}
                          type={INITIATIVES_MAPPING[initiative]}
                          action="contribute"
                          shadow="Green"
                        />
                      </Col>
                      <Col xs="6" md="3" lg="4" className="d-flex justify-content-center py-5">
                        <InitiativeAction
                          actionIcon="validate.svg"
                          type={INITIATIVES_MAPPING[initiative]}
                          action="validate"
                        />
                      </Col>
                      <Col className="mt-3 d-flex justify-content-center justify-content-md-start">
                        <Link href={routePaths[`${initiative}InitiativeHome`]} passHref>
                          <Button data-testid="StartParticipating" as="a">
                            {t('startParticipating')}
                          </Button>
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
