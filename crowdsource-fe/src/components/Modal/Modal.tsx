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
  show?: Boolean;
  onHide?: () => void;
}

const Modal = ({
  children,
  size = 'lg',
  title = '',
  subTitle = '',
  footer = null,
  show = false,
  onHide = noop,
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
    >
      <ReactBootstrapModal.Header closeButton>
        {hasHeader && (
          <header className={classnames(styles.header, 'text-center flex-grow-1')}>
            {title && <h1 className={styles.heading}>{title}</h1>}
            {subTitle && <p className={classnames(styles.subHeading, 'mt-2 mt-md-3')}>{subTitle}</p>}
          </header>
        )}
      </ReactBootstrapModal.Header>
      <ReactBootstrapModal.Body>{children}</ReactBootstrapModal.Body>
      {footer && (
        <ReactBootstrapModal.Footer>
          <footer className="d-flex justify-content-center w-100 m-0 pt-4 pt-2">{footer}</footer>
        </ReactBootstrapModal.Footer>
      )}
    </ReactBootstrapModal>
  );
};

export default Modal;
