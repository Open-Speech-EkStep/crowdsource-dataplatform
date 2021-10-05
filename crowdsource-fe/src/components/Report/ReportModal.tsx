import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';

import Button from 'components/Button';
import Modal from 'components/Modal';
import apiPaths from 'constants/apiPaths';
import { DEFAULT_LOCALE, RAW_LANGUAGES } from 'constants/localesConstants';
import localStorageConstants from 'constants/localStorageConstants';
import { pageSourceConstants } from 'constants/pageRouteConstants';
import { useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';

import styles from './Report.module.scss';

interface ReportModalProps {
  onHide: () => void;
  onSuccess: () => void;
  show: boolean;
}

const ReportModal = ({ onSuccess: showThankyou, ...props }: ReportModalProps) => {
  const { t } = useTranslation();

  const showThankyouRef = useRef(showThankyou);

  const [formData, setFormData] = useState({
    language: '',
    reportText: '',
    sentenceId: 1993205,
    source: '',
    userName: '',
  });

  const [reportText, setReportText] = useState('');

  const { isLoading, data, submit } = useSubmit(apiPaths.report);

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
        userName: speakerDetails?.userName || 'Anonymous',
        language: contributionLanguage,
        source: pageSourceConstants[route.asPath],
        reportText: reportText ? formData.reportText + ' - ' + reportText : formData.reportText,
      })
    );
  };

  useEffect(() => {
    showThankyouRef.current = showThankyou;
  }, [showThankyou]);

  useEffect(() => {
    if (data) {
      showThankyouRef.current();
    }
  }, [data]);

  const isButtonEnabled = !isLoading && formData.reportText && !data;

  return (
    <Modal
      {...props}
      title={t('reportModalHeading')}
      subTitle={t('reportModalSubHeading')}
      footer={
        <Button disabled={!isButtonEnabled} form="reportForm" type="submit">
          {t('submit')}
        </Button>
      }
    >
      <div className={styles.form}>
        <Form id="reportForm" onSubmit={handleSubmit} className={`py-2`}>
          <Form.Group className="py-3" controlId="reportText">
            <Form.Check
              inline
              type="radio"
              label={t('Offensive')}
              value="Offensive"
              name="reportText"
              id="reportFormOffensiveCheckbox"
              className={`${styles.radio} me-8 mb-0`}
              onChange={handleChange}
            />
            <Form.Label className="mb-1 w-100">{t('offensiveSubtext')}</Form.Label>
            <Form.Check
              inline
              type="radio"
              label={t('Others')}
              value="Others"
              name="reportText"
              id="reportFormOthersCheckbox"
              className={`${styles.radio} me-8 mb-0`}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="py-3" controlId="reportText">
            <Form.Control
              data-testid="report-textarea"
              as="textarea"
              rows={3}
              maxLength={1000}
              placeholder={t('specifyReason')}
              name="reportTextArea"
              onChange={e => setReportText(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>
    </Modal>
  );
};

export default ReportModal;
