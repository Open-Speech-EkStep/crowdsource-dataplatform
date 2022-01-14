import type { ReactNode } from 'react';

import classnames from 'classnames';
import ReactBootstrapModal from 'react-bootstrap/Modal';

import styles from './Modal.module.scss';

const noop = () => {};

interface ModalProps {
  children: ReactNode;
  title?: string;
  subTitle?: string;
  footer?: ReactNode;
  size?: 'sm' | 'lg' | 'xl';
  show?: boolean;
  onHide?: () => void;
  backdrop?: boolean | 'static' | undefined;
  closeButton?: boolean;
  className?: string;
}

const Modal = ({
  children,
  size = 'lg',
  title = '',
  subTitle = '',
  footer = null,
  show = false,
  onHide = noop,
  backdrop = 'static',
  closeButton = true,
  ...rest
}: ModalProps) => {
  const hasHeader = title || subTitle;

  return (
    <ReactBootstrapModal
      data-testid="Modal"
      {...rest}
      size={size}
      centered
      dialogClassName={styles.root}
      contentClassName={styles.content}
      scrollable
      show={show}
      onHide={onHide}
      backdrop={backdrop}
    >
      <ReactBootstrapModal.Header closeButton={closeButton}>
        {hasHeader && (
          <header className={classnames(styles.header, 'text-center flex-grow-1 pb-2 pb-md-3')}>
            {title && <h3>{title}</h3>}
            {subTitle && <p className="display-5 mt-2 mt-md-3">{subTitle}</p>}
          </header>
        )}
      </ReactBootstrapModal.Header>
      <ReactBootstrapModal.Body>{children}</ReactBootstrapModal.Body>
      {footer && (
        <ReactBootstrapModal.Footer>
          <footer className="d-flex justify-content-center w-100 m-0 pt-md-4 pt-2">{footer}</footer>
        </ReactBootstrapModal.Footer>
      )}
    </ReactBootstrapModal>
  );
};

export default Modal;
