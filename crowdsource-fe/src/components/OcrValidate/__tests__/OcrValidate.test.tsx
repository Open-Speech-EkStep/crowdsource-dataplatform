import { when } from 'jest-when';
import { SWRConfig } from 'swr';

import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import OcrValidate from '../OcrValidate';

describe('OcrValidate', () => {
  const storeUrl = '/store';
  const skipUrl = '/validate/1717503/skip';
  const acceptUrl = '/validate/1717503/accept';
  const rejectUrl = '/validate/1717503/reject';
  const successResponse = { success: true };

  const speakerDetails = {
    userName: 'abc',
    motherTongue: '',
    age: '',
    gender: '',
    language: 'Hindi',
    toLanguage: '',
  };

  const locationInfo = {
    country: 'Test Country',
    regionName: 'Sample Region',
  };

  const contributionsData = JSON.stringify({
    data: [
      {
        contribution_id: 1717503,
        dataset_row_id: 1248712,
        sentence: 'inbound/ocr/Hindi/test.png',
        contribution: 'सोल को अगर आप नहीं देख',
      },
      {
        contribution_id: 1717502,
        dataset_row_id: 1248711,
        sentence: 'inbound/ocr/Hindi/test2.png',
        contribution: 'नहीं देख सकते शीशा लगा करके आप जरूर देखिए',
      },
      {
        contribution_id: 1717501,
        dataset_row_id: 1248710,
        sentence: 'inbound/ocr/Hindi/test3.png',
        contribution: 'आप जरूर देखिए',
      },
      {
        contribution_id: 1717497,
        dataset_row_id: 1248705,
        sentence: 'inbound/ocr/Hindi/test4.png',
        contribution: 'देखिए',
      },
      {
        contribution_id: 1717496,
        dataset_row_id: 1248704,
        sentence: 'inbound/ocr/Hindi/test5.png',
        contribution: 'देखिए',
      },
    ],
  });

  const setup = async () => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify(speakerDetails));

    when(localStorage.getItem)
      .calledWith('locationInfo')
      .mockImplementation(() => JSON.stringify(locationInfo));

    fetchMock
      .doMockOnceIf('/contributions/ocr?from=Hindi&to=&username=abc')
      .mockResponseOnce(contributionsData);
    fetchMock.doMockIf(storeUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(skipUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(acceptUrl).mockResponse(JSON.stringify(successResponse));
    fetchMock.doMockIf(rejectUrl).mockResponse(JSON.stringify(successResponse));
    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <OcrValidate />
      </SWRConfig>
    );

    await waitFor(() => expect(screen.queryByTestId('PageSpinner')).not.toBeInTheDocument());

    return renderResult;
  };

  it('needs change and correct button should be enabled initially', async () => {
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

    expect(screen.getByRole('textbox', { name: 'yourEdit (hindi)' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'cancel' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled());
  });

  it('should expand the  image', async () => {
    await setup();

    expect(screen.getByTestId('ExpandView')).toBeInTheDocument();
    expect(screen.getByAltText('OCR Data')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('ExpandView'));

    await waitFor(() => {
      expect(screen.getByTestId('CollapseView')).toBeInTheDocument();
      expect(screen.getByAltText('OCR Data Expanded')).toBeInTheDocument();
    });
  });

  it('should not enable submit for short edit', async () => {
    await setup();

    expect(screen.getByRole('button', { name: 'Edit Icon needsChange' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Edit Icon needsChange' }));
    userEvent.clear(screen.getByRole('textbox', { name: 'yourEdit (hindi)' }));
    userEvent.type(screen.getByRole('textbox', { name: 'yourEdit (hindi)' }), 'ab');
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();
  });

  it('skip should show next text for valdiating', async () => {
    await setup();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(skipUrl, {
        body:
          expect.stringContaining('"userName":"abc"') &&
          expect.stringContaining('"fromLanguage":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248712"') &&
          expect.stringContaining('"type":"ocr"'),
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
      expect(fetchMock).toBeCalledWith(acceptUrl, {
        body:
          expect.stringContaining('"userName":"abc"') &&
          expect.stringContaining('"fromLanguage":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248712"') &&
          expect.stringContaining('"type":"ocr"'),
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
    const url = '/validate/1717503/accept';
    const errorResponse = new Error('Some error');
    await setup();
    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);
    expect(screen.getByRole('button', { name: 'Correct Icon correct' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Correct Icon correct' }));
    await waitFor(() =>
      expect(fetchMock).toBeCalledWith(url, {
        body:
          expect.stringContaining('"userName":"abc"') &&
          expect.stringContaining('"fromLanguage":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248712"') &&
          expect.stringContaining('"type":"ocr"'),
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
    const url = '/validate/1717503/skip';
    const errorResponse = new Error('Some error');
    await setup();
    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);

    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(skipUrl, {
        body:
          expect.stringContaining('"userName":"abc"') &&
          expect.stringContaining('"fromLanguage":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248712"') &&
          expect.stringContaining('"type":"ocr"'),
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
        body:
          expect.stringContaining('"speakerDetails":{"userName":"abc"}') &&
          expect.stringContaining('"language":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248712"') &&
          expect.stringContaining('"type":"ocr"'),
      });
    });
    await waitFor(() => expect(screen.getByRole('img', { name: 'check' })).toBeInTheDocument());

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(rejectUrl, {
        body:
          expect.stringContaining('"userName":"abc"') &&
          expect.stringContaining('"fromLanguage":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248712"') &&
          expect.stringContaining('"type":"ocr"'),
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
      .doMockIf('/contributions/ocr?from=Hindi&to=&username=abc')
      .mockResponse(JSON.stringify({ data: [] }));
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <OcrValidate />
      </SWRConfig>
    );
    await waitFor(() => expect(screen.queryByTestId('PageSpinner')).not.toBeInTheDocument());
    await waitFor(() => {
      expect(screen.getByText('noDataMessage')).toBeInTheDocument();
    });
  });

  it('should go to thank you page after 5 skip sentences', async () => {
    const url = '/validate/1717503/skip';
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
      expect(fetchMock).toBeCalledWith(skipUrl, {
        body:
          expect.stringContaining('"userName":"abc"') &&
          expect.stringContaining('"fromLanguage":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248712"') &&
          expect.stringContaining('"type":"ocr"'),
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

  it('should go to thank you page after 4 skip sentences and last sentence throw an error when user submit', async () => {
    const errorResponse = new Error('Some error');
    await setup();
    fetchMock.doMockOnceIf(storeUrl).mockRejectOnce(errorResponse);

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
        body:
          expect.stringContaining('"speakerDetails":{"userName":"abc"}') &&
          expect.stringContaining('"language":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248712"') &&
          expect.stringContaining('"type":"ocr"'),
      });
    });
    await waitFor(() => expect(screen.getByRole('img', { name: 'check' })).toBeInTheDocument());

    await waitFor(() => {
      expect(screen.getByText('apiFailureError')).toBeInTheDocument();
    });

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'close' }));
    });
  });
});
