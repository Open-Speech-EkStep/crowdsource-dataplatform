import { when } from 'jest-when';

import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import SunoTranscribe from '../SunoTranscribe';

describe('SunoTranscribe', () => {
  const setup = async () => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

    const locationInfo = {
      country: 'India',
      regionName: 'National Capital Territory of Delhi',
    };

    when(localStorage.getItem)
      .calledWith('locationInfo')
      .mockImplementation(() => JSON.stringify(locationInfo));

    const speakerDetails = {
      userName: 'abc',
      motherTongue: '',
      age: '',
      gender: '',
      language: 'Hindi',
      toLanguage: '',
    };

    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify(speakerDetails));

    fetchMock.doMockOnceIf('/media/asr').mockResponseOnce(
      JSON.stringify({
        data: [
          {
            dataset_row_id: 1248671,
            media_data:
              'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/2_3_Regional-Kohima-English-0725-20198228349.wav',
            source_info:
              '["newsonair.nic.in", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3"]',
          },
          {
            dataset_row_id: 1248672,
            media_data:
              'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/2_3_Regional-Kohima-English-0725-20198228349.wav',
            source_info:
              '["newsonair.nic.in", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3"]',
          },
          {
            dataset_row_id: 1248673,
            media_data:
              'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/2_3_Regional-Kohima-English-0725-20198228349.wav',
            source_info:
              '["newsonair.nic.in", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3"]',
          },
          {
            dataset_row_id: 1248674,
            media_data:
              'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/2_3_Regional-Kohima-English-0725-20198228349.wav',
            source_info:
              '["newsonair.nic.in", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3"]',
          },
          {
            dataset_row_id: 1248675,
            media_data:
              'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/2_3_Regional-Kohima-English-0725-20198228349.wav',
            source_info:
              '["newsonair.nic.in", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3", "http://newsonair.nic.in/writereaddata/Bulletins_Audio/Regional/2019/Aug/Regional-Kohima-English-0725-20198228349.mp3"]',
          },
        ],
      })
    );
    const renderResult = render(<SunoTranscribe />);

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/media/asr', {
        body: JSON.stringify({
          language: 'Hindi',
          userName: 'abc',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
      });
    });

    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('play button click should play audio and pause button should be enabled', async () => {
    await setup();

    expect(screen.getByRole('textbox', { name: 'addText (hindi)' })).toBeDisabled();

    expect(screen.getByRole('img', { name: 'Play Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: 'addText (hindi)' })).toBeEnabled();
  });

  it('pause button click should pause audio and play button should be enabled', async () => {
    await setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Pause Icon' }));

    expect(screen.getByRole('img', { name: 'Play Icon' })).toBeInTheDocument();
  });

  it('should test the textarea text with valid language', async () => {
    await setup();

    userEvent.type(screen.getByRole('textbox', { name: 'addText (hindi)' }), 'बपपप');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('play button click should play audio and replay button should be enabled after audio stops', async () => {
    await setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() => screen.getByTestId('audioElement').dispatchEvent(new window.Event('ended')));
    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Replay Icon' })).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('img', { name: 'Replay Icon' }));

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();
    });
  });

  it('should test the cancel button functionality', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    userEvent.type(screen.getByRole('textbox', { name: 'addText (hindi)' }), 'बपपप');

    expect(screen.getByRole('button', { name: 'cancel' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'cancel' }));

    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'addText (hindi)' })).toHaveValue('');
    });
  });

  it('should test the skip functionality', async () => {
    const url = '/skip';
    const successResponse = { message: 'Skipped successfully.', statusCode: 200 };

    await setup();
    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: 'abc',
          language: 'Hindi',
          type: 'asr',
          sentenceId: 1248671,
          state_region: 'National Capital Territory of Delhi',
          country: 'India',
          device: 'android 11',
          browser: 'Chrome 13',
        }),
      });
    });
  });

  it('should test the submit button', async () => {
    const url = '/store';
    const successResponse = { success: true };

    await setup();

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Pause Icon' }));

    expect(screen.getByRole('img', { name: 'Play Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    const audio: any = screen.getByTestId('audioElement');

    await waitFor(() => {
      audio.dispatchEvent(new window.Event('ended'));
      expect(screen.getByRole('img', { name: 'Replay Icon' })).toBeInTheDocument();
    });

    userEvent.type(screen.getByRole('textbox', { name: 'addText (hindi)' }), 'बपपप');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'submit' })).toBeEnabled();
    });

    userEvent.click(screen.getByRole('button', { name: 'submit' }));

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'बपपप',
          speakerDetails: '{"userName":"abc"}',
          language: 'Hindi',
          type: 'asr',
          sentenceId: 1248671,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          device: 'android 11',
          browser: 'Chrome 13',
        }),
      });
    });

    await waitFor(() => {
      expect(screen.getByText('thankyouForContributing')).toBeInTheDocument();
    });
  });

  it('should go to thank you page after 5 skip sentences', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));
  });
});
