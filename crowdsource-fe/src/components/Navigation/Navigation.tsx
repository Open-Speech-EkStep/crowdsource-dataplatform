import { useCallback, useEffect, useRef, useState } from 'react';

import Navbar from 'react-bootstrap/Navbar';

import NavigationList from 'components/NavigationList';

import styles from './Navigation.module.scss';

const Navigation = () => {
  const navBarRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    function handleDocumentClick(event: Event) {
      if (!navBarRef?.current?.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleToggle = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div ref={navBarRef}>
      <Navbar
        data-testid="Navigation"
        expand="lg"
        className={styles.bar}
        expanded={isExpanded}
        onToggle={handleToggle}
      >
        <Navbar.Toggle className={styles.toggle}>
          <span className={styles.toggleBar} />
          <span className={styles.toggleBar} />
          <span className={styles.toggleBar} />
        </Navbar.Toggle>
        <Navbar.Collapse className={styles.collapse}>
          <NavigationList />
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
