import React, { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import IconTextButton from 'components/IconTextButton';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

import ReportSuccessModal from './ReportSuccessModal';

const ReportModal = dynamic(() => import('./ReportModal'), { ssr: false });

interface ReportProps {
  onSuccess: () => void;
  initiativeMediaType: string;
}

const Report = ({ onSuccess, initiativeMediaType }: ReportProps) => {
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const showModal = () => setModalShow(true);
  const hideModal = () => setModalShow(false);

  const showReportSuccess = () => {
    hideModal();
    setReportSuccess(true);
    onSuccess();
  };

  const hideReportSuccess = () => {
    setReportSuccess(false);
  };

  return (
    <Fragment>
      <IconTextButton
        icon="report.svg"
        textDesktop={t('report')}
        onClick={showModal}
        altText="reportIconAlt"
      />
      {modalShow && (
        <ReportModal
          initiativeMediaType={initiativeMediaType}
          show={modalShow}
          onHide={hideModal}
          onSuccess={showReportSuccess}
        />
      )}
      {reportSuccess && (
        <ReportSuccessModal
          show={reportSuccess}
          onHide={hideReportSuccess}
          initiative={INITIATIVES_MAPPING.suno}
        />
      )}
    </Fragment>
  );
};

export default Report;
