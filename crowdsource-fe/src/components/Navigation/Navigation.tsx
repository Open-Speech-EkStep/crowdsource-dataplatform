import { useCallback, useEffect, useRef, useState } from 'react';

import Navbar from 'react-bootstrap/Navbar';

import NavigationList from 'components/NavigationList';

import styles from './Navigation.module.scss';

const Navigation = () => {
  const navBarRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    function handleDocumentScroll() {
      if (isExpanded) {
        setIsExpanded(false);
      }
    }

    function handleDocumentClick(event: Event) {
      if (!navBarRef?.current?.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('scroll', handleDocumentScroll);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('scroll', handleDocumentClick);
    };
  }, [isExpanded]);

  const handleToggle = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div ref={navBarRef}>
      <Navbar
        data-testid="Navigation"
        expand="lg"
        className="d-flex align-items-stretch h-100 p-0"
        expanded={isExpanded}
        onToggle={handleToggle}
        collapseOnSelect
      >
        <Navbar.Toggle
          className={`${styles.toggle} align-items-center border-0 flex-column justify-content-center p-0`}
        >
          <span className={`${styles.toggleBar} bg-primary position-relative mt-1`} />
          <span className={`${styles.toggleBar} bg-primary position-relative mt-1`} />
          <span className={`${styles.toggleBar} bg-primary position-relative mt-1`} />
        </Navbar.Toggle>
        <Navbar.Collapse className={`${styles.collapse} align-items-stretch bg-light py-2 p-lg-0`}>
          <NavigationList />
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
