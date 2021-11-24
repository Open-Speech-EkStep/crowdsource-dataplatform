import React, { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';

import Button from 'components/Button';
import ImageBasePath from 'components/ImageBasePath';
import Modal from 'components/Modal';
import apiPaths from 'constants/apiPaths';
import { DEFAULT_LOCALE, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import pageRouteConstants, { pageInitiativeRouteConstants } from 'constants/pageRouteConstants';
import { useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './FeedbackModal.module.scss';

const opinions = [1, 2, 3, 4, 5];

interface FeedbackModalProps {
  onHide: () => void;
  onSuccess: () => void;
  onError: (error: any) => any;
  show: Boolean;
}

const FeedbackModal = ({ onSuccess: showThankyou, onError, ...props }: FeedbackModalProps) => {
  const { t } = useTranslation();

  const showThankyouRef = useRef(showThankyou);

  const [formData, setFormData] = useState({
    opinion_rating: undefined,
    category: '',
    feedback: '',
    recommended: '',
    revisit: '',
  });

  const { isLoading, data, submit, error } = useSubmit(apiPaths.feedback);

  const route = useRouter();

  const [speakerDetails] = useLocalStorage<{ userName: string }>(localStorageConstants.speakerDetails);
  const [contributionLanguage] = useLocalStorage<string>(
    localStorageConstants.contributionLanguage,
    RAW_LANGUAGES[DEFAULT_LOCALE]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    submit(
      JSON.stringify({
        ...formData,
        email: speakerDetails?.userName || 'Anonymous',
        language: contributionLanguage,
        module: pageInitiativeRouteConstants[route.asPath] || '',
        target_page: pageRouteConstants[route.asPath] || '',
      })
    );
  };

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

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
    <Modal
      {...props}
      title={t('feedbackModalHeading')}
      subTitle={t('feedbackModalSubHeading')}
      footer={
        <Button disabled={!isButtonEnabled} form="feedbackForm" type="submit">
          {t('submit')}
        </Button>
      }
    >
      <div className={styles.form}>
        <Form id="feedbackForm" onSubmit={handleSubmit} className={`${styles.root} py-2`}>
          <Form.Group className="py-3" controlId="opinionRating">
            <Form.Label className="mb-3">
              {t('opinionQuestionText')} <span className="text-danger fst-italic">({t('required')})</span>
            </Form.Label>
            <div className={styles.opinions}>
              {opinions.map(opinion => (
                <div key={opinion} className="me-5">
                  <label
                    htmlFor={`opinion${opinion}`}
                    className={`${styles.opinion} ${
                      Number(formData.opinion_rating) === opinion
                        ? styles[`opinion${opinion}-active`]
                        : styles[`opinion${opinion}`]
                    } rounded-circle`}
                  >
                    <ImageBasePath
                      src={`/images/opinion${opinion}${
                        Number(formData.opinion_rating) === opinion ? '-active' : ''
                      }.svg`}
                      width="44"
                      height="44"
                      alt="icon"
                    />
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
              {t('feedbackCategoryQuestionText')}{' '}
              <span className="text-primary-40 fst-italic">({t('optional')})</span>
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              className={styles.select}
              name="category"
              onChange={handleChange as any}
            >
              <option value="">{t('selectCategory')}</option>
              <option value="suggestion">{t('suggestion')}</option>
              <option value="error">{t('error')}</option>
              <option value="complaint">{t('complaint')}</option>
              <option value="compliment">{t('compliment')}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="py-3" controlId="feedback">
            <Form.Label className="mb-1">
              {t('feedbackShareText')} <span className="text-primary-40">({t('optional')})</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={1000}
              placeholder={t('typeHere')}
              name="feedback"
              onChange={handleChange}
            />
            <span className="text-primary-40 d-flex justify-content-end mt-1">
              ({t('thousandCharLimitText')})
            </span>
          </Form.Group>

          <Form.Group className="py-3" controlId="recommended">
            <Form.Label className="mb-1 w-100">
              {t('recommendQuestionText')} <span className="text-primary-40">({t('optional')})</span>
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
              name="recommended"
              id="feedbackFormNoCheckbox"
              className={`${styles.radio} me-8 mb-0`}
              onChange={handleChange}
            />
            <Form.Check
              inline
              type="radio"
              label={t('mayBe')}
              value="Maybe"
              name="recommended"
              id="feedbackFormMaybeCheckbox"
              className={`${styles.radio} me-8 mb-0`}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="py-3" controlId="revisit">
            <Form.Label className="mb-1 w-100">
              {t('revisitQuestionText')} <span className="text-primary-40">({t('optional')})</span>
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
        </Form>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
