import ProgressBar from 'react-bootstrap/ProgressBar';

import AudioController from 'components/AudioController';
import ButtonControls from 'components/ButtonControls';
import TextEditArea, { ErrorText } from 'components/TextEditArea';

import styles from './SunoTranscribe.module.scss';

const SunoTranscribe = () => {
  return (
    <div data-testid="SunoTranscribe" className={`${styles.root} position-relative`}>
      <AudioController />
      <div className="mt-4 mt-md-8">
        <TextEditArea />
        <ErrorText />
      </div>
      <ButtonControls />
      <div className="d-flex align-items-center mt-10 mt-md-14">
        <div className="flex-grow-1">
          <ProgressBar now={60} variant="primary" className={styles.progress} />
        </div>
        <span className="ms-5">1/5</span>
      </div>
    </div>
  );
};

export default SunoTranscribe;
