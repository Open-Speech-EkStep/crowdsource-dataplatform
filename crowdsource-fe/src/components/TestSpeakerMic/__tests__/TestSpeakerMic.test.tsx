import router from 'next/router';

import { render, verifyAxeTest, userEvent, screen, waitFor } from 'utils/testUtils';

import TestSpeakerMic from '../TestSpeakerMic';

describe('TestSpeakerMic', () => {
  const setup = (showMic: boolean, showSpeaker: boolean) => {
    return render(<TestSpeakerMic showMic={showMic} showSpeaker={showSpeaker} />);
  };

  verifyAxeTest(setup(false, true));

  it('should render the component and matches it against stored snapshot', () => {
    router.asPath = '/asr-initiative/contribute';
    const { asFragment } = setup(true, true);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the test speaker modal open and close behaviour', async () => {
    router.asPath = '/tts-initiative/contribute';
    setup(true, true);
    userEvent.click(screen.getByRole('button', { name: 'testYourSpeaker test testYourSpeaker' }));

    await waitFor(() => {
      expect(screen.getByTestId('speakerbtn')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByTestId('speakerbtn')).not.toBeInTheDocument();
    });
  });

  it('should test the test speaker audio', async () => {
    router.asPath = '/tts-initiative/contribute';
    setup(false, true);
    userEvent.click(screen.getByRole('button', { name: 'testYourSpeaker test testYourSpeaker' }));

    await waitFor(() => {
      expect(screen.getByTestId('speakerbtn')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Microphone Icon testSpeakers' }));

    expect(screen.getByTestId('speakerCanvas')).toBeInTheDocument();

    const audio: any = screen.getByTestId('speakerAudio');

    await waitFor(() => {
      audio.dispatchEvent(new window.Event('ended'));
      userEvent.click(screen.getByRole('button', { name: 'Microphone Icon testSpeakers' }));
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByTestId('speakerbtn')).not.toBeInTheDocument();
    });
  });

  it('should test the mic', async () => {
    router.asPath = '/asr-initiative/contribute';
    setup(true, true);
    userEvent.click(
      screen.getByRole('button', {
        name: 'testYourMicrophoneAndSpeakers | testYourSpeaker test testYourMicrophoneAndSpeakers',
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId('testMicButton')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Mic Icon testMic' }));

    await waitFor(() => {
      expect(screen.getByTestId('recordingButton')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Mic' })).not.toBeInTheDocument();
    });
  });
});
