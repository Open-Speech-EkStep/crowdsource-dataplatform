import Image from 'next/image';

import styles from './ActionCard.module.scss';

interface ActionCardProps {
  type: string;
  icon: string;
  text: string;
  shadow?: 'Blue' | 'Green';
}

const ActionCard = (props: ActionCardProps) => {
  const { type, icon, text, shadow } = props;

  return (
    <div className={`${styles.root} overflow-hidden`}>
      <div className={styles.cardGradient}>
        <div className={`${styles.cardTopBg}`}>
          <div className={`${styles.cardBottomBg}`}>
            <div className={`${styles.card} d-flex p-5 p-md-7 p-xl-9 align-items-center`}>
              <div className="flex-grow-1">
                <h1 className={styles.type}>{type}</h1>
                <p className={`${styles.text} mt-1 mt-md-2 mb-0`}>{text}</p>
              </div>
              <div className={`${styles.icon} ${styles[`iconShadow${shadow}`]} d-flex rounded-circle flex-shrink-0`}>
                <Image src={`/images/${icon}`} alt='Contribute Icon' width='120' height='120' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
