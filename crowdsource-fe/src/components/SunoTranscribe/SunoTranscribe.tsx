import Image from 'next/image';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';

import AudioController from 'components/AudioController';
import Button from 'components/Button';

import styles from './SunoTranscribe.module.scss';

const SunoTranscribe = () => {
  return (
    <div data-testid="SunoTranscribe" className={`${styles.root} position-relative`}>
      <AudioController />
      <div className="mt-4 mt-md-8">
        <div className={`${styles.addText} border border-2 border-primary bg-light p-4`}>
          <Form.Group controlId="textarea">
            <Form.Label className="display-6">Add Text (Hindi)</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Start typing here..."
              className={`${styles.textarea} border-0 p-0 display-3`}
            />
          </Form.Group>
        </div>
        <span className="d-block text-danger px-4 fst-italic mt-2 display-5">
          Some error text will appear here
        </span>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-md-center align-items-center py-2 py-md-6">
        <Button variant="secondary" className="mx-md-6 order-2 order-md-1 my-2 my-md-0">
          Cancel
        </Button>
        <Button
          variant="normal"
          className="position-relative d-flex flex-column align-items-center fw-bold mx-md-6 order-1 order-md-2 my-2 my-md-0"
        >
          <Image src="/images/play.svg" width="60" height="60" alt="Play Audio" />
          <span className={`${styles.mainControl} display-3 position-absolute d-none d-md-block`}>Play</span>
        </Button>
        <Button className="mx-md-6 order-3 order-md-3 my-2 my-md-0">Submit</Button>
      </div>
      <div className="d-flex justify-content-center mt-2 mt-md-11">
        <Button variant="tertiary">Skip</Button>
      </div>
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
