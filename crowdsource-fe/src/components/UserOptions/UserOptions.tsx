import { Fragment, useState } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Dropdown from 'react-bootstrap/Dropdown';

import Link from 'components/Link';
import localStorageConstants from 'constants/localStorageConstants';
import routePaths from 'constants/routePaths';
import useLocalStorage from 'hooks/useLocalStorage';
import type SpeakerDetails from 'types/SpeakerDetails';

import styles from './UserOptions.module.scss';

const ChangeUserModal = dynamic(() => import('components/ChangeUserModal'), { ssr: false });

const UserOptions = () => {
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [speakerDetails] = useLocalStorage<SpeakerDetails>(localStorageConstants.speakerDetails);

  if (!speakerDetails) {
    return null;
  }

  return (
    <Fragment>
      <Dropdown
        data-testid="UserOptions"
        id="userOptions"
        className={`${styles.root} position-relative`}
        align="end"
      >
        <Dropdown.Toggle
          id="languageSwitcherToggle"
          variant="light"
          className={classnames(styles.toggle, 'd-flex h-100 justify-content-center align-items-center')}
        >
          <Image src="/images/usericon.svg" width="24" height="24" alt={t('languageIconAlt')} />
          {speakerDetails.userName && (
            <span className="d-none d-xl-block mx-1">{speakerDetails.userName}</span>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {!speakerDetails.userName && (
            <Dropdown.Item className={classnames(styles.item, 'disabled')}>({t('noUsername')})</Dropdown.Item>
          )}
          <Dropdown.Item
            className={`${styles.item} text-primary display-5 py-2 px-4`}
            onClick={() => setModalShow(true)}
          >
            {t('changeUser')}
          </Dropdown.Item>
          <Link href={routePaths.myBadges} passHref>
            <Dropdown.Item className={`${styles.item} text-primary display-5 py-2 px-4`}>
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
