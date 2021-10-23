import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import type { InitiativeType } from 'types/InitiativeType';

import styles from './InitiativeAction.module.scss';

interface InitiativeActionProps {
  type: InitiativeType;
  actionIcon: string;
  action: 'contribute' | 'validate';
  shadow?: 'Blue' | 'Green';
}

const InitiativeAction = ({
  type,
  actionIcon,
  action = 'contribute',
  shadow = 'Blue',
}: InitiativeActionProps) => {
  const { t } = useTranslation();
  const subText = action == 'contribute' ? `${type}ContributionSubtext` : `${type}ValidationSubtext`;

  return (
    <div className={`${styles.action} d-flex flex-column align-items-center text-center display-3`}>
      <div className={`${styles.actionIcon} ${styles[`actionIcon${shadow}`]} d-flex rounded-circle`}>
        <Image src={`/images/${actionIcon}`} alt={t('initiativeAction')} width="160" height="160" priority />
      </div>
      <div className="mt-4">{t(subText)}</div>
    </div>
  );
};

export default InitiativeAction;
