import React, { useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import Button from 'components/Button';
import Modal from 'components/Modal';
import { getBrowserInfo } from 'utils/utils';

import styles from './ChromeExtension.module.scss';

const ChromeExtension = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [showChromeExtension, setShowChromeExtension] = useState(true);

  const [isNotChrome, setIsNotChrome] = useState(false);

  useEffect(() => {
    const browser = getBrowserInfo();
    setIsNotChrome(!browser.includes('Chrome'));
  }, []);

  const onShowVideoModal = () => {
    setShow(true);
  };

  const onHideModal = () => {
    setShow(false);
  };

  if (!showChromeExtension || isNotChrome) {
    return null;
  }

  return (
    <div
      data-testid="ChromeExtension"
      className={`${styles.root} d-none d-md-block d-lg-flex flex-wrap position-relative align-items-md-center bg-secondary px-3 ps-md-6 pe-md-12 py-3 border-bottom border-1 border-primary-10`}
    >
      <span className="fst-italic me-5">{t('chromeExtensionLabel')}</span>
      <div className="d-flex align-items-center mt-md-2 mt-lg-0">
        <Button variant="secondary" className={`${styles.ceBtn} flex-shrink-0`} onClick={onShowVideoModal}>
          {t('watchTheVideo')}
        </Button>
        <span className={`${styles.sep} d-flex border border-start-0 border-primary w-0 mx-5`} />
        <a
          href="https://chrome.google.com/webstore/detail/google-input-tools/mclkkofklkfljcocdinagocijmpgbhab"
          className="flex-shrink-0"
          target="_blank"
          rel="noreferrer"
        >
          {t('installNow')}
        </a>
      </div>
      <Modal show={show} onHide={onHideModal}>
        <video width="100%" height="360px" controls>
          <source src="/audio/phonetic_keyboard_instruction_video.mp4" type="video/mp4"></source>
          <track
            src="/audio/phonetic_keyboard_instruction_video.mp4"
            kind="captions"
            label="english_captions"
          ></track>
        </video>
      </Modal>
      <Button
        onClick={() => setShowChromeExtension(false)}
        variant="normal"
        className={`${styles.close} d-flex position-absolute cursor`}
      >
        <Image src="/images/close.svg" width="20" height="20" alt="Close Chrome Extension" />
      </Button>
    </div>
  );
};

export default ChromeExtension;
