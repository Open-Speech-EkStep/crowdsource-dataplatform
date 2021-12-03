import Container from 'react-bootstrap/Container';

import Feedback from 'components/Feedback';

import styles from './Float.module.scss';

const Float = () => {
  return (
    <div id="float" className={`${styles.root} px-2 px-lg-0 position-fixed`}>
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
