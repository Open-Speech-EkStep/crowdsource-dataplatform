import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import SunoTranscribe from '../SunoTranscribe';

describe('SunoTranscribe', () => {
  const setup = () => render(<SunoTranscribe />);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('play button click should play audio and pause button should be enabled', async () => {
    setup();

    expect(screen.getByRole('img', { name: 'Play Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();
  });

  it('pause button click should pause audio and play button should be enabled', async () => {
    setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Pause Icon' }));

    expect(screen.getByRole('img', { name: 'Play Icon' })).toBeInTheDocument();
  });

  it('should test the textarea text with valid language', async () => {
    setup();

    userEvent.type(screen.getByRole('textbox', { name: 'Add Text (Hindi)' }), 'बपपप');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('play button click should play audio and replay button should be enabled after audio stops', async () => {
    setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() => screen.getByTestId('audioElement').dispatchEvent(new window.Event('ended')));
    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Replay Icon' })).toBeInTheDocument();
    });
  });

  it('should test the cancel button', async () => {
    setup();

    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled();

    userEvent.type(screen.getByRole('textbox', { name: 'Add Text (Hindi)' }), 'बपपप');

    expect(screen.getByRole('button', { name: 'cancel' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'cancel' }));

    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Add Text (Hindi)' })).toHaveValue('');
    });
  });

  it('should submit the form when click on submit button', () => {
    setup();

    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();

    userEvent.type(screen.getByRole('textbox', { name: 'Add Text (Hindi)' }), 'बपपप');

    expect(screen.getByRole('textbox', { name: 'Add Text (Hindi)' })).toHaveValue('बपपप');

    userEvent.click(screen.getByRole('button', { name: 'submit' }));
  });
});
