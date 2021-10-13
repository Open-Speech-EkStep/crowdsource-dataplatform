import { render, verifyAxeTest, userEvent, screen, waitFor } from 'utils/testUtils';

import TestSpeakerMic from '../TestSpeakerMic';

describe('TestSpeakerMic', () => {
  const setup = (showMic: boolean, showSpeaker: boolean) => {
    return render(<TestSpeakerMic showMic={showMic} showSpeaker={showSpeaker} />);
  };

  verifyAxeTest(setup(false, true));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup(true, true);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the test speaker modal open and close behaviour', async () => {
    setup(true, true);
    userEvent.click(screen.getByRole('button', { name: 'testYourSpeaker Test Test your speakers' }));

    await waitFor(() => {
      expect(screen.getByTestId('speakerbtn')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByTestId('speakerbtn')).not.toBeInTheDocument();
    });
  });

  it('should test the test speaker audio', async () => {
    setup(false, true);
    userEvent.click(screen.getByRole('button', { name: 'testYourSpeaker Test Test your speakers' }));

    await waitFor(() => {
      expect(screen.getByTestId('speakerbtn')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Microphone Icon Test Speakers' }));

    expect(screen.getByTestId('speakerCanvas')).toBeInTheDocument();

    const audio: any = screen.getByTestId('speakerAudio');

    await waitFor(() => {
      audio.dispatchEvent(new window.Event('ended'));
      userEvent.click(screen.getByRole('button', { name: 'Microphone Icon Test Speakers' }));
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByTestId('speakerbtn')).not.toBeInTheDocument();
    });
  });
});
