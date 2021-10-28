import { useTranslation } from 'next-i18next';

import styles from './MedalPlaceholder.module.scss';

interface MedalPlaceholderProps {
  medal: string;
}

const MedalPlaceholder = ({ medal }: MedalPlaceholderProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={`${styles.root} d-flex align-items-center justify-content-center display-5 bg-light fw-light h-100`}
    >
      {t(medal.toLowerCase())}
    </div>
  );
};

export default MedalPlaceholder;
