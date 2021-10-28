import React, { useState, useEffect, useRef } from 'react';

import Image from 'next/image';

import { LOCALE_LANGUAGES } from 'constants/localesConstants';

import styles from './Medal.module.scss';

interface MedalProps {
  medal: string;
  action: string;
  initiative: string;
  language: string;
}

const Medal = ({ initiative, medal, action, language }: MedalProps) => {
  const languageCode = LOCALE_LANGUAGES[language];
  const [showZoomedImage, setShowZoomedImage] = useState(false);

  const medalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleDocumentClick(event: Event) {
      if (!medalRef?.current?.contains(event.target as Node)) {
        setShowZoomedImage(false);
      }
    }

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className="position-relative">
      <div
        role="button"
        className={`${styles.root} d-flex flex-column align-items-center text-center py-2 py-md-3 cursor-pointer`}
        onClick={() => setShowZoomedImage(true)}
        onKeyDown={() => setShowZoomedImage(true)}
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
        <span className="display-5 mt-1 fw-light text-capitalize text-break">{medal}</span>
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
