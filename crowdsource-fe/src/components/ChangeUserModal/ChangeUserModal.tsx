import { useTranslation } from 'next-i18next';

import Button from 'components/Button';
import ChangeUserForm from 'components/ChangeUserForm';
import Modal from 'components/Modal';

interface ChangeUserModalProps {
  onHide: () => void;
  show: Boolean;
  doRedirection?: boolean;
  redirectionUrl?: string;
}

const ChangeUserModal = ({ onHide, doRedirection, redirectionUrl, ...rest }: ChangeUserModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      data-testid="ChangeUserModal"
      {...rest}
      onHide={onHide}
      title={t('changeUserModalHeading')}
      subTitle={t('changeUserModalSubHeading')}
      footer={
        <Button type="submit" form="changeUserForm">
          {t('Done')}
        </Button>
      }
    >
      <div className="px-5 px-md-9">
        <ChangeUserForm onSubmit={onHide} doRedirection={doRedirection} redirectionUrl={redirectionUrl} />
      </div>
    </Modal>
  );
};

export default ChangeUserModal;
