import styles from './MedalPlaceholder.module.scss';

interface MedalPlaceholderProps {
  medal: string;
}

const MedalPlaceholder = ({ medal }: MedalPlaceholderProps) => {
  return (
    <div
      className={`${styles.root} d-flex align-items-center justify-content-center display-5 bg-light fw-light h-100`}
    >
      {medal}
    </div>
  );
};

export default MedalPlaceholder;
