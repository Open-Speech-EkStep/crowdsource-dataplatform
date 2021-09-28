import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import InfoMessage from 'components/InfoMessage';
import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './ActionCard.module.scss';

interface ActionCardProps {
  type: string;
  icon: string;
  text: string;
  warningMsg: string;
  shadow?: 'Blue' | 'Green';
  disabled?: boolean;
  initiative: string;
}

const ActionCard = (props: ActionCardProps) => {
  const { type, icon, text, shadow, initiative } = props;
  const { t } = useTranslation();

  return (
    <div className={classNames({ [styles.disabledCursor]: props.disabled })}>
      <Link href={routePaths[`${initiative}India${type}`]}>
        <a className={classNames('d-block', { [styles.disabledCard]: props.disabled })}>
          <div data-testid="ActionCard" className={`${styles.root} overflow-hidden`}>
            <div className={styles.cardGradient}>
              <div className={`${styles.cardTopBg}`}>
                <div className={`${styles.cardBottomBg}`}>
                  <div
                    data-testid="ActionCardWarningMessage"
                    className={`${
                      props.disabled ? `${styles.infoMsg} position-absolute display-6` : 'd-none'
                    }`}
                  >
                    <InfoMessage text={t(props.warningMsg)} />
                  </div>
                  <div className={`${styles.card} d-flex p-5 p-md-7 p-xl-9 align-items-center`}>
                    <div className="flex-grow-1">
                      <h1 className={styles.type}>{t(type)}</h1>
                      <p className={`${styles.text} mt-1 mt-md-2 mb-0`}>{text}</p>
                    </div>
                    <div
                      className={`${styles.icon} ${
                        styles[`iconShadow${shadow}`]
                      } d-flex rounded-circle flex-shrink-0`}
                    >
                      <Image src={`/images/${icon}`} alt="Contribute Icon" width="120" height="120" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default ActionCard;
