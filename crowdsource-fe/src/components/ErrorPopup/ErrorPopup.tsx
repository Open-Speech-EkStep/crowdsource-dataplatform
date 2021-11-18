import React from 'react';

import { useTranslation } from 'next-i18next';

import Button from 'components/Button';
import Modal from 'components/Modal';

interface ErrorPopupProps {
  show: boolean;
  errorMsg: string;
  onHide: () => void;
}

const ErrorPopup = ({ onHide, errorMsg, ...rest }: ErrorPopupProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      footer={<Button onClick={onHide}>{t('proceed')}</Button>}
      backdrop="static"
      closeButton={false}
      {...rest}
    >
      <div className="px-5 px-md-9">{t(errorMsg)}</div>
    </Modal>
  );
};

export default ErrorPopup;
