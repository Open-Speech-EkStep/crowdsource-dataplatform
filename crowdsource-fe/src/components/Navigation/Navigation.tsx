import Navbar from 'react-bootstrap/Navbar';

import NavigationList from 'components/NavigationList';

import styles from './Navigation.module.scss';

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
