import { useCallback } from 'react';

import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import LanguageSwitcher from 'components/LanguageSwitcher';
import routePaths from 'constants/routePaths';
import useTranslate from 'hooks/useTranslate';

import styles from './Header.module.css';

const useNavLink = () => {
  const { asPath: currentRoutePath, locale: currentLocale } = useRouter();
  const getNavLinkProps = useCallback(
    routePath => ({
      className: classnames('nav-link', { active: currentRoutePath === routePath }),
      'aria-current': currentRoutePath === routePath ? 'page' : undefined,
    }),
    [currentRoutePath]
  );

  return {
    getNavLinkProps,
    currentLocale,
  };
};

function Header() {
  const { getNavLinkProps, currentLocale } = useNavLink();
  const { translate } = useTranslate();

  return (
    <header role="banner" className={classnames('position-sticky', styles.root)}>
      <nav className="navbar navbar-expand-lg navbar-light container-fluid flex-wrap flex-md-nowrap">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link href={routePaths.home} locale={currentLocale}>
              <a {...getNavLinkProps(routePaths.home)}>{translate('home')}</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={routePaths.sunoIndia} locale={currentLocale}>
              <a {...getNavLinkProps(routePaths.sunoIndia)}>
                {translate('suno')} {translate('india')}
              </a>
            </Link>
          </li>
        </ul>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}

export default Header;
