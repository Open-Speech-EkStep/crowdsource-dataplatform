import { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Dropdown from 'react-bootstrap/Dropdown';

import FeedbackModal from 'components/FeedbackModal';
import Link from 'components/Link';
import { DEFAULT_LOCALE } from 'constants/localesConstants';

import styles from './UserOptions.module.scss';
import routePaths from 'constants/routePaths';
import ChangeUserModal from 'components/ChangeUserModal';

const UserOptions = () => {
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);

  const showModalFn = () => {
    return () => setModalShow(true);
  };

  return (
    <Fragment>
      <Dropdown id="languageSwitcher" className={styles.root} align="end">
        <Dropdown.Toggle
          id="languageSwitcherToggle"
          variant="light"
          className={`${styles.toggle} d-flex h-100 justify-content-center align-items-center`}
        >
          <Image src="/images/usericon.svg" width="24" height="24" alt={t('languageIconAlt')} />
          <span className="d-none d-xl-block mx-1">test</span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item className={styles.item} onClick={showModalFn()}>
            {t('changeUser')}
          </Dropdown.Item>
          <Link href={routePaths.myBadges} passHref>
            <Dropdown.Item className={styles.item}>
              {t('myBadges')}
            </Dropdown.Item>
          </Link>
        </Dropdown.Menu>
      </Dropdown>
      <ChangeUserModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default UserOptions;
