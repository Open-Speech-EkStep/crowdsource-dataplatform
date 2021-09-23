import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import styles from './InitiativeAction.module.scss';

interface InitiativeActionProps {
  initiative: string;
  actionIcon: string;
  shadow?: 'Blue' | 'Green';
}

const InitiativeAction = ({ initiative, actionIcon, shadow = 'Blue' }: InitiativeActionProps) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.action} d-flex flex-column align-items-center text-center display-3`}>
      <div className={`${styles.actionIcon} ${styles[`actionIcon${shadow}`]} d-flex rounded-circle`}>
        <Image src={`/images/${actionIcon}`} alt={t('initiativeAction')} width="160" height="160" priority />
      </div>
      <div className="mt-4">{t(`${initiative}ContributionSubtext`)}</div>
    </div>
  );
};

export default InitiativeAction;
