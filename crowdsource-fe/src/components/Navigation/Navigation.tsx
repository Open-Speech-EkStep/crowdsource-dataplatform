import { Navbar } from 'react-bootstrap';

import styles from 'components/Navigation/Navigation.module.scss';
import NavigationList from 'components/NavigationList/NavigationList';

const Navigation = () => {
  return (
    <Navbar data-testid="Navigation" expand="lg" className={styles.bar}>
      <Navbar.Toggle className={styles.toggle}>
        <span className={styles.toggleBar} />
        <span className={styles.toggleBar} />
        <span className={styles.toggleBar} />
      </Navbar.Toggle>
      <Navbar.Collapse className={styles.collapse}>
        <NavigationList />
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
