import { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Button from 'react-bootstrap/Button';

import styles from './Feedback.module.scss';

const FeedbackModal = dynamic(() => import('components/FeedbackModal'), { ssr: false });

const Feedback = () => {
  const { t } = useTranslation();
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
        <Image src="/images/feedback-icon.svg" width="32" height="32" alt={t('feedbackIconAlt')} />
      </Button>
      <FeedbackModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default Feedback;
