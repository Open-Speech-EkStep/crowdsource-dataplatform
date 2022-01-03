import React from 'react';

import { useTranslation } from 'next-i18next';

import Breadcrumbs from 'components/Breadcrumbs';
import IconTextButton from 'components/IconTextButton';
import ImageBasePath from 'components/ImageBasePath';
import Report from 'components/Report';
import TestSpeakerMic from 'components/TestSpeakerMic';
import type { Initiative } from 'types/Initiatives';
import type { SourceType } from 'types/SourceType';

interface FunctionalHeaderProps {
  onSuccess: () => void;
  type: SourceType;
  initiative: Initiative;
  action: string;
  showSpeaker?: boolean;
  showMic?: boolean;
  showTipButton?: boolean;
  toggleQuickTips?: any;
}

const FunctionalHeader = ({
  onSuccess,
  type,
  initiative,
  action,
  showSpeaker = true,
  showMic = false,
  showTipButton = false,
  toggleQuickTips,
}: FunctionalHeaderProps) => {
  const { t } = useTranslation();

  const handleQuickTips = () => {
    toggleQuickTips();
  };

  return (
    <header>
      <div className="d-lg-flex justify-content-lg-between align-items-lg-center px-3 px-md-3 px-lg-6">
        <Breadcrumbs initiative={initiative} path={action} />
        <div className="d-flex justify-content-end mt-1 mt-md-3 mt-lg-0">
          {showTipButton && (
            <div className="me-2 me-md-4">
              <IconTextButton
                id="tips"
                textDesktop={t('tips')}
                onClick={handleQuickTips}
                altText="tipsIconAlt"
              >
                <ImageBasePath src="/images/bulb_filled.svg" width="24" height="24" alt="tipsIconAlt" />
              </IconTextButton>
            </div>
          )}
          <div>
            <Report onSuccess={onSuccess} initiative={initiative} action={type} />
          </div>
          {showSpeaker && (
            <div className="ms-2 ms-md-4">
              <TestSpeakerMic showSpeaker={true} showMic={showMic} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default FunctionalHeader;
