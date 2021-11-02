import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import Button from 'components/Button';

import styles from './IconTextButton.module.scss';

interface IconTextButtonProps {
  icon: string;
  textMobile?: string;
  textDesktop: string;
  onClick: () => void;
  altText: string;
  active?: boolean;
}

const IconTextButton = ({
  icon,
  textDesktop,
  textMobile,
  onClick,
  altText,
  active = false,
}: IconTextButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      data-testid={`${altText}_button`}
      className={classNames(
        `${styles.root} rounded d-flex align-items-center px-3 text-primary text-decoration-none`,
        { [styles.active]: active }
      )}
      variant="normal"
      onClick={onClick}
    >
      <Image src={`/images/${icon}`} width="24" height="24" alt={t(altText)} />
      {textMobile && <span className={`${styles.text} ms-2 d-md-none`}>{textMobile}</span>}
      {textDesktop && <span className={`${styles.text} ms-2 d-none d-md-block`}>{textDesktop}</span>}
    </Button>
  );
};

export default IconTextButton;
