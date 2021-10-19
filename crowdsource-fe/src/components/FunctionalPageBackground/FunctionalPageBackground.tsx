import type { ReactNode } from 'react';

import ChromeExtension from 'components/ChromeExtension';

import styles from './FunctionalPageBackground.module.scss';

interface FunctionalPageBackgroundProps {
  children: ReactNode;
}

const FunctionalPageBackground = (props: FunctionalPageBackgroundProps) => {
  return (
    <section
      data-testid="FunctionalPageBackground"
      className={`${styles.root} position-relative flex-grow-1 pb-8`}
    >
      <ChromeExtension />
      <div className={`${styles.wrapper} position-relative px-2 px-lg-0 pt-4`}>{props.children}</div>
    </section>
  );
};

export default FunctionalPageBackground;
