import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Modal from 'react-bootstrap/Modal';

interface FeedbackSuccessModalProps {
  onHide: () => void;
  show: Boolean;
}

const FeedbackSuccessModal = (props: FeedbackSuccessModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal data-testid="FeedbackSuccessModal" {...props} centered>
      <Modal.Header closeButton />
      <Modal.Body>
        <div className="text-center">
          <Image src="/images/success.svg" width="48" height="48" alt="success" />
        </div>
        <div className="text-center">{t('submitSuccess')}</div>
        <div className="text-center">{t('feedbackThankYou')}!</div>
      </Modal.Body>
    </Modal>
  );
};

export default FeedbackSuccessModal;
