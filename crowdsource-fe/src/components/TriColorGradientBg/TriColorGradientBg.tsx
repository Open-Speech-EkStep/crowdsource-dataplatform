import type { ReactNode } from 'react';

import styles from './TriColorGradientBg.module.scss';

interface TriColorGradientBgProps {
  children: ReactNode;
}

const TriColorGradientBg = ({ children }: TriColorGradientBgProps) => {
  return (
    <div className={`${styles.root} rounded-20`} data-testid="badgeDescriptionRow">
      <div className="rounded-20 bg-light p-5">{children}</div>
    </div>
  );
};

export default TriColorGradientBg;
