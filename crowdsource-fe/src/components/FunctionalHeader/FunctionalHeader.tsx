import Breadcrumbs from 'components/Breadcrumbs';
import Report from 'components/Report';
import TestSpeakerMic from 'components/TestSpeakerMic';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

interface FunctionalHeaderProps {
  onSuccess: () => void;
  initiativeMediaType: string;
}

const FunctionalHeader = ({ onSuccess, initiativeMediaType }: FunctionalHeaderProps) => {
  return (
    <header>
      <div className="d-flex justify-content-between align-items-center px-3 px-md-6">
        <Breadcrumbs initiative={INITIATIVES_MAPPING.suno} path="transcribe" />
        <div className="d-flex">
          <div>
            <Report onSuccess={onSuccess} initiativeMediaType={initiativeMediaType} />
          </div>
          <div className="ms-2 ms-md-4">
            <TestSpeakerMic showSpeaker={true} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default FunctionalHeader;
