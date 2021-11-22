import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';

import { Trans, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';

import Button from 'components/Button';
import Modal from 'components/Modal';
import { DEFAULT_LOCALE, DISPLAY_LANGUAGES, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './ChangeUserModal.module.scss';
import TermsAndConditionsLink from './TermsAndConditionsLink';

const testUserName = (value: string) => {
  const numeralRegex = /^[0-9]+$/;
  const emailRegex = /^\S+@\S+[.][0-9a-z]+$/;

  return numeralRegex.test(value) || emailRegex.test(value);
};

interface ChangeUserModalProps {
  onHide: () => void;
  show: Boolean;
  doRedirection?: boolean;
  redirectionUrl?: string;
}

const ChangeUserModal = ({ onHide, doRedirection, redirectionUrl, ...rest }: ChangeUserModalProps) => {
  const { locales, locale: currentLocale = DEFAULT_LOCALE } = useRouter();
  const { t } = useTranslation();
  const [, setSpeakerDetails] = useLocalStorage(localStorageConstants.speakerDetails);
  const router = useRouter();
  const [isOtherGenderVisible, setOtherGenderVisibility] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    motherTongue: '',
    age: '',
    gender: '',
    otherGender: '',
  });

  const hideOtherGender = () => {
    setOtherGenderVisibility(false);
  };
  const showOtherGender = () => {
    setOtherGenderVisibility(true);
  };

  const isUserNameInValid = testUserName(formData.userName);
  const isFormInValid = isUserNameInValid;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleGenderChange = (e: ChangeEvent<HTMLInputElement>) => {
    hideOtherGender();
    setFormData({ ...formData, [e.target.name]: e.target.value, otherGender: '' });
  };
  const handleOtherGenderChange = () => {
    showOtherGender();
    setFormData({ ...formData, otherGender: 'Rather Not Say' });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormInValid) {
      setSpeakerDetails({
        ...formData,
        gender: formData.otherGender || formData.gender,
        otherGender: undefined,
        language: RAW_LANGUAGES[currentLocale],
        toLanguage: '',
      });

      onHide();
    }
    if (doRedirection) {
      router.push(redirectionUrl ?? '');
    }
  };

  const isButtonEnabled = !isFormInValid;

  return (
    <Modal
      data-testid="ChangeUserModal"
      {...rest}
      onHide={onHide}
      title={t('changeUserModalHeading')}
      subTitle={t('changeUserModalSubHeading')}
      footer={
        <Button disabled={!isButtonEnabled} type="submit" form="changeUserForm">
          {t('Done')}
        </Button>
      }
    >
      <div className="px-5 px-md-9">
        <Form
          data-testid="ChangeUserForm"
          id="changeUserForm"
          className={`${styles.root} py-2`}
          noValidate
          onSubmit={handleSubmit}
        >
          <Form.Group className="py-3" controlId="userName">
            <Form.Label>{t('name')}</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              placeholder={t('enterUsername')}
              maxLength={12}
              isInvalid={isUserNameInValid}
              value={formData.userName}
              onChange={handleChange}
            />
            {isUserNameInValid && (
              <Form.Control.Feedback type="invalid">{t('userNameError')}</Form.Control.Feedback>
            )}
            {!isUserNameInValid && (
              <Form.Text className="d-block text-muted mt-1">{t('userNameHint')}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="py-3" controlId="motherTongue">
            <Form.Label className="mb-1">{t('motherTongue')}</Form.Label>
            <Form.Select
              name="motherTongue"
              className={styles.select}
              value={formData.motherTongue}
              onChange={handleChange as any}
            >
              <option value="">{t('selectMotherTongue')}</option>
              {locales?.map(locale => (
                <option key={locale} value={RAW_LANGUAGES[locale]}>
                  {t(DISPLAY_LANGUAGES[locale])}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="py-3" controlId="age">
            <Form.Label className="mb-1">{t('ageGroup')}</Form.Label>
            <Form.Select
              name="age"
              className={styles.select}
              value={formData.age}
              onChange={handleChange as any}
            >
              <option value="">{t('selectAgeGroup')}</option>
              <option value="upto 10">{t('kidAgeGroup')}</option>
              <option value="10 - 30">{t('youthAgeGroup')}</option>
              <option value="30 - 60">{t('adultAgeGroup')}</option>
              <option value="60+">{t('seniorAgeGroup')}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="py-3" controlId="gender">
            <Form.Label className="mb-1">{t('gender')}</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                id="male"
                label={t('male')}
                name="gender"
                className="me-8 mb-0"
                onChange={handleGenderChange}
                value="male"
              />
              <Form.Check
                inline
                type="radio"
                id="female"
                label={t('female')}
                name="gender"
                className="me-8 mb-0"
                onChange={handleGenderChange}
                value="female"
              />
              <Form.Check
                inline
                type="radio"
                id="others"
                label={t('others')}
                className="me-8 mb-0"
                name="gender"
                onChange={handleOtherGenderChange}
                value=""
              />
            </div>
            {isOtherGenderVisible && (
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="transgenderMale"
                  label={t('transgenderMale')}
                  name="otherGender"
                  className="me-8 mb-0"
                  onChange={handleChange}
                  value="Transgender - He"
                />
                <Form.Check
                  inline
                  type="radio"
                  id="transgenderFemale"
                  label={t('transgenderFemale')}
                  name="otherGender"
                  className="me-8 mb-0"
                  onChange={handleChange}
                  value="Transgender - She"
                />
                <Form.Check
                  inline
                  type="radio"
                  id="ratherNotSayGender"
                  label={t('ratherNotSayGender')}
                  name="otherGender"
                  className="me-8 mb-0"
                  onChange={handleChange}
                  value="Rather Not Say"
                  defaultChecked
                />
              </div>
            )}
          </Form.Group>
          <p className="py-3 mb-0">
            <Trans
              i18nKey="termsConditionsText"
              defaults="termsConditionsText"
              components={{
                TermsAndConditionsLink: <TermsAndConditionsLink />,
              }}
            />
          </p>
        </Form>
      </div>
    </Modal>
  );
};

export default ChangeUserModal;
