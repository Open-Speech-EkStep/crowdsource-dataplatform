import { render, screen, userEvent, waitFor } from 'utils/testUtils';

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
    expect(screen.getByTestId('ButtonControls')).toBeInTheDocument();
  });

  it('should test the play button functionality on play, pause audio click', async () => {
    setup();
    userEvent.click(screen.getByRole('button', { name: 'Play Audio Play' }));

    expect(screen.getByRole('button', { name: 'Pause Audio Pause' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Pause Audio Pause' }));

    expect(screen.getByRole('button', { name: 'Play Audio Play' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Play Audio Play' }));

    const audio: any = screen.getByTestId('audioElement');

    await waitFor(() => {
      audio.dispatchEvent(new window.Event('ended'));
      expect(screen.getByRole('button', { name: 'Replay Audio Replay' })).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Replay Audio Replay' }));

    expect(screen.getByRole('button', { name: 'Pause Audio Pause' })).toBeInTheDocument();
  });

  it('should test the textarea text with valid language', async () => {
    setup();

    userEvent.type(screen.getByRole('textbox', { name: 'Add Text (Hindi)' }), 'बपपप');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('should test the cancel button', async () => {
    setup();

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();

    userEvent.type(screen.getByRole('textbox', { name: 'Add Text (Hindi)' }), 'बपपप');

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Add Text (Hindi)' })).toHaveValue('');
    });
  });

  it('should submit the form when click on submit button', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();

    userEvent.type(screen.getByRole('textbox', { name: 'Add Text (Hindi)' }), 'बपपप');

    // expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();

    expect(screen.getByRole('textbox', { name: 'Add Text (Hindi)' })).toHaveValue('बपपप');

    userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  });
});
