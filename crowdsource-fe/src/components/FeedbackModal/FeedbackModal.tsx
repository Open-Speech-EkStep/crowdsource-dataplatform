import { useTranslation } from 'next-i18next';

import FeedbackForm from 'components/FeedbackForm';
import Modal from 'components/Modal';

import styles from './FeedbackModal.module.scss';

interface FeedbackModalProps {
  onHide: () => void;
  onSuccess: () => void;
  show: Boolean;
}

const FeedbackModal = ({ onSuccess, ...props }: FeedbackModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal {...props} title={t('feedbackModalHeading')} subTitle={t('feedbackModalSubHeading')}>
      <div className={styles.form}>
        <FeedbackForm onSuccess={onSuccess} />
      </div>
    </Modal>
  );
};

export default FeedbackModal;
