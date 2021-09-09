import { useTranslation } from 'next-i18next';
import Modal from 'react-bootstrap/Modal';

import ChangeUserForm from 'components/ChangeUserForm';

import styles from './ChangeUserModal.module.scss'

interface ChangeUserModalProps {
  onHide: () => void;
  show: Boolean;
}

const ChangeUserModal = (props: ChangeUserModalProps) => {
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
          <h1 className={styles.heading}>{t('changeUserModalHeading')}</h1>
          <p className={`${styles.subHeading} mt-2 mt-md-3`}>{t('changeUserModalSubHeading')}</p>
        </header>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.form}>
          <ChangeUserForm />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <footer className={`${styles.footer} d-flex justify-content-center w-100 m-0 pt-4 pt-2`}>
          <button type="submit" className={styles.submitButton}>
            {t('Done')}
          </button>
        </footer>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeUserModal;
