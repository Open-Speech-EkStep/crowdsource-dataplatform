import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';

import { DISPLAY_LANGUAGES } from 'constants/localesConstants';

import styles from './ChangeUserForm.module.scss';

const ChangeUserForm = () => {
  const { locales } = useRouter();
  const { t } = useTranslation();

  return (
    <Form className={`${styles.root} py-2`}>
      <Form.Group className="py-3" controlId="name">
        <Form.Label>{t('name')}</Form.Label>
        <Form.Control type="text" placeholder={t('enterUsername')} />
        <Form.Text className="d-block text-muted mt-1">
          {t('userNameHint')}
        </Form.Text>
      </Form.Group>

      <Form.Group className="py-3" controlId="motherTongue">
        <Form.Label className="mb-1">
          {t('motherTongue')}
        </Form.Label>
        <Form.Select aria-label="Default select example" className={styles.select}>
          <option>{t('selectMotherTongue')}</option>
          {locales?.map(locale => (
            <option key={locale} value={locale}>{t(DISPLAY_LANGUAGES[locale])}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="py-3" controlId="motherTongue">
        <Form.Label className="mb-1">
          {t('ageGroup')}
        </Form.Label>
        <Form.Select aria-label="Default select example" className={styles.select}>
          <option>{t('selectAgeGroup')}</option>
          <option value="upto 10">{t('kidAgeGroup')}</option>
          <option value="10 - 30">{t('youthAgeGroup')}</option>
          <option value="30 - 60">{t('adultAgeGroup')}</option>
          <option value="60+">{t('seniorAgeGroup')}</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="py-3" controlId="gender">
        <Form.Label className="mb-1">
          {t('gender')}
        </Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id="male"
            label={t('male')}
            name="gender"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="female"
            label={t('female')}
            name="gender"
            className={`${styles.radio} me-8 mb-0`}
          />
          <Form.Check
            inline
            type="radio"
            id="others"
            label={t('others')}
            name="gender"
            className={`${styles.radio} me-8 mb-0`}
          />
        </div>
      </Form.Group>
      <p className="py-3 mb-0">By proceeding ahead you agree to the Terms and Conditions</p>
    </Form>
  );
};

export default ChangeUserForm;
