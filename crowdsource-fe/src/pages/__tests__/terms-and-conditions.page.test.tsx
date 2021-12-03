import { render, screen } from 'utils/testUtils';

import TermsAndConditionsPage from '../terms-and-conditions.page';

describe('TermsAndConditionsPage', () => {
  it('should render the TermsAndConditionsPage', () => {
    render(<TermsAndConditionsPage />);

    expect(screen.getByTestId('TermsOfUse')).toBeInTheDocument();
    expect(screen.getByTestId('PrivacyPolicy')).toBeInTheDocument();
    expect(screen.getByTestId('Copyright')).toBeInTheDocument();
  });
});
