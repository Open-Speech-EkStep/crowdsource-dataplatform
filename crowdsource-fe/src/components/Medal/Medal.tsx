import React, { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import ImageBasePath from 'components/ImageBasePath';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';
import { LOCALE_LANGUAGES } from 'constants/localesConstants';
import nodeConfig from 'constants/nodeConfig';
import type { Initiative } from 'types/Initiatives';
import { capitalizeFirstLetter, isLanguageImageAvailable } from 'utils/utils';

import styles from './Medal.module.scss';

interface MedalProps {
  medal: string;
  action: string;
  initiative: Initiative;
  language: string;
  selectedMedal?: string | '';
  handleClick?: () => void;
}

const Medal = ({ initiative, medal, action, language, selectedMedal, handleClick }: MedalProps) => {
  const { t } = useTranslation();
  const languageCode = LOCALE_LANGUAGES[language];
  const [hasMedalActive, setMedalActive] = useState(false);

  const languagePrefix = isLanguageImageAvailable(languageCode);

  const medalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleDocumentClick(event: Event) {
      if (!medalRef?.current?.contains(event.target as Node)) {
        setMedalActive(false);
      }
    }

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleMedalClick = function () {
    setMedalActive(true);
    return handleClick && handleClick();
  };

  const popover = (
    <Popover className={`${styles.zoom} border-0 d-flex`}>
      <div className={`${styles.zoomImg} d-flex m-auto`}>
        <ImageBasePath
          src={`/images/${nodeConfig.brand}/${languagePrefix}/badges/${languagePrefix}_${
            INITIATIVES_MAPPING[initiative]
          }_${medal.toLowerCase()}_${action}.svg`}
          width="172"
          height="220"
          alt="Medal"
        />
      </div>
    </Popover>
  );

  const medalCard = (
    <div
      data-testid={`${languagePrefix}-${initiative}-${medal.toLowerCase()}-${action}-medal`}
      role="button"
      className={`${styles.root} ${
        hasMedalActive || selectedMedal == medal ? styles.active : ''
      } d-flex flex-column align-items-center text-center py-2 py-md-3`}
      onClick={handleMedalClick}
      onKeyDown={handleMedalClick}
      ref={medalRef}
      tabIndex={0}
    >
      <div className={`${styles.medalImg} d-flex`}>
        <ImageBasePath
          src={`/images/${nodeConfig.brand}/${languagePrefix}/badges/${languagePrefix}_${
            INITIATIVES_MAPPING[initiative]
          }_${medal.toLowerCase()}_${action}.svg`}
          width="56"
          height="72"
          alt="Medal"
        />
      </div>
      <span className="display-5 mt-1 fw-light text-capitalize text-break">
        {capitalizeFirstLetter(t(medal.toLowerCase()))}
      </span>
    </div>
  );
  return handleClick ? (
    medalCard
  ) : (
    <OverlayTrigger placement="auto" overlay={popover} trigger="focus">
      {medalCard}
    </OverlayTrigger>
  );
};

export default Medal;
