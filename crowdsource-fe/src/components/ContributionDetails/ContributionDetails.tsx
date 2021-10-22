import type { ReactNode } from 'react';

import TriColorGradientBg from 'components/TriColorGradientBg';

interface ContributionDetailsProps {
  top?: ReactNode;
  bottom?: ReactNode;
}

const ContributionDetails = ({ top, bottom }: ContributionDetailsProps) => {
  return (
    <TriColorGradientBg>
      <div>{top}</div>
      <div className="mt-8 text-center text-md-start">{bottom}</div>
    </TriColorGradientBg>
  );
};

export default ContributionDetails;
