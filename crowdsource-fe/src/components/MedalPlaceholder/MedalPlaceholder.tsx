import styles from './MedalPlaceholder.module.scss';

const MedalPlaceholder = () => {
  return (
    <div
      className={`${styles.root} d-flex align-items-center justify-content-center display-5 bg-light fw-light h-100`}
    >
      Silver
    </div>
  );
};

export default MedalPlaceholder;
