import Container from 'react-bootstrap/Container';

import Feedback from 'components/Feedback';

import styles from './Float.module.scss';

const Float = () => {
  return (
    <div className={`${styles.root} px-2 px-lg-0 position-fixed w-100`}>
      <Container fluid="lg">
        <div className={styles.float}>
          <Feedback />
          <div id="portal"></div>
        </div>
      </Container>
    </div>
  );
};

export default Float;
