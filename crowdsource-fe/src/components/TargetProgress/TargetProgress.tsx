import ProgressBar from 'react-bootstrap/ProgressBar';

import styles from './TargetProgress.module.scss';

const TargetProgress = () => {
  return (
    <div className={`${styles.root} d-flex flex-column`}>
      <div className={`${styles.details} d-flex justify-content-between align-items-center`}>
        <div className={styles.percentage}>
          <span className={styles.count}>25%</span> of Suno India Target Achieved
        </div>
        <span className={`${styles.hours} d-none d-md-block`}>613/2400 Hour(s)</span>
      </div>
      <ProgressBar now={60} className="mt-2 mt-md-1" />
      <span className={`${styles.hours} d-md-none mt-2 align-self-end`}>613/2400 Hour(s)</span>
    </div>
  );
};

export default TargetProgress;
