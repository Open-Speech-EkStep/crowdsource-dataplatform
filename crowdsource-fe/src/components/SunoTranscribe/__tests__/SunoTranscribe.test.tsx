import { render, screen } from 'utils/testUtils';

import SunoTranscribe from '../SunoTranscribe';

describe('SunoTranscribe', () => {
  const setup = () => render(<SunoTranscribe />);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the suno india record component', () => {
    setup();

    expect(screen.getByTestId('AudioController')).toBeInTheDocument();
    expect(screen.getByTestId('TextEditArea')).toBeInTheDocument();
    expect(screen.getByTestId('ErrorText')).toBeInTheDocument();
    expect(screen.getByTestId('ButtonControls')).toBeInTheDocument();
  });
});
