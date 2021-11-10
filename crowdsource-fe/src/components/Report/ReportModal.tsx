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
import { reportFieldsConstant } from 'constants/reportConstants';
import { useSubmit } from 'hooks/useFetch';
import useLocalStorage from 'hooks/useLocalStorage';
import type { Initiative } from 'types/Initiatives';

import styles from './ReportModal.module.scss';

interface ReportModalProps {
  onHide: () => void;
  onSuccess: () => void;
  show: boolean;
  initiativeMediaType: string;
  initiative: Initiative;
}

const ReportModal = ({
  onSuccess: showThankyou,
  initiative,
  initiativeMediaType,
  ...props
}: ReportModalProps) => {
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
      subTitle={t('reportModalSubHeading', { type: `${initiativeMediaType}` })}
      footer={
        <Button disabled={!isButtonEnabled} form="reportForm" type="submit">
          {t('submit')}
        </Button>
      }
    >
      <div className={styles.form}>
        <Form id="reportForm" onSubmit={handleSubmit} className={`py-2`}>
          {reportFieldsConstant[`${initiative}${pageSourceConstants[route.asPath]}`]?.map((item: any) => (
            <Form.Group key={item.value} className="py-3" controlId="reportText">
              <Form.Check
                inline
                type="radio"
                label={t(item.label)}
                value={item.value}
                name="reportText"
                id={`reportFormCheckbox${item.value}`}
                className={`${styles.radio} mb-0 me-0`}
                onChange={handleChange}
              />
              {item.isSubtext && <span className="d-flex mt-1 mb-0 ms-6">{t(item.subtext)}</span>}
            </Form.Group>
          ))}

          <Form.Group className="py-3" controlId="reportText">
            <Form.Control
              data-testid="report-textarea"
              as="textarea"
              rows={3}
              maxLength={1000}
              placeholder={t('specifyReason')}
              name="reportTextArea"
              onChange={e => setReportText(e.target.value)}
              className={`${styles.reasonText} p-3 rounded-8`}
              disabled={formData.reportText === ''}
            />
            <span className="d-flex justify-content-end mt-1 text-primary-40 display-6">
              ({t('thousandCharLimitText')})
            </span>
          </Form.Group>
        </Form>
      </div>
    </Modal>
  );
};

export default ReportModal;
