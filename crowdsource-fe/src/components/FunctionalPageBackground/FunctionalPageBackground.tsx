import type { ReactNode } from 'react';

import styles from './FunctionalPageBackground.module.scss';

interface FunctionalPageBackgroundProps {
  children: ReactNode;
}

const FunctionalPageBackground = (props: FunctionalPageBackgroundProps) => {
  return (
    <section
      data-testid="FunctionalPageBackground"
      className={`${styles.root} position-relative flex-grow-1`}
    >
      <div className={`${styles.wrapper} position-relative`}>{props.children}</div>
    </section>
  );
};

export default FunctionalPageBackground;
