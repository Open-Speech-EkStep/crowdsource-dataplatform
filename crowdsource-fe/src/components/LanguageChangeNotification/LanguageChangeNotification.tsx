import React from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import Button from 'components/Button';
import Link from 'components/Link';
import Modal from 'components/Modal';
import routePaths, { initiativeBaseRoute, INITIATIVES_URL } from 'constants/routePaths';

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

  const initiative = INITIATIVES_URL.find(initiativeKey =>
    router.pathname.includes(initiativeBaseRoute[initiativeKey])
  );

  return (
    <Modal
      footer={
        <Link href={routePaths[`${initiative}InitiativeHome`]} passHref>
          <Button as="a" onClick={onHide}>
            {t('proceed')}
          </Button>
        </Link>
      }
      closeButton={false}
      {...rest}
    >
      <div className="px-5 px-md-9">
        {t('languageChangeNotification', {
          fromLanguage: t(oldValue.toLowerCase()),
          toLanguage: t(newValue.toLowerCase()),
        })}
      </div>
    </Modal>
  );
};

export default LanguageChangeNotification;
