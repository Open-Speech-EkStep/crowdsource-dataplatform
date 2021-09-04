import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import styles from './InitiativeAction.module.scss';

interface InitiativeActionProps {
  initiative: string;
  actionIcon: string;
}

const InitiativeAction = ({ initiative, actionIcon }: InitiativeActionProps) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.action} d-flex flex-column align-items-center text-center`}>
      <div className={styles.actionIcon}>
        <Image src={`/images/${actionIcon}`} alt={t('initiativeAction')} width="160" height="160" />
      </div>
      <div className={styles.actionText}>{t(`${initiative}ContributionSubtext`)}</div>
    </div>
  );
};

export default InitiativeAction;
