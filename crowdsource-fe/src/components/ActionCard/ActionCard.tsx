import React, { useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from 'components/Button';
import ChangeUserModal from 'components/ChangeUserModal';
import InfoMessage from 'components/InfoMessage';
import { INITIATIVE_ACTIONS } from 'constants/initiativeConstants';
import localStorageConstants from 'constants/localStorageConstants';
import routePaths from 'constants/routePaths';
import useLocalStorage from 'hooks/useLocalStorage';
import type SpeakerDetails from 'types/SpeakerDetails';
import { capitalizeFirstLetter } from 'utils/utils';

import styles from './ActionCard.module.scss';

interface ActionCardProps {
  type: 'contribute' | 'validate';
  icon: string;
  text: string;
  warningMsg: string;
  shadow?: 'Blue' | 'Green';
  disabled?: boolean;
  initiative: 'suno' | 'bolo' | 'likho' | 'dekho';
  altText?: string;
}

const ActionCard = (props: ActionCardProps) => {
  const { type, icon, text, shadow, initiative } = props;
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const router = useRouter();

  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  const handleUserForm = () => {
    if (!speakerDetails) {
      setModalShow(true);
    } else {
      router.push(`/${router.locale}${routePaths[`${initiative}India${capitalizeFirstLetter(type)}`]}`);
    }
  };

  return (
    <div className={classNames({ [styles.disabledCursor]: props.disabled })}>
      <Button
        variant="normal"
        data-testid="cardAnchor"
        className={classNames('w-100 text-start', { [styles.disableClick]: props.disabled })}
        onClick={handleUserForm}
      >
        <div data-testid={`ActionCard${type}`} className={`${styles.root} rounded-20 overflow-hidden`}>
          <div className={styles.cardGradient}>
            <div className={`${styles.cardTopBg}`}>
              <div className={`${styles.cardBottomBg}`}>
                <div
                  data-testid="ActionCardWarningMessage"
                  className={`${props.disabled ? `${styles.infoMsg} position-absolute display-6` : 'd-none'}`}
                >
                  <InfoMessage text={t(props.warningMsg)} />
                </div>
                <div
                  className={classNames(`${styles.card} d-flex p-5 p-md-7 p-xl-9 align-items-center`, {
                    [styles.disableCard]: props.disabled,
                  })}
                >
                  <div className="flex-grow-1">
                    <h1 className={styles.type}>{t(INITIATIVE_ACTIONS[initiative][type])}</h1>
                    <p className={`${styles.text} mt-1 mt-md-2 mb-0`}>{text}</p>
                  </div>
                  <div
                    className={`${styles.icon} ${
                      styles[`iconShadow${shadow}`]
                    } d-flex rounded-circle flex-shrink-0`}
                  >
                    <Image
                      src={`/images/${icon}`}
                      alt={`${props.altText} Icon`}
                      width="120"
                      height="120"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Button>
      <ChangeUserModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        doRedirection={true}
        redirectionUrl={`${routePaths[`${initiative}India${capitalizeFirstLetter(type)}`]}`}
      />
    </div>
  );
};

export default ActionCard;
