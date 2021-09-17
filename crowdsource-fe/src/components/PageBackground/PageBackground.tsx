import type { ReactNode } from 'react';

import styles from './PageBackground.module.scss';

interface PageBackgroundProps {
  children: ReactNode
}

const PageBackground = (props: PageBackgroundProps) => {
  return (
    <section
      data-testid="PageBackground"
      className={`${styles.root} position-relative px-2 px-lg-0 pt-5 pb-9 pt-md-11 pb-md-12`}
    >
      {props.children}
    </section>
  );
};

export default PageBackground;
