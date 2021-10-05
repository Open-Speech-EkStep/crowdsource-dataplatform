import Image from 'next/image';

import Button from 'components/Button';

import styles from './ButtonControls.module.scss';

const ButtonControls = () => {
  return (
    <div data-testid="ButtonControls">
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
    </div>
  );
};

export default ButtonControls;
