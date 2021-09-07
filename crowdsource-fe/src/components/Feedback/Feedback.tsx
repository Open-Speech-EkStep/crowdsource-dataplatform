import { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Button from 'react-bootstrap/Button';

import FeedbackModal from 'components/FeedbackModal';

import styles from './Feedback.module.scss';

const Feedback = () => {
  const {t} = useTranslation();
  const [modalShow, setModalShow] = useState(false);

  const showModalFn = () => {
    return () => setModalShow(true);
  };

  return (
    <Fragment>
      <Button
        onClick={showModalFn()}
        className={`${styles.root} d-inline-flex justify-content-center align-items-center`}
      >
        <Image
          src="/images/feedback-icon.svg"
          width="32"
          height="32"
          alt={t('feedbackIcon')}
        />
      </Button>
      <FeedbackModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default Feedback;
