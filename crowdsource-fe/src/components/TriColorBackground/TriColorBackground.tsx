import type { ReactNode } from 'react';

import styles from './TriColorBackground.module.scss';

const TriColorBackground = ({ children }: { children: ReactNode }) => {
  return (
    <section className={styles.root}>
      <div className={styles.topBg}>
        <div className={styles.bottomBg}>{children}</div>
      </div>
    </section>
  );
};

export default TriColorBackground;
