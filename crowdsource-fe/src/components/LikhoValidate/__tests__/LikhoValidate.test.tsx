import { when } from 'jest-when';
import { SWRConfig } from 'swr';

import { render, screen, userEvent, waitFor, waitForElementToBeRemoved } from 'utils/testUtils';

import LikhoValidate from '../LikhoValidate';

describe('LikhoValidate', () => {
  const storeUrl = '/store';
  const skipUrl = '/skip';
  const acceptUrl = '/validate/1719084/accept';
  const rejectUrl = '/validate/1719084/reject';
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
        contribution: '্্্্্্',
        contribution_id: 1719084,
        dataset_row_id: 1323119,
        sentence: 'ଆପଣ କେଉଁଠାରେ ବାସ କରନ୍ତି',
        source_info: null,
      },
      {
        contribution: '্্্্্্',
        contribution_id: 1719085,
        dataset_row_id: 1323119,
        sentence: 'ଆପଣ କେଉଁଠାରେ ବାସ କରନ୍ତି',
        source_info: null,
      },
      {
        contribution: '্্্্্্',
        contribution_id: 1719086,
        dataset_row_id: 1323119,
        sentence: 'ଆପଣ କେଉଁଠାରେ ବାସ କରନ୍ତି',
        source_info: null,
      },
      {
        contribution: '্্্্্্',
        contribution_id: 1719087,
        dataset_row_id: 1323119,
        sentence: 'ଆପଣ କେଉଁଠାରେ ବାସ କରନ୍ତି',
        source_info: null,
      },
      {
        contribution: '্্্্্্',
        contribution_id: 1719088,
        dataset_row_id: 1323119,
        sentence: 'ଆପଣ କେଉଁଠାରେ ବାସ କରନ୍ତି',
        source_info: null,
      },
    ],
  });

  const setup = async () => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

    when(localStorage.getItem)
      .calledWith('likho_to-language')
      .mockImplementation(() => 'English');

    when(localStorage.getItem)
      .calledWith('locationInfo')
      .mockImplementation(() => JSON.stringify(locationInfo));

    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify(speakerDetails));

    fetchMock
      .doMockOnceIf('/contributions/parallel?from=Hindi&to=English&username=abc')
      .mockResponseOnce(contributionsData);
    fetchMock.doMockIf(storeUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(skipUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(acceptUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(rejectUrl).mockResponse(JSON.stringify(successResponse));
    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <LikhoValidate />
      </SWRConfig>
    );

    await waitForElementToBeRemoved(() => screen.queryAllByTestId('Loader'));

    return renderResult;
  };

  it('needs change and correct button should be disabled initially', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled();
  });

  it('should show edit text area when needs change button clicked', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Edit Icon needsChange' }));
    expect(screen.queryByRole('button', { name: 'Edit Icon needsChange' })).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'cancel' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();

    expect(screen.getByRole('textbox', { name: 'yourEdit (english)' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'cancel' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled());
  });

  it('should not enable submit for short edit', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Edit Icon needsChange' }));
    userEvent.clear(screen.getByRole('textbox', { name: 'yourEdit (english)' }));
    userEvent.type(screen.getByRole('textbox', { name: 'yourEdit (english)' }), 'ab');
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
  });

  it('skip should show next text for valdiating', async () => {
    await setup();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/validate/1719084/skip', {
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          userName: 'abc',
          fromLanguage: 'Hindi',
          language: 'English',
          sentenceId: 1323119,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'parallel',
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'cors',
      });
    });
    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('correct should show next text for validating', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Correct Icon correct' }));

    await waitFor(() =>
      expect(fetchMock).toBeCalledWith('/validate/1719084/accept', {
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          userName: 'abc',
          fromLanguage: 'Hindi',
          language: 'English',
          sentenceId: 1323119,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'parallel',
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'cors',
      })
    );

    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('should show the error popup when api throw the error and close modal on clicking button', async () => {
    const url = '/validate/1719084/accept';
    const errorResponse = new Error('Some error');
    await setup();
    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Correct Icon correct' }));
    await waitFor(() =>
      expect(fetchMock).toBeCalledWith(url, {
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          userName: 'abc',
          fromLanguage: 'Hindi',
          language: 'English',
          sentenceId: 1323119,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'parallel',
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'cors',
      })
    );

    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();
    expect(screen.getByText('2/5')).toBeInTheDocument();
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

  it('should show the error popup for 2nd sentence when api throw the error and modal should close on clicking button', async () => {
    const url = '/validate/1719084/skip';
    const errorResponse = new Error('Some error');
    await setup();
    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);

    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          userName: 'abc',
          fromLanguage: 'Hindi',
          language: 'English',
          sentenceId: 1323119,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'parallel',
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'cors',
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

  it('should call /store and /validate endpoint when a correction is done', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Edit Icon needsChange' }));
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
    userEvent.clear(screen.getByRole('textbox', { name: 'yourEdit (english)' }));
    userEvent.type(screen.getByRole('textbox', { name: 'yourEdit (english)' }), 'abcd');
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
          language: 'English',
          type: 'parallel',
          sentenceId: 1323119,
          userInput: 'abcd',
          speakerDetails: JSON.stringify({
            userName: 'abc',
          }),
          fromLanguage: 'Hindi',
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
          sentenceId: 1323119,
          country: 'India',
          language: 'English',
          state: 'National Capital Territory of Delhi',
          userName: 'abc',
          type: 'parallel',
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

    when(localStorage.getItem)
      .calledWith('likho_to-language')
      .mockImplementation(() => 'English');

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
      .doMockIf('/contributions/parallel?from=Hindi&to=English&username=abc')
      .mockResponse(JSON.stringify({ data: [] }));
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <LikhoValidate />
      </SWRConfig>
    );
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('Loader'));
    await waitFor(() => {
      expect(screen.getByText('noDataMessage')).toBeInTheDocument();
    });
  });

  it('should go to thank you page after 5 skip sentences', async () => {
    const url = '/validate/1719084/skip';
    const errorResponse = new Error('Some error');
    await setup();
    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);

    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'skip' }));
    });
    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'skip' }));
    });
    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'skip' }));
    });
    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'skip' }));
    });
    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'skip' }));
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        body: JSON.stringify({
          device: 'android 11',
          browser: 'Chrome 13',
          userName: 'abc',
          fromLanguage: 'Hindi',
          language: 'English',
          sentenceId: 1323119,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'parallel',
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'cors',
      });
    });
    await waitFor(() => {
      expect(screen.getByText('apiFailureError')).toBeInTheDocument();
    });

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'close' }));
    });
  });
});
