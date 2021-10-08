import { render, verifyAxeTest, screen } from 'utils/testUtils';

import ButtonControls from '../ButtonControls';

describe('ButtonControls', () => {
  const setup = (
    showPlayButton: any,
    showPauseButton: any,
    showReplayButton: any,
    cancelDisable: any,
    submitDisable: any
  ) =>
    render(
      <ButtonControls
        onPlay={() => {}}
        onPause={() => {}}
        onReplay={() => {}}
        onSubmit={() => {}}
        onCancel={() => {}}
        playButton={showPlayButton}
        pauseButton={showPauseButton}
        replayButton={showReplayButton}
        cancelDisable={cancelDisable}
        submitDisable={submitDisable}
      />
    );

  verifyAxeTest(setup(true, false, false, true, true));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup(true, false, false, true, true);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should show the pause button', () => {
    setup(false, true, false, true, true);

    expect(screen.getByTestId('pauseBtn')).toBeInTheDocument();
  });

  it('should show the replay button', () => {
    setup(false, false, true, true, true);

    expect(screen.getByTestId('replayBtn')).toBeInTheDocument();
  });

  it('should render the button with default values', () => {
    setup(undefined, undefined, undefined, undefined, undefined);

    expect(screen.getByTestId('playBtn')).toBeInTheDocument();
  });
});
