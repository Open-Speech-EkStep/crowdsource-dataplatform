import { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import Button from 'components/Button';
import ErrorPopup from 'components/ErrorPopup';
import FeedbackSuccessModal from 'components/FeedbackSuccessModal';
import { getErrorMsg } from 'utils/utils';

import styles from './Feedback.module.scss';

const FeedbackModal = dynamic(() => import('components/FeedbackModal'), { ssr: false });

const Feedback = () => {
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState();

  const showModal = () => setModalShow(true);
  const hideModal = () => setModalShow(false);

  const showError = (error: any) => {
    setError(error);
    setModalShow(false);
    setShowErrorModal(true);
  };

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
        variant="normal"
        onClick={showModal}
        className={`${styles.root} ms-auto shadow-grey d-inline-flex justify-content-center align-items-center bg-light border border-1 border-primary-40 rounded-circle`}
      >
        <Image src="/images/feedback_icon.svg" width="32" height="32" alt={t('feedbackIconAlt')} />
      </Button>
      {modalShow && (
        <FeedbackModal
          show={modalShow}
          onHide={hideModal}
          onSuccess={showFeedbackSuccess}
          onError={error => showError(error)}
        />
      )}
      {feedbackSuccess && <FeedbackSuccessModal show={feedbackSuccess} onHide={hideFeedbackSuccess} />}
      {showErrorModal && (
        <ErrorPopup
          show={showErrorModal}
          errorMsg={getErrorMsg(error)}
          onHide={() => setShowErrorModal(false)}
        />
      )}
    </Fragment>
  );
};

export default Feedback;
