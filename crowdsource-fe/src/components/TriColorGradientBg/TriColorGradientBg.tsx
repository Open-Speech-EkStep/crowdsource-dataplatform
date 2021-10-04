import type { ReactNode } from 'react';

import styles from './TriColorGradientBg.module.scss';

interface TriColorGradientBgProps {
  children: ReactNode;
}

const TriColorGradientBg = ({ children }: TriColorGradientBgProps) => {
  return (
    <div className={styles.root}>
      <div className={`${styles.inner} bg-light p-5`}>{children}</div>
    </div>
  );
};

export default TriColorGradientBg;
