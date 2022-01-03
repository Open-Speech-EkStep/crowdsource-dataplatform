import type { ReactNode } from 'react';

import styles from './HomePageBackground.module.scss';

interface HomePageBackgroundPorps {
  children: ReactNode;
}

const HomePageBackground = (props: HomePageBackgroundPorps) => {
  return (
    <div data-testid="HomePageBackground" className={`${styles.root} position-relative px-2 px-lg-0`}>
      {props.children}
    </div>
  );
};

export default HomePageBackground;
