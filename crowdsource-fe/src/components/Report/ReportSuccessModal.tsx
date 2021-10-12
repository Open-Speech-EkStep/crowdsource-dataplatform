import { useTranslation } from 'next-i18next';
import Modal from 'react-bootstrap/Modal';

interface ReeportSuccessModalProps {
  onHide: () => void;
  show: Boolean;
}

const ReeportSuccessModal = (props: ReeportSuccessModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal data-testid="ReeportSuccessModal" {...props} centered>
      <Modal.Header closeButton className="border-bottom-0" />
      <Modal.Body className="pt-0 pb-8 pb-md-9">
        <div className="text-center pb-4">
          <h3> {t('thankyou')}</h3>
        </div>
        <div className="text-center pt-2">{t('reportSubmitSuccess')}</div>
      </Modal.Body>
    </Modal>
  );
};

export default ReeportSuccessModal;
