import type { ReactNode } from 'react';

import classNames from 'classnames';

import Button from 'components/Button';

import styles from './IconTextButton.module.scss';

interface IconTextButtonProps {
  textMobile?: string;
  textDesktop: string;
  onClick: () => void;
  altText: string;
  children: ReactNode;
  active?: boolean;
  id?: string;
}

const IconTextButton = ({
  textDesktop,
  textMobile,
  onClick,
  altText,
  children,
  id,
  active = false,
}: IconTextButtonProps) => {
  return (
    <Button
      id={id}
      data-testid={`${altText}_button`}
      className={classNames(
        `${styles.root} rounded d-flex align-items-center px-3 text-primary text-decoration-none`,
        { [styles.active]: active }
      )}
      variant="normal"
      onClick={onClick}
    >
      {children}
      {textMobile && <span className={`${styles.text} ms-2 d-md-none`}>{textMobile}</span>}
      {textDesktop && <span className={`${styles.text} ms-2 d-none d-md-block`}>{textDesktop}</span>}
    </Button>
  );
};

export default IconTextButton;
