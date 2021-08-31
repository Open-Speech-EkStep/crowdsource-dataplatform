import Logo from 'components/Logo/Logo';
import Navigation from 'components/Navigation/Navigation';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header data-testid="Header" role="banner" className={styles.root}>
      <div className={styles.navigation}>
        <Navigation />
      </div>
      <div className={styles.logo}>
        <Logo />
        <span className={styles.sep} />
      </div>
    </header>
  );
};

export default Header;
