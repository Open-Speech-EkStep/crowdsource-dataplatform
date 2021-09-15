import type { CSSProperties, ReactNode } from 'react';

import styles from './Background.module.scss';

interface BackgroundProps {
  children: ReactNode;
  image: string;
  imageMobile?: string;
  size?: string;
}

const Background = ({ children, image, imageMobile = image, size = 'auto' }: BackgroundProps) => {
  const style: CSSProperties = {
    ['--background--image' as any]: `url(/images/${image})`,
    ['--background--image-mobile' as any]: `url(/images/${imageMobile})`,
    ['--background-size' as any]: size,
  };

  return (
    <section data-testid="Background" className={styles.root} style={style}>
      {children}
    </section>
  );
};

export default Background;
