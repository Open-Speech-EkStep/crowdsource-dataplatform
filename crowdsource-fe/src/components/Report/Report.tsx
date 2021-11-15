import React, { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import IconTextButton from 'components/IconTextButton';
import { INITIATIVES_MEDIA_MAPPING } from 'constants/initiativeConstants';
import type { Initiative } from 'types/Initiatives';
import type { SourceType } from 'types/SourceType';
import { capitalizeFirstLetter } from 'utils/utils';

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

  const reportSubheadingText = t(
    `${INITIATIVES_MEDIA_MAPPING[initiative]}${capitalizeFirstLetter(action)}ReportModalSubHeading`
  );

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
          reportSubheadingText={reportSubheadingText}
          show={modalShow}
          onHide={hideModal}
          onSuccess={showReportSuccess}
          initiative={initiative}
        />
      )}
      {reportSuccess && (
        <ReportSuccessModal show={reportSuccess} onHide={hideReportSuccess} initiative={initiative} />
      )}
    </Fragment>
  );
};

export default Report;
