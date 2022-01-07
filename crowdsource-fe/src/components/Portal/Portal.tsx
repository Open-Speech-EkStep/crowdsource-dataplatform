import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  let portalRoot: HTMLElement | null = null;
  let el: Element | undefined;

  /* istanbul ignore next */
  if (typeof window !== 'undefined') {
    portalRoot = document.getElementById('portal');

    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.setAttribute('id', 'portal');
      document.body.appendChild(portalRoot);
    }

    el = document.createElement('div');
  }

  useEffect(() => {
    portalRoot?.appendChild(el!!);

    return () => {
      portalRoot?.removeChild(el!!);
    };
  }, [el, portalRoot]);

  return createPortal(children, el!!);
};

export default Portal;
