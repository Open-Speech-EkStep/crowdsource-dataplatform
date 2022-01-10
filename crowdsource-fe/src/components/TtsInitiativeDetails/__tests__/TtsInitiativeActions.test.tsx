import { render, screen } from 'utils/testUtils';

import TtsInitiativeActions from '../TtsInitiativeActions';

describe('TtsInitiativeActions', () => {
  const setup = () => {
    return render(<TtsInitiativeActions />);
  };

  it('should render the tts Initiative action snapshot', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the tts Initiative homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
    expect(screen.getByTestId('ContributionLanguage')).toBeInTheDocument();
  });
});
