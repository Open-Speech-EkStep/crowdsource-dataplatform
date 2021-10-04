import type { ReactNode } from 'react';

import styles from './FunctionalPageBackground.module.scss';

interface FunctionalPageBackgroundProps {
  children: ReactNode;
}

const FunctionalPageBackground = (props: FunctionalPageBackgroundProps) => {
  return (
    <section
      data-testid="FunctionalPageBackground"
      className={`${styles.root} position-relative px-2 px-lg-0 flex-grow-1 pt-4 pb-8`}
    >
      {props.children}
    </section>
  );
};

export default FunctionalPageBackground;
