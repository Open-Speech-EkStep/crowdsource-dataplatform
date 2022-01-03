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
    routePath => {
      if (currentRoutePath === routePath || currentRoutePath.includes(routePath)) {
        return {
          className: classnames(
            `${styles.link} ${styles.activeLink} font-family-rowdies d-flex align-items-center display-5 p-4 px-xl-5 py-xl-0`
          ),
          'aria-current':
            currentRoutePath === routePath ? 'page' : (undefined as AriaAttributes['aria-current']),
        };
      } else {
        return {
          className: classnames(
            `${styles.link} font-family-rowdies d-flex align-items-center display-5 p-4 px-xl-5 py-xl-0`
          ),
          'aria-current':
            currentRoutePath === routePath ? 'page' : (undefined as AriaAttributes['aria-current']),
        };
      }
    },
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
    <Nav data-testid="NavigationList" className={styles.root}>
      <Link href={routePaths.ttsInitiativeHome} passHref>
        <Nav.Link {...getNavLinkProps(routePaths.ttsInitiativeHome)}>
          {t('tts')} {t('initiativeTextSuffix')}
        </Nav.Link>
      </Link>
      <Link href={routePaths.asrInitiativeHome} passHref>
        <Nav.Link {...getNavLinkProps(routePaths.asrInitiativeHome)}>
          {t('asr')} {t('initiativeTextSuffix')}
        </Nav.Link>
      </Link>
      <Link href={routePaths.translationInitiativeHome} passHref>
        <Nav.Link {...getNavLinkProps(routePaths.translationInitiativeHome)}>
          {t('translation')} {t('initiativeTextSuffix')}
        </Nav.Link>
      </Link>
      <Link href={routePaths.ocrInitiativeHome} passHref>
        <Nav.Link {...getNavLinkProps(routePaths.ocrInitiativeHome)}>
          {t('ocr')} {t('initiativeTextSuffix')}
        </Nav.Link>
      </Link>
    </Nav>
  );
};

export default NavigationList;
