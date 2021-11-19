import { when } from 'jest-when';

import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import BoloSpeak from '../BoloSpeak';

describe('BoloSpeak', () => {
  const resultData = {
    data: [
      {
        dataset_row_id: 371765,
        media_data: 'बल्कि मजबूरी थी 20',
        source_info: null,
      },
      {
        dataset_row_id: 371766,
        media_data: 'बल्कि मजबूरी थी 21',
        source_info: null,
      },
      {
        dataset_row_id: 371767,
        media_data: 'बल्कि मजबूरी थी 22',
        source_info: null,
      },
      {
        dataset_row_id: 371768,
        media_data: 'बल्कि मजबूरी थी 23',
        source_info: null,
      },
      {
        dataset_row_id: 371769,
        media_data: 'बल्कि मजबूरी थी 24',
        source_info: null,
      },
    ],
  };
  const setup = async (resultData: any) => {
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

    fetchMock.doMockOnceIf('/media/text').mockResponseOnce(JSON.stringify(resultData));
    const renderResult = render(<BoloSpeak />);

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/media/text', {
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

  it('should start the recording', async () => {
    await setup(resultData);

    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'startRecording' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'startRecording' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'stopRecording' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    });
  });

  it('should show the thank you message when no data present', async () => {
    const result = { data: [] };
    await setup(result);

    await waitFor(() => {
      expect(screen.getByText('textContributeNoDataThankYouMessage')).toBeInTheDocument();
    });
  });

  it('stop button should stop the audio recording', async () => {
    await setup(resultData);

    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'startRecording' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'startRecording' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'stopRecording' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    });

    userEvent.click(screen.getByRole('button', { name: 'stopRecording' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'reRecord' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    });
  });

  it('re-record button should start recording the audio again', async () => {
    await setup(resultData);

    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'startRecording' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'startRecording' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'stopRecording' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    });

    userEvent.click(screen.getByRole('button', { name: 'stopRecording' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'reRecord' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    });

    userEvent.click(screen.getByRole('button', { name: 'reRecord' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'stopRecording' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    });
  });

  it('should test the skip functionality', async () => {
    const url = '/skip';
    const successResponse = { message: 'Skipped successfully.', statusCode: 200 };

    await setup(resultData);
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
          device: 'android 11',
          browser: 'Chrome 13',
          userName: 'abc',
          language: 'Hindi',
          sentenceId: 371765,
          state_region: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'text',
        }),
      });
    });
  });

  it('should show the error popup when api throw the error and close modal on clicking button', async () => {
    const url = '/skip';
    const errorResponse = new Error('Some error');
    await setup(resultData);
    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);
    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          userName: 'abc',
          language: 'Hindi',
          sentenceId: 371765,
          state_region: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'text',
        }),
      });
    });
    await waitFor(() => {
      expect(screen.getByText('apiFailureError')).toBeInTheDocument();
    });

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'close' }));
    });

    await waitFor(() => {
      expect(screen.queryByText('apiFailureError')).not.toBeInTheDocument();
    });
  });

  it('should go to thank you page after 5 skip sentences', async () => {
    await setup(resultData);

    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));
  });
});
