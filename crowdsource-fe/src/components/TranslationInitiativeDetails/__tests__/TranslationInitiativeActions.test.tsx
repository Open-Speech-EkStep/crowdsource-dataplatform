import { render, screen } from 'utils/testUtils';

import TranslationInitiativeActions from '../TranslationInitiativeActions';

describe('TranslationInitiativeActions', () => {
  const setup = () => {
    return render(<TranslationInitiativeActions />);
  };

  it('should render the translation Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionLanguage')).toBeInTheDocument();
  });
});
