import styles from './TriColorBorder.module.scss';

const TriColorBorder = () => {
  return (
    <div className={`${styles.border} d-flex`}>
      <span className={styles.orange}>&nbsp;</span>
      <span className={styles.blue}>&nbsp;</span>
      <span className={styles.green}>&nbsp;</span>
    </div>
  );
};

export default TriColorBorder;
