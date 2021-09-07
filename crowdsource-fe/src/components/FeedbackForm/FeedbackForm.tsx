import { useTranslation } from 'next-i18next';
import Form from 'react-bootstrap/Form';

import styles from './FeedbackForm.module.scss';

const FeedbackForm = () => {
  const { t } = useTranslation();
  const opinions = [1, 2, 3, 4, 5];

  return (
    <Form className={`${styles.root} py-2`}>
      <Form.Group className="py-3" controlId="opinionRating">
        <Form.Label className="mb-3">
          {t('opinionQuestionText')} <span className={styles.red}>({t('required')})</span>
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
          {t('feedbackCategoryQuestionText')} <span className={styles.grey}>({t('optional')})</span>
        </Form.Label>
        <Form.Select aria-label="Default select example" className={styles.select}>
          <option>{t('selectCategory')}</option>
          <option value="1">{t('suggestion')}</option>
          <option value="2">{t('error')}</option>
          <option value="3">{t('complaint')}</option>
          <option value="4">{t('compliment')}</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="py-3" controlId="feedback">
        <Form.Label className="mb-1">
          {t('feedbackShareText')} <span className={styles.grey}>({t('optional')})</span>
        </Form.Label>
        <Form.Control as="textarea" rows={3} placeholder={t('typeHere')} />
      </Form.Group>

      <Form.Group className="py-3" controlId="recommended">
        <Form.Label className="mb-1">
          {t('recommendQuestionText')} <span className={styles.grey}>({t('optional')})</span>
        </Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id="recommend1"
            label={t('yes')}
            name="recommend"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="recommend2"
            label={t('no')}
            name="recommend"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="recommend3"
            label={t('mayBe')}
            name="recommend"
            className={`${styles.radio} me-8 mb-0`}
          />
        </div>
      </Form.Group>

      <Form.Group className="py-3" controlId="revisit">
        <Form.Label className="mb-1">
          {t('revisitQuestionText')} <span className={styles.grey}>({t('optional')})</span>
        </Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id="revisit1"
            label={t('yes')}
            name="revisit"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="revisit2"
            label={t('no')}
            name="revisit"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="revisit3"
            label={t('mayBe')}
            name="revisit"
            className={`${styles.radio} me-8 mb-0`}
          />
        </div>
      </Form.Group>
    </Form>
  );
};

export default FeedbackForm;
