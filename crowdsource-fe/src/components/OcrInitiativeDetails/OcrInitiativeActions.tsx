import ContributionActions from 'components/ContributionActions';
import ContributionLanguage from 'components/ContributionLanguage';
import { INITIATIVES_MAPPING } from 'constants/initiativeConstants';

const OcrInitiativeActions = () => {
  return (
    <section data-testid="OcrInitiativeActions" className="mt-7 mt-md-9">
      <ContributionLanguage initiative={INITIATIVES_MAPPING.ocr} />
      <ContributionActions initiative={INITIATIVES_MAPPING.ocr} />
    </section>
  );
};

export default OcrInitiativeActions;
