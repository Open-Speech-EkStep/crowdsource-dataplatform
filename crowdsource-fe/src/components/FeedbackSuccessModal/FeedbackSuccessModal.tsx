import React from 'react';

import { useTranslation } from 'next-i18next';
import Modal from 'react-bootstrap/Modal';

import ImageBasePath from 'components/ImageBasePath';

import styles from './FeedbackSuccessModal.module.scss';

interface FeedbackSuccessModalProps {
  onHide: () => void;
  show: boolean;
}

const FeedbackSuccessModal = (props: FeedbackSuccessModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      data-testid="FeedbackSuccessModal"
      {...props}
      dialogClassName={styles.root}
      contentClassName={`${styles.content} d-flex flex-column overflow-auto rounded-12`}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className={`${styles.modalHeader} border-bottom-0`} />
      <Modal.Body className="pt-0 pb-8 pb-md-9">
        <div className="text-center">
          <ImageBasePath src="/images/success.svg" width="48" height="48" alt="success" />
        </div>
        <div className="text-center pt-2">{t('submitSuccess')}</div>
        <div className="text-center">{t('feedbackThankYou')}</div>
      </Modal.Body>
    </Modal>
  );
};

export default FeedbackSuccessModal;
