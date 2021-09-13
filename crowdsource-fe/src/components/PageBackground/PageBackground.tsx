import type { CSSProperties, ReactNode } from 'react';

import styles from './PageBackground.module.scss';

interface PageBackgroundProps {
  children: ReactNode;
  image: string;
  imageMobile?: string;
  size?: string;
}

const PageBackground = ({ children, image, imageMobile = image, size = 'auto' }: PageBackgroundProps) => {
  const style: CSSProperties = {
    ['--background--image' as any]: `url(/images/${image})`,
    ['--background--image-mobile' as any]: `url(/images/${imageMobile})`,
    ['--background-size' as any]: size,
  };

  return (
    <section data-testid="PageBackground" className={styles.root} style={style}>
      {children}
    </section>
  );
};

export default PageBackground;
