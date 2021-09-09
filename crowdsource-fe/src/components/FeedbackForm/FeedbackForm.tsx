import React, { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';
import Form from 'react-bootstrap/Form';

import apiPaths from 'constants/apiPaths';
import { useSubmit } from 'hooks/useFetch';

import styles from './FeedbackForm.module.scss';

const opinions = [1, 2, 3, 4, 5];

const FeedbackForm = ({ onSuccess: showThankyou }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const showThankyouRef = useRef(showThankyou);

  const { isLoading, data, submit } = useSubmit(apiPaths.feedback);

  const [formData, setFormData] = useState({
    opinion_rating: undefined,
    category: '',
    feedback: '',
    recommended: '',
    revisit: '',
    email: 'Anonymous',
    language: 'English',
    module: 'm1',
    target_page: 'p1',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    submit(JSON.stringify(formData));
  };

  useEffect(() => {
    showThankyouRef.current = showThankyou;
  }, [showThankyou]);

  useEffect(() => {
    if (data) {
      showThankyouRef.current();
    }
  }, [data]);

  const isButtonEnabled = !isLoading && formData.opinion_rating && !data;

  return (
    <Form onSubmit={handleSubmit} className={`${styles.root} py-2`}>
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
                  name="opinion_rating"
                  value={opinion}
                  id={`opinion${opinion}`}
                  className={`${styles.opinionInput} position-absolute opacity-0`}
                  onChange={handleChange}
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
        <Form.Select
          aria-label="Default select example"
          className={styles.select}
          name="category"
          onChange={handleChange as any}
        >
          <option value="">{t('selectCategory')}</option>
          <option value="Suggestion">{t('suggestion')}</option>
          <option value="Error">{t('error')}</option>
          <option value="Complaint">{t('complaint')}</option>
          <option value="Compliment">{t('compliment')}</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="py-3" controlId="feedback">
        <Form.Label className="mb-1">
          {t('feedbackShareText')} <span className={styles.grey}>({t('optional')})</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder={t('typeHere')}
          name="feedback"
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="py-3" controlId="recommended">
        <Form.Label className="mb-1">
          {t('recommendQuestionText')} <span className={styles.grey}>({t('optional')})</span>
        </Form.Label>
        <Form.Check
          inline
          type="radio"
          label={t('yes')}
          value="Yes"
          name="recommended"
          id="feedbackFormYesCheckbox"
          className={`${styles.radio} me-8 mb-0`}
          onChange={handleChange}
        />
        <Form.Check
          inline
          type="radio"
          label={t('no')}
          value="No"
          name="recommend"
          id="feedbackFormNoCheckbox"
          className={`${styles.radio} me-8 mb-0`}
          onChange={handleChange}
        />
        <Form.Check
          inline
          type="radio"
          label={t('mayBe')}
          value="Maybe"
          name="recommend"
          id="feedbackFormMaybeCheckbox"
          className={`${styles.radio} me-8 mb-0`}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="py-3" controlId="revisit">
        <Form.Label className="mb-1">
          {t('revisitQuestionText')} <span className={styles.grey}>({t('optional')})</span>
        </Form.Label>
        <Form.Check
          inline
          type="radio"
          id="revisit1"
          label={t('yes')}
          value="Yes"
          name="revisit"
          className={`${styles.radio} me-8 mb-0`}
          onChange={handleChange}
        />
        <Form.Check
          inline
          type="radio"
          id="revisit2"
          label={t('no')}
          value="No"
          name="revisit"
          className={`${styles.radio} me-8 mb-0`}
          onChange={handleChange}
        />
        <Form.Check
          inline
          type="radio"
          id="revisit3"
          label={t('mayBe')}
          value="Maybe"
          name="revisit"
          className={`${styles.radio} me-8 mb-0`}
          onChange={handleChange}
        />
      </Form.Group>
      <button type="submit" disabled={!isButtonEnabled} className={styles.submitButton}>
        {t('submit')}
      </button>
    </Form>
  );
};

export default FeedbackForm;
