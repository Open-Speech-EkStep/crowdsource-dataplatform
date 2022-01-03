import React from 'react';

import { useTranslation } from 'next-i18next';

import ImageBasePath from 'components/ImageBasePath';
import type { Initiative } from 'types/Initiatives';

import styles from './InitiativeAction.module.scss';

interface InitiativeActionProps {
  type: Initiative;
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
        <ImageBasePath
          src={`/images/${actionIcon}`}
          alt={t('initiativeAction')}
          width="160"
          height="160"
          priority={true}
        />
      </div>
      <div className="mt-4 text-break">{t(subText)}</div>
    </div>
  );
};

export default InitiativeAction;
