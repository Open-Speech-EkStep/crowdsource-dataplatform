import { useTranslation } from 'next-i18next';
import Modal from 'react-bootstrap/Modal';

import styles from './Report.module.scss';

interface ReeportSuccessModalProps {
  onHide: () => void;
  show: Boolean;
}

const ReeportSuccessModal = (props: ReeportSuccessModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      data-testid="ReeportSuccessModal"
      {...props}
      dialogClassName={styles.root}
      contentClassName={styles.content}
      centered
    >
      <Modal.Header closeButton className={`${styles.modalHeader} border-bottom-0`} />
      <Modal.Body className="pt-0 pb-8 pb-md-9">
        <div className="text-center">{t('thankyou')}</div>
        <div className="text-center pt-2">{t('reportSubmitSuccess')}</div>
      </Modal.Body>
    </Modal>
  );
};

export default ReeportSuccessModal;
