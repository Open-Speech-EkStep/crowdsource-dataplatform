import React, { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { LOCALE_LANGUAGES } from 'constants/localesConstants';
import { capitalizeFirstLetter } from 'utils/utils';

import styles from './Medal.module.scss';

interface MedalProps {
  medal: string;
  action: string;
  initiative: string;
  language: string;
  selectedMedal?: string | '';
  handleClick?: () => void;
}

const Medal = ({ initiative, medal, action, language, selectedMedal, handleClick }: MedalProps) => {
  const { t } = useTranslation();
  const languageCode = LOCALE_LANGUAGES[language];
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const [hasMedalActive, setMedalActive] = useState(false);

  const medalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleDocumentClick(event: Event) {
      if (!medalRef?.current?.contains(event.target as Node)) {
        setShowZoomedImage(false);
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
    return handleClick ? handleClick() : setShowZoomedImage(true);
  };

  return (
    <div className="position-relative">
      <div
        role="button"
        className={`${styles.root} ${styles.earned} ${
          hasMedalActive || selectedMedal == medal ? styles.active : ''
        } d-flex flex-column align-items-center text-center py-2 py-md-3`}
        onClick={handleMedalClick}
        onKeyDown={handleMedalClick}
        ref={medalRef}
        tabIndex={0}
      >
        <div className={`${styles.medalImg} d-flex`}>
          <Image
            src={`/images/${languageCode}/badges/${languageCode}_${initiative}_${medal.toLowerCase()}_${action}.svg`}
            width="56"
            height="72"
            alt="Medal"
          />
        </div>
        <span className="display-5 mt-1 fw-light text-capitalize text-break">
          {capitalizeFirstLetter(t(medal.toLowerCase()))}
        </span>
      </div>
      {showZoomedImage && (
        <div>
          <span className={`${styles.tip} position-absolute bg-light`} />
          <div
            className={`${styles.zoom} position-absolute d-flex align-items-center justify-content-center bg-light`}
          >
            <div className={styles.zoomImg}>
              <Image
                src={`/images/${languageCode}/badges/${languageCode}_${initiative}_${medal.toLowerCase()}_${action}.svg`}
                width="172"
                height="220"
                alt="Medal"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medal;
