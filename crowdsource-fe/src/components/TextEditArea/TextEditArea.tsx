import Form from 'react-bootstrap/Form';

import styles from './TextEditArea.module.scss';

const TextEditArea = () => {
  return (
    <div
      data-testid="TextEditArea"
      className={`${styles.addText} border border-2 border-primary bg-light p-4`}
    >
      <Form.Group controlId="textarea">
        <Form.Label className="display-6">Add Text (Hindi)</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Start typing here..."
          className={`${styles.textarea} border-0 p-0 display-3`}
        />
      </Form.Group>
    </div>
  );
};

export default TextEditArea;
