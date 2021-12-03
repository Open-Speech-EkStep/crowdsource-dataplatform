import Breadcrumbs from 'components/Breadcrumbs';
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
}

const FunctionalHeader = ({
  onSuccess,
  type,
  initiative,
  action,
  showSpeaker = true,
  showMic = false,
}: FunctionalHeaderProps) => {
  return (
    <header>
      <div className="d-lg-flex justify-content-lg-between align-items-lg-center px-3 px-md-3 px-lg-6">
        <Breadcrumbs initiative={initiative} path={action} />
        <div className="d-flex justify-content-end mt-1 mt-md-3 mt-lg-0">
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
