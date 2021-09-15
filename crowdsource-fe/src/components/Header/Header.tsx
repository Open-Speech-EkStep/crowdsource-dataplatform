import LanguageSwitcher from 'components/LanguageSwitcher';
import Logo from 'components/Logo';
import Navigation from 'components/Navigation';
import UserOptions from 'components/UserOptions';

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
      <div className="d-flex order-3 ms-auto">
        <LanguageSwitcher />
        <UserOptions />
      </div>
    </header>
  );
};

export default Header;
