import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

let portalRoot: HTMLElement | null;

const Portal = ({ children }: PortalProps) => {
  let el: Element | undefined;

  /* istanbul ignore next */
  if (typeof window !== 'undefined') {
    portalRoot = document.getElementById('portal');
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
