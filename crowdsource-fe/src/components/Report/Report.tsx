import React, { Fragment, useState } from 'react';

import dynamic from 'next/dynamic';

import IconTextButton from 'components/IconTextButton';

import ReportSuccessModal from './ReportSuccessModal';

const ReportModal = dynamic(() => import('./ReportModal'), { ssr: false });

const Report = () => {
  const [modalShow, setModalShow] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const showModal = () => setModalShow(true);
  const hideModal = () => setModalShow(false);

  const showReportSuccess = () => {
    hideModal();
    setReportSuccess(true);
  };

  const hideReportSuccess = () => {
    setReportSuccess(false);
  };

  return (
    <Fragment>
      <IconTextButton icon="report.svg" textDesktop="Report" onClick={showModal} altText="reportIconAlt" />
      {modalShow && <ReportModal show={modalShow} onHide={hideModal} onSuccess={showReportSuccess} />}
      {reportSuccess && <ReportSuccessModal show={reportSuccess} onHide={hideReportSuccess} />}
    </Fragment>
  );
};

export default Report;
