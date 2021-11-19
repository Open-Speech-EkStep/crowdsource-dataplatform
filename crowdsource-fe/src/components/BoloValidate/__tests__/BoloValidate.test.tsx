import { when } from 'jest-when';
import { SWRConfig } from 'swr';

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from 'utils/testUtils';

import BoloValidate from '../BoloValidate';

describe('BoloValidate', () => {
  const storeUrl = '/store';
  const skipUrl = '/skip';
  const acceptUrl = '/validate/1717503/accept';
  const rejectUrl = '/validate/1717503/reject';
  const successResponse = { success: true };
  const locationInfo = {
    country: 'India',
    regionName: 'National Capital Territory of Delhi',
  };

  const speakerDetails = {
    userName: 'abc',
    motherTongue: '',
    age: '',
    gender: '',
    language: 'Hindi',
    toLanguage: '',
  };

  const contributionsData = JSON.stringify({
    data: [
      {
        contribution_id: 1717503,
        dataset_row_id: 1248712,
        sentence:
          'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/37_Regional-Shillong-English-0830-202131192011.wav',
        contribution: 'सोल को अगर आप नहीं देख सकते शीशा लगा करके आप जरूर देखिए',
        source_info: null,
      },
      {
        contribution_id: 1717502,
        dataset_row_id: 1248711,
        sentence:
          'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/37_Regional-Shillong-English-0830-202121195940.wav',
        contribution: 'नहीं देख सकते शीशा लगा करके आप जरूर देखिए',
        source_info: null,
      },
      {
        contribution_id: 1717501,
        dataset_row_id: 1248710,
        sentence:
          'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/37_Regional-Shillong-English-0830-202112711182.wav',
        contribution: 'आप जरूर देखिए',
        source_info: null,
      },
      {
        contribution_id: 1717497,
        dataset_row_id: 1248705,
        sentence:
          'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/37_Regional-Shillong-English-0830-202083094241.wav',
        contribution: 'देखिए',
        source_info: null,
      },
      {
        contribution_id: 1717496,
        dataset_row_id: 1248704,
        sentence:
          'inbound/asr/English/newsonair.nic.in_09-08-2021_03-37/37_Regional-Shillong-English-0830-20208293814.wav',
        contribution: 'देखिए',
        source_info: null,
      },
    ],
  });

  const setup = async (contributionsData: any) => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

    when(localStorage.getItem)
      .calledWith('locationInfo')
      .mockImplementation(() => JSON.stringify(locationInfo));

    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify(speakerDetails));

    fetchMock
      .doMockOnceIf('/contributions/text?from=Hindi&to=&username=abc')
      .mockResponseOnce(contributionsData);
    fetchMock.doMockIf(storeUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(skipUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(acceptUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(rejectUrl).mockResponse(JSON.stringify(successResponse));
    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BoloValidate />
      </SWRConfig>
    );

    await waitForElementToBeRemoved(() => screen.queryAllByTestId('StatsSpinner'));

    return renderResult;
  };

  it('incorrect and correct button should be disabled initially', async () => {
    await setup(contributionsData);

    expect(screen.getByRole('button', { name: 'InCorrect Icon incorrect' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeDisabled();
  });

  it('play button and skip button should be enabled initially', async () => {
    await setup(contributionsData);

    expect(screen.getByRole('button', { name: 'Play Icon play' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();
  });

  it('should show the thank you message when no data present', async () => {
    const result = JSON.stringify({ data: [] });
    await setup(result);

    await waitFor(() => {
      expect(screen.getByText('textValidateNoDataThankYouMessage')).toBeInTheDocument();
    });
  });

  it('play button click should play audio and pause button should be enabled', async () => {
    await setup(contributionsData);

    expect(screen.getByRole('img', { name: 'Play Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();
  });

  it('pause button click should pause audio and play button should be enabled', async () => {
    await setup(contributionsData);

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Pause Icon' }));

    expect(screen.getByRole('img', { name: 'Play Icon' })).toBeInTheDocument();
  });

  it('should enable incorrect and correct button when full audio is played', async () => {
    await setup(contributionsData);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'InCorrect Icon incorrect' })).toBeDisabled()
    );
    await waitFor(() => expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeDisabled());

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() =>
      screen.getByTestId('boloValidateAudioElement').dispatchEvent(new window.Event('ended'))
    );
    await waitFor(() => expect(screen.getByRole('img', { name: 'Replay Icon' })).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'InCorrect Icon incorrect' })).toBeEnabled()
    );
    await waitFor(() => expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled());
  });

  it('should replay full audio is played and replay clicked', async () => {
    await setup(contributionsData);

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() =>
      screen.getByTestId('boloValidateAudioElement').dispatchEvent(new window.Event('ended'))
    );
    await waitFor(() => expect(screen.getByRole('img', { name: 'Replay Icon' })).toBeInTheDocument());
    userEvent.click(screen.getByRole('img', { name: 'Replay Icon' }));
    await waitFor(() => expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument());
  });

  it('should test the skip functionality', async () => {
    const url = '/validate/1717503/skip';
    const successResponse = { message: 'Skipped successfully.', statusCode: 200 };

    await setup(contributionsData);
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
          sentenceId: 1248712,
          state_region: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'text',
        }),
      });
    });
  });

  it('should test the correct functionality', async () => {
    const url = '/validate/1717503/accept';
    const successResponse = { message: 'Validate successfully.', statusCode: 200 };

    await setup(contributionsData);

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() =>
      screen.getByTestId('boloValidateAudioElement').dispatchEvent(new window.Event('ended'))
    );

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    expect(screen.getByRole('img', { name: 'Correct Icon' })).toBeEnabled();

    userEvent.click(screen.getByRole('img', { name: 'Correct Icon' }));

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
          fromLanguage: 'Hindi',
          sentenceId: 1248712,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'text',
        }),
      });
    });
  });

  it('should show the error popup when api throw the error and close modal on clicking button', async () => {
    const url = '/validate/1717503/accept';
    const errorResponse = new Error('Some error');
    await setup(contributionsData);
    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() =>
      screen.getByTestId('boloValidateAudioElement').dispatchEvent(new window.Event('ended'))
    );
    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);
    expect(screen.getByRole('img', { name: 'Correct Icon' })).toBeEnabled();

    userEvent.click(screen.getByRole('img', { name: 'Correct Icon' }));
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
          fromLanguage: 'Hindi',
          sentenceId: 1248712,
          state: 'National Capital Territory of Delhi',
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

  it('should test the incorrect functionality', async () => {
    const url = '/validate/1717503/reject';
    const successResponse = { message: 'Validate successfully.', statusCode: 200 };

    await setup(contributionsData);

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() =>
      screen.getByTestId('boloValidateAudioElement').dispatchEvent(new window.Event('ended'))
    );

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    expect(screen.getByRole('img', { name: 'InCorrect Icon' })).toBeEnabled();

    userEvent.click(screen.getByRole('img', { name: 'InCorrect Icon' }));

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          fromLanguage: 'Hindi',
          sentenceId: 1248712,
          country: 'India',
          state: 'National Capital Territory of Delhi',
          userName: 'abc',
          type: 'text',
        }),
      });
    });
  });

  it('should go to thank you page after 5 skip sentences', async () => {
    await setup(contributionsData);

    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));
  });
});
