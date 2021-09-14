import { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Button from 'react-bootstrap/Button';

import FeedbackSuccessModal from 'components/FeedbackSuccessModal';

import styles from './Feedback.module.scss';

const FeedbackModal = dynamic(() => import('components/FeedbackModal'), { ssr: false });

const Feedback = () => {
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const showModal = () => setModalShow(true);
  const hideModal = () => setModalShow(false);

  const showFeedbackSuccess = () => {
    hideModal();
    setFeedbackSuccess(true);
  };

  const hideFeedbackSuccess = () => {
    setFeedbackSuccess(false);
  };

  return (
    <Fragment>
      <Button
        onClick={showModal}
        className={`${styles.root} d-inline-flex justify-content-center align-items-center`}
      >
        <Image src="/images/feedback-icon.svg" width="32" height="32" alt={t('feedbackIconAlt')} />
      </Button>
      {modalShow && <FeedbackModal show={modalShow} onHide={hideModal} onSuccess={showFeedbackSuccess} />}
      {feedbackSuccess && <FeedbackSuccessModal show={feedbackSuccess} onHide={hideFeedbackSuccess} />}
    </Fragment>
  );
};

export default Feedback;
