import { render, verifyAxeTest, userEvent, screen, waitFor } from 'utils/testUtils';

import TestSpeakerMic from '../TestSpeakerMic';

describe('TestSpeakerMic', () => {
  const setup = () => render(<TestSpeakerMic />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the test speaker modal open and close behaviour', async () => {
    setup();
    userEvent.click(screen.getByRole('button', { name: 'testYourSpeaker Test Test your speakers' }));

    await waitFor(() => {
      expect(screen.getByText('Test your microphone and speakers')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByText('Test your microphone and speakers')).not.toBeInTheDocument();
    });
  });
});
