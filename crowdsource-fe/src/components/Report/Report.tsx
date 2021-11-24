import React, { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import ErrorPopup from 'components/ErrorPopup';
import IconTextButton from 'components/IconTextButton';
import ImageBasePath from 'components/ImageBasePath';
import { INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import type { Initiative } from 'types/Initiatives';
import type { SourceType } from 'types/SourceType';
import { capitalizeFirstLetter, getErrorMsg } from 'utils/utils';

import ReportSuccessModal from './ReportSuccessModal';

const ReportModal = dynamic(() => import('./ReportModal'), { ssr: false });

interface ReportProps {
  onSuccess: () => void;
  action: SourceType;
  initiative: Initiative;
}

const Report = ({ onSuccess, action, initiative }: ReportProps) => {
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState();

  const showModal = () => setModalShow(true);
  const hideModal = () => setModalShow(false);

  const showError = (error: any) => {
    setError(error);
    setModalShow(false);
    setShowErrorModal(true);
  };

  const showReportSuccess = () => {
    hideModal();
    setReportSuccess(true);
  };

  const hideReportSuccess = () => {
    setReportSuccess(false);
    onSuccess();
  };

  const reportSubheadingText = t(
    `${INITIATIVES_MEDIA_MAPPING[initiative]}${capitalizeFirstLetter(action)}ReportModalSubHeading`
  );

  return (
    <Fragment>
      <IconTextButton textDesktop={t('report')} onClick={showModal} altText="reportIconAlt">
        <ImageBasePath src="/images/report.svg" width="24" height="24" alt="reportIconAlt" />
      </IconTextButton>
      {modalShow && (
        <ReportModal
          reportSubheadingText={reportSubheadingText}
          show={modalShow}
          onHide={hideModal}
          onSuccess={showReportSuccess}
          initiative={initiative}
          onError={error => showError(error)}
        />
      )}
      {reportSuccess && (
        <ReportSuccessModal show={reportSuccess} onHide={hideReportSuccess} initiative={initiative} />
      )}
      {showErrorModal && (
        <ErrorPopup
          show={showErrorModal}
          errorMsg={getErrorMsg(error)}
          onHide={() => setShowErrorModal(false)}
        />
      )}
    </Fragment>
  );
};

export default Report;
