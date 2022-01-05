import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

let portalRoot: HTMLElement | null;

/* istanbul ignore next */
if (typeof window !== 'undefined') {
  portalRoot = document.getElementById('portal');

  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal');
    document.body.appendChild(portalRoot);
  }
}

const Portal = ({ children }: PortalProps) => {
  let el: Element | undefined;

  /* istanbul ignore next */
  if (typeof window !== 'undefined') {
    el = document.createElement('div');
  }

  useEffect(() => {
    portalRoot?.appendChild(el!!);

    return () => {
      portalRoot?.removeChild(el!!);
    };
  }, [el]);

  return createPortal(children, el!!);
};

export default Portal;
