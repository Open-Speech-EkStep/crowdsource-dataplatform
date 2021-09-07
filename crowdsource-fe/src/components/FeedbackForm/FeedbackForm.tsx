import Form from 'react-bootstrap/Form';

import styles from './FeedbackForm.module.scss';

const FeedbackForm = () => {
  const opinions = [1, 2, 3, 4, 5];

  return (
    <Form className={`${styles.root} py-2`}>
      <Form.Group className="py-3" controlId="opinionRating">
        <Form.Label className="mb-3">
          What is your opinion of this page <span className={styles.red}>(*required)</span>
        </Form.Label>
        <div className={styles.opinions}>
          {opinions.map(opinion => (
            <div key={opinion} className="me-5">
              <label
                htmlFor={`opinion${opinion}`}
                className={`${styles.opinion} ${styles[`opinion${opinion}`]}`}
              >
                <span className={`${styles.opinionLabel} position-absolute opacity-0`}>{opinion}</span>
                <input
                  type="radio"
                  name="opinion"
                  value={opinion}
                  id={`opinion${opinion}`}
                  className={`${styles.opinionInput} position-absolute opacity-0`}
                />
              </label>
            </div>
          ))}
        </div>
      </Form.Group>

      <Form.Group className="py-3" controlId="category">
        <Form.Label className="mb-1">
          Please select your feedback category <span className={styles.grey}>(optional)</span>
        </Form.Label>
        <Form.Select aria-label="Default select example" className={styles.select}>
          <option>Select a category</option>
          <option value="1">Suggestion</option>
          <option value="2">Error</option>
          <option value="3">Complaint</option>
          <option value="4">Compliment</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="py-3" controlId="feedback">
        <Form.Label className="mb-1">
          Share your feedback below: <span className={styles.grey}>(optional)</span>
        </Form.Label>
        <Form.Control as="textarea" rows={3} placeholder="Type here..." />
      </Form.Group>

      <Form.Group className="py-3" controlId="recommended">
        <Form.Label className="mb-1">
          Would you recommend Bhasha Daan to your friends & family?{' '}
          <span className={styles.grey}>(optional)</span>
        </Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id="recommend1"
            label="Yes"
            name="recommend"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="recommend2"
            label="No"
            name="recommend"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="recommend3"
            label="Maybe"
            name="recommend"
            className={`${styles.radio} me-8 mb-0`}
          />
        </div>
      </Form.Group>

      <Form.Group className="py-3" controlId="revisit">
        <Form.Label className="mb-1">
          Would you revisit Bhasha Daan? <span className={styles.grey}>(optional)</span>
        </Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id="revisit1"
            label="Yes"
            name="revisit"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="revisit2"
            label="No"
            name="revisit"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="revisit3"
            label="Maybe"
            name="revisit"
            className={`${styles.radio} me-8 mb-0`}
          />
        </div>
      </Form.Group>
    </Form>
  );
};

export default FeedbackForm;
