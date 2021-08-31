import { AriaAttributes, useCallback } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Nav } from 'react-bootstrap';

import Link from 'components/Link';
import styles from 'components/NavigationList/NavigationList.module.scss';
import routePaths from 'constants/routePaths';

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
    <Nav>
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
