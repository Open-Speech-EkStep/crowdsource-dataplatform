import { when } from 'jest-when';
import { SWRConfig } from 'swr';

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from 'utils/testUtils';

import SunoValidate from '../SunoValidate';

describe('SunoValidate', () => {
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

  const setup = async () => {
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
      .doMockOnceIf('/contributions/asr?from=Hindi&to=&username=abc')
      .mockResponseOnce(contributionsData);
    fetchMock.doMockIf(storeUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(skipUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(acceptUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(rejectUrl).mockResponse(JSON.stringify(successResponse));
    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <SunoValidate />
      </SWRConfig>
    );

    await waitForElementToBeRemoved(() => screen.queryAllByTestId('StatsSpinner'));

    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('needs change and correct button should be disabled initially', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeDisabled();
  });

  it('play button and skip button should be enabled initially', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'Play Icon play' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();
  });

  it('play button click should play audio and pause button should be enabled', async () => {
    await setup();

    expect(screen.getByRole('img', { name: 'Play Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();
  });

  it('pause button click should pause audio and play button should be enabled', async () => {
    await setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('img', { name: 'Pause Icon' }));

    expect(screen.getByRole('img', { name: 'Play Icon' })).toBeInTheDocument();
  });

  it('should enable needs change and correct button when full audio is played', async () => {
    await setup();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeDisabled());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeDisabled());

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() => screen.getByTestId('audioElement').dispatchEvent(new window.Event('ended')));
    await waitFor(() => expect(screen.getByRole('img', { name: 'Replay Icon' })).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled());
  });

  it('should replay full audio is played and replay clicked', async () => {
    await setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() => screen.getByTestId('audioElement').dispatchEvent(new window.Event('ended')));
    await waitFor(() => expect(screen.getByRole('img', { name: 'Replay Icon' })).toBeInTheDocument());
    userEvent.click(screen.getByRole('img', { name: 'Replay Icon' }));
    await waitFor(() => expect(screen.getByRole('img', { name: 'Pause Icon' })).toBeInTheDocument());
  });

  it('should show edit text area when needs change button clicked', async () => {
    await setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() => screen.getByTestId('audioElement').dispatchEvent(new window.Event('ended')));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled());
    userEvent.click(screen.getByRole('button', { name: 'Edit Icon needsChange' }));
    expect(screen.queryByRole('button', { name: 'Edit Icon needsChange' })).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'cancel' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();

    expect(screen.getByRole('textbox', { name: 'originalText' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'yourEdit (hindi)' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'cancel' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled());
  });

  it('should not enable submit for short edit', async () => {
    await setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() => screen.getByTestId('audioElement').dispatchEvent(new window.Event('ended')));
    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Edit Icon needsChange' }));
    userEvent.clear(screen.getByRole('textbox', { name: 'yourEdit (hindi)' }));
    userEvent.type(screen.getByRole('textbox', { name: 'yourEdit (hindi)' }), 'बप');
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
  });

  it('skip should show next text for valdiating', async () => {
    await setup();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/skip', {
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          userName: 'abc',
          fromLanguage: 'Hindi',
          sentenceId: 1248712,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'asr',
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'cors',
      });
    });
    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Play Icon play' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('correct should show next text for validating', async () => {
    await setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() => screen.getByTestId('audioElement').dispatchEvent(new window.Event('ended')));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled());
    userEvent.click(screen.getByRole('button', { name: 'Correct Icon correct' }));

    await waitFor(() =>
      expect(fetchMock).toBeCalledWith('/validate/1717503/accept', {
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          userName: 'abc',
          fromLanguage: 'Hindi',
          sentenceId: 1248712,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'asr',
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'cors',
      })
    );

    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Play Icon play' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('should call /store and /validate endpoint when a correction is done', async () => {
    await setup();

    userEvent.click(screen.getByRole('img', { name: 'Play Icon' }));

    await waitFor(() => screen.getByTestId('audioElement').dispatchEvent(new window.Event('ended')));
    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Edit Icon needsChange' }));
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    userEvent.clear(screen.getByRole('textbox', { name: 'yourEdit (hindi)' }));
    userEvent.type(screen.getByRole('textbox', { name: 'yourEdit (hindi)' }), 'बपपप');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'submit' })).toBeEnabled();
    });
    userEvent.click(screen.getByRole('button', { name: 'submit' }));
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(storeUrl, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          country: 'India',
          state: 'National Capital Territory of Delhi',
          language: 'Hindi',
          type: 'asr',
          sentenceId: 1248712,
          userInput: 'बपपप',
          speakerDetails: JSON.stringify({
            userName: 'abc',
          }),
        }),
      });
    });
    await waitFor(() => expect(screen.getByRole('img', { name: 'check' })).toBeInTheDocument());

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(rejectUrl, {
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          fromLanguage: 'Hindi',
          sentenceId: 1248712,
          country: 'India',
          state: 'National Capital Territory of Delhi',
          userName: 'abc',
          type: 'asr',
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'cors',
      });
    });
    await waitFor(() => expect(screen.queryByRole('img', { name: 'check' })).not.toBeInTheDocument());
  });

  it('should show no data text when fetch call gives no data', async () => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

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

    fetchMock
      .doMockIf('/contributions/asr?from=Hindi&to=&username=abc')
      .mockResponse(JSON.stringify({ data: [] }));
    const { asFragment } = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <SunoValidate />
      </SWRConfig>
    );
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('StatsSpinner'));
    expect(asFragment()).toMatchSnapshot();
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
