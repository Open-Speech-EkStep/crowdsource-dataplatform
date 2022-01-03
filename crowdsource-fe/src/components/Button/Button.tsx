// NOTE: We are disabling `no-restricted-imports` rule because we encourage people to import
// current component instead of `react-bootstrap/Button`.
/* eslint-disable no-restricted-imports */
import type { PropsWithChildren, Ref } from 'react';
import { forwardRef } from 'react';

import classnames from 'classnames';
import type { ButtonProps as ReactBootstrapButtonProps } from 'react-bootstrap/Button';
import ReactBootstrapButton from 'react-bootstrap/Button';

import styles from './Button.module.scss';

const getVariantMapping = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'secondary': {
      return {
        className: classnames('light', styles.secondary),
        name: 'light',
      };
    }

    case 'tertiary': {
      return {
        className: classnames('transparent', styles.tertiary),
        name: 'transparent',
      };
    }

    case 'normal': {
      return {
        className: classnames('info', styles.normal),
        name: 'link',
      };
    }

    case 'primary':
    default: {
      return {
        className: classnames('info', styles.primary),
        name: 'primary',
      };
    }
  }
};

interface ButtonProps extends PropsWithChildren<ReactBootstrapButtonProps> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'normal';
}

const Button = ({ variant = 'primary', ...rest }: ButtonProps, ref: Ref<HTMLObjectElement>) => {
  const { name, className } = getVariantMapping(variant);

  return (
    <ReactBootstrapButton
      data-testid="Button"
      {...rest}
      ref={ref}
      variant={name}
      className={classnames(rest.className, className)}
    />
  );
};

export default forwardRef(Button);
