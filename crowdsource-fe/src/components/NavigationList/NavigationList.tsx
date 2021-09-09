import type { AriaAttributes } from 'react';
import { useCallback } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Nav from 'react-bootstrap/Nav';

import Link from 'components/Link';
import routePaths from 'constants/routePaths';

import styles from './NavigationList.module.scss';

const useNavLink = () => {
  const { asPath: currentRoutePath } = useRouter();
  const getNavLinkProps = useCallback(
    routePath => ({
      className: classnames(styles.link, { active: currentRoutePath === routePath }),
      'aria-current': currentRoutePath === routePath ? 'page' : (undefined as AriaAttributes['aria-current']),
    }),
    [currentRoutePath]
  );
  return {
    getNavLinkProps,
  };
};

const NavigationList = () => {
  const { getNavLinkProps } = useNavLink();
  const { t } = useTranslation();

  return (
    <Nav className={styles.root}>
      <Link href={routePaths.sunoIndiaHome} prefetch={false} passHref>
        <Nav.Link {...getNavLinkProps(routePaths.sunoIndiaHome)}>
          {t('suno')} {t('india')}
        </Nav.Link>
      </Link>
      <Link href={routePaths.boloIndiaHome} prefetch={false} passHref>
        <Nav.Link {...getNavLinkProps(routePaths.boloIndiaHome)}>
          {t('bolo')} {t('india')}
        </Nav.Link>
      </Link>
      <Link href={routePaths.likhoIndiaHome} prefetch={false} passHref>
        <Nav.Link {...getNavLinkProps(routePaths.likhoIndiaHome)}>
          {t('likho')} {t('india')}
        </Nav.Link>
      </Link>
      <Link href={routePaths.dekhoIndiaHome} prefetch={false} passHref>
        <Nav.Link {...getNavLinkProps(routePaths.dekhoIndiaHome)}>
          {t('dekho')} {t('india')}
        </Nav.Link>
      </Link>
    </Nav>
  );
};

export default NavigationList;
