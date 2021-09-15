import { useTranslation } from 'next-i18next';
import Button from 'react-bootstrap/Button';

import ChangeUserForm from 'components/ChangeUserForm';
import Modal from 'components/Modal';

import styles from './ChangeUserModal.module.scss';

interface ChangeUserModalProps {
  onHide: () => void;
  show: Boolean;
}

const ChangeUserModal = ({ onHide, ...rest }: ChangeUserModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      data-testid="ChangeUserModal"
      {...rest}
      onHide={onHide}
      title={t('changeUserModalHeading')}
      subTitle={t('changeUserModalSubHeading')}
      footer={
        <Button type="submit" form="changeUserForm" className={styles.submitButton}>
          {t('Done')}
        </Button>
      }
    >
      <div className={styles.form}>
        <ChangeUserForm onSubmit={onHide} />
      </div>
    </Modal>
  );
};

export default ChangeUserModal;
