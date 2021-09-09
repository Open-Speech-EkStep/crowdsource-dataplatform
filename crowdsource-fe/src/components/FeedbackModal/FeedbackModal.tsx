import { useTranslation } from 'next-i18next';
import Modal from 'react-bootstrap/Modal';

import FeedbackForm from 'components/FeedbackForm';

import styles from './FeedbackModal.module.scss';

interface FeedbackModalProps {
  onHide: () => void;
  show: Boolean;
}

const FeedbackModal = (props: FeedbackModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName={styles.root}
      contentClassName={styles.content}
    >
      <Modal.Header closeButton>
        <header className={`${styles.header} text-center flex-grow-1`}>
          <h1 className={styles.heading}>{t('feedbackModalHeading')}</h1>
          <p className={`${styles.subHeading} mt-2 mt-md-3`}>{t('feedbackModalSubHeading')}</p>
        </header>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.form}>
          <FeedbackForm hideModal={props.onHide} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <footer className={`${styles.footer} d-flex justify-content-center w-100 m-0 pt-4 pt-2`}></footer>
      </Modal.Footer>
    </Modal>
  );
};

export default FeedbackModal;
