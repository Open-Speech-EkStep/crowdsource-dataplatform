import Image from 'next/image';

import styles from './Medal.module.scss';

interface MedalProps {
  medal: string;
  action: string;
  initiative: string;
  language: string;
}

const Medal = ({ initiative, medal, action, language }: MedalProps) => {
  return (
    <div
      className={`${styles.root} position-relative d-flex flex-column align-items-center text-center py-2 py-md-3`}
    >
      <div className={`${styles.medalImg} d-flex`}>
        <Image
          src={`/images/${language}/badges/${language}_${initiative}_${medal}_${action}.svg`}
          width="56"
          height="72"
          alt="Medal"
        />
      </div>
      <span className="display-5 mt-1 fw-light text-capitalize text-break">{medal}</span>
      <div className="d-none">
        <span className={`${styles.tip} position-absolute bg-light`} />
        <div
          className={`${styles.zoom} position-absolute d-flex align-items-center justify-content-center bg-light`}
        >
          <div className={styles.zoomImg}>
            <Image
              src={`/images/${language}/badges/${language}_${initiative}_${medal}_${action}.svg`}
              width="172"
              height="220"
              alt="Medal"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medal;
