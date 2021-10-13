import { useState } from 'react';

import Button from 'components/Button';
import Modal from 'components/Modal';

const ChromeExtension = () => {
  const [show, setShow] = useState(false);

  const onShowVideoModal = () => {
    setShow(true);
  };

  const onHideModal = () => {
    setShow(false);
  };

  return (
    <div>
      <Button variant="primary" onClick={onShowVideoModal}>
        Watch Video
      </Button>
      <Button variant="primary">Install Now</Button>
      <Modal show={show} onHide={onHideModal}>
        <video width="100%" height="360px" controls>
          <source src="/audio/phonetic_keyboard_instruction_video.mp4" type="video/mp4"></source>
          <track
            src="/audio/phonetic_keyboard_instruction_video.mp4"
            kind="captions"
            label="english_captions"
          ></track>
        </video>
      </Modal>
    </div>
  );
};

export default ChromeExtension;
