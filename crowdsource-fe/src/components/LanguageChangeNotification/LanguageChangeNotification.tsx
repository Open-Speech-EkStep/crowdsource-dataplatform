import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import Button from 'components/Button';
import Link from 'components/Link';
import Modal from 'components/Modal';
import { INITIATIVES } from 'constants/initiativeConstants';
import routePaths from 'constants/routePaths';

interface LanguageChangeNotificationProps {
  oldValue: string;
  newValue: string;
  show: boolean;
  onHide: () => void;
}

const LanguageChangeNotification = ({
  oldValue,
  newValue,
  onHide,
  ...rest
}: LanguageChangeNotificationProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const initiative = INITIATIVES.find(initiative => router.pathname.includes(`${initiative}-india`));

  return (
    <Modal
      footer={
        <Link href={routePaths[`${initiative}IndiaHome`]} passHref>
          <Button as="a" onClick={onHide}>
            {t('proceed')}
          </Button>
        </Link>
      }
      closeButton={false}
      {...rest}
    >
      <div className="px-5 px-md-9">
        {t('languageChangeNotification', { fromLanguage: t(oldValue), toLanguage: t(newValue) })}
      </div>
    </Modal>
  );
};

export default LanguageChangeNotification;
