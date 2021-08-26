import { AriaAttributes, useCallback } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import LanguageSwitcher from 'components/LanguageSwitcher';
import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './Header.module.scss';

const useNavLink = () => {
  const { asPath: currentRoutePath } = useRouter();
  const getNavLinkProps = useCallback(
    routePath => ({
      className: classnames('nav-link', { active: currentRoutePath === routePath }),
      'aria-current': currentRoutePath === routePath ? 'page' : (undefined as AriaAttributes['aria-current']),
    }),
    [currentRoutePath]
  );

  return {
    getNavLinkProps,
  };
};

const Header = () => {
  const { getNavLinkProps } = useNavLink();
  const { t } = useTranslation();

  return (
    <header data-testid="Header" role="banner" className={classnames('position-sticky', styles.root)}>
      <nav className="navbar navbar-expand-lg navbar-light container-fluid flex-wrap flex-md-nowrap">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link href={routePaths.home}>
              <a {...getNavLinkProps(routePaths.home)}>{t('home')}</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={routePaths.sunoIndiaHome}>
              <a {...getNavLinkProps(routePaths.sunoIndiaHome)}>
                {t('suno')} {t('india')}
              </a>
            </Link>
          </li>
        </ul>
        <LanguageSwitcher />
      </nav>
    </header>
  );
};

export default Header;
