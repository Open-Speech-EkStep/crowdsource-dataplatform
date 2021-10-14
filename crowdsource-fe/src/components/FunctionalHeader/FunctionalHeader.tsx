import Breadcrumbs from 'components/Breadcrumbs';
import Report from 'components/Report';
import TestSpeakerMic from 'components/TestSpeakerMic';

const FunctionalHeader = () => {
  return (
    <header className="d-flex justify-content-between align-items-center px-3 px-md-6">
      {/* <ChromeExtension /> */}
      <Breadcrumbs initiative="suno" path="transcribe" />
      <div className="d-flex">
        <div>
          <Report />
        </div>
        <div className="ms-2 ms-md-4">
          <TestSpeakerMic showSpeaker={true} />
        </div>
      </div>
    </header>
  );
};

export default FunctionalHeader;
