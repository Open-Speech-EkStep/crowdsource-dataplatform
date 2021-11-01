import Breadcrumbs from 'components/Breadcrumbs';
import Report from 'components/Report';
import TestSpeakerMic from 'components/TestSpeakerMic';
import type { Initiative } from 'types/Initiatives';

interface FunctionalHeaderProps {
  onSuccess: () => void;
  initiativeMediaType: string;
  initiative: Initiative;
  action: string;
  showSpeaker?: boolean;
}

const FunctionalHeader = ({
  onSuccess,
  initiativeMediaType,
  initiative,
  action,
  showSpeaker = true,
}: FunctionalHeaderProps) => {
  return (
    <header>
      <div className="d-flex justify-content-between align-items-center px-3 px-md-6">
        <Breadcrumbs initiative={initiative} path={action} />
        <div className="d-flex">
          <div>
            <Report onSuccess={onSuccess} initiativeMediaType={initiativeMediaType} />
          </div>
          {showSpeaker && (
            <div className="ms-2 ms-md-4">
              <TestSpeakerMic showSpeaker={true} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default FunctionalHeader;
