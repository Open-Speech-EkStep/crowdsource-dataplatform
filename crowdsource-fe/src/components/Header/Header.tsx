import LanguageSwitcher from 'components/LanguageSwitcher';
import Logo from 'components/Logo';
import Navigation from 'components/Navigation';
import UserOptions from 'components/UserOptions';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header
      data-testid="Header"
      role="banner"
      className={`${styles.root} d-flex bg-light text-primary p-0 position-sticky w-100`}
    >
      <div className="d-flex order-1 order-lg-2">
        <Navigation />
      </div>
      <div className="d-flex order-2 order-lg-1">
        <Logo />
        <span
          className={`${styles.sep} d-none d-lg-flex border border-1 border-primary align-self-center mx-3`}
        />
      </div>
      <div className="d-flex order-3 ms-auto">
        <LanguageSwitcher />
        <UserOptions />
      </div>
    </header>
  );
};

export default Header;
