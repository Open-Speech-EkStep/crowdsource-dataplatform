import { when } from 'jest-when';
import router from 'next/router';

import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import OcrContribute from '../OcrContribute';

describe('OcrContribute', () => {
  const resultData = {
    data: [
      {
        dataset_row_id: 1248671,
        media_data: 'inbound/ocr/Hindi/test.png',
      },
      {
        dataset_row_id: 1248672,
        media_data: 'inbound/ocr/Hindi/test2.png',
      },
      {
        dataset_row_id: 1248673,
        media_data: 'inbound/ocr/Hindi/test3.png',
      },
      {
        dataset_row_id: 1248674,
        media_data: 'inbound/ocr/Hindi/test4.png',
      },
      {
        dataset_row_id: 1248675,
        media_data: 'inbound/ocr/Hindi/test5.png',
      },
    ],
  };
  const setup = async (resultData: any) => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

    const locationInfo = {
      country: 'Test Country',
      regionName: 'Sample Region',
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

    fetchMock.doMockOnceIf('/media/ocr').mockResponseOnce(JSON.stringify(resultData));
    const renderResult = render(<OcrContribute />);

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/media/ocr', {
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

    await waitFor(() => expect(screen.queryByTestId('PageSpinner')).not.toBeInTheDocument());

    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup(resultData);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should show the thank you message when no data present', async () => {
    const result = { data: [] };
    await setup(result);

    await waitFor(() => {
      expect(screen.getByText('ocrContributeNoDataThankYouMessage')).toBeInTheDocument();
    });
  });

  it('should show the error popup when api throw the error and close modal on clicking button', async () => {
    const url = '/media/ocr';
    const errorResponse = new Error('Some error');
    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);
    render(<OcrContribute />);
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/media/ocr', {
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

    await waitFor(() => {
      expect(screen.getByText('apiFailureError')).toBeInTheDocument();
    });

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'close' }));
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'close' })).not.toBeInTheDocument();
    });
  });

  it('should show the error popup for 2nd sentence when api throw the error and modal should close on clicking button', async () => {
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
        body:
          expect.stringContaining('"userName":"abc"') &&
          expect.stringContaining('"language":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248671"') &&
          expect.stringContaining('"type":"ocr"'),
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

  it('should test the textarea text with valid language', async () => {
    await setup(resultData);

    userEvent.type(screen.getByRole('textbox', { name: 'addText (hindi)' }), 'बपपप');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('should expand the  image', async () => {
    await setup(resultData);

    expect(screen.getByTestId('ExpandView')).toBeInTheDocument();
    expect(screen.getByAltText('OCR Data')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('ExpandView'));

    await waitFor(() => {
      expect(screen.getByTestId('CollapseView')).toBeInTheDocument();
      expect(screen.getByAltText('OCR Data Expanded')).toBeInTheDocument();
    });
  });

  it('should test the cancel button functionality', async () => {
    await setup(resultData);

    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled();

    userEvent.type(screen.getByRole('textbox', { name: 'addText (hindi)' }), 'बपपप');

    expect(screen.getByRole('button', { name: 'cancel' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'cancel' }));

    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled();

    userEvent.type(screen.getByRole('textbox', { name: 'addText (hindi)' }), 'abc');

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
        body:
          expect.stringContaining('"userName":"abc"') &&
          expect.stringContaining('"language":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248671"') &&
          expect.stringContaining('"type":"ocr"'),
      });
    });
  });

  it('should test the submit button', async () => {
    const url = '/store';
    const successResponse = { success: true };

    await setup(resultData);

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();

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
        body:
          expect.stringContaining('"userInput":"बपपप"') &&
          expect.stringContaining('"language":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248671"') &&
          expect.stringContaining('"speakerDetails":{"userName":"abc"}') &&
          expect.stringContaining('"type":"ocr"'),
      });
    });

    await waitFor(() => expect(screen.queryByRole('img', { name: 'check' })).toBeInTheDocument());

    await waitFor(() => expect(screen.queryByRole('img', { name: 'check' })).not.toBeInTheDocument());
  });

  it('should go to thank you page after 5 skip sentences', async () => {
    const url = '/skip';
    const successResponse = { message: 'Skipped successfully.', statusCode: 200 };

    await setup(resultData);
    fetchMock.doMockIf(url).mockResponse(JSON.stringify(successResponse));

    router.push = jest.fn();

    expect(screen.getByRole('button', { name: 'skip' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    userEvent.click(screen.getByRole('button', { name: 'skip' }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith(expect.stringContaining('/thank-you'), undefined, {
        locale: 'en',
      });
    });
  });

  it('should go to thank you page after 5 skip sentences but last sentence throw an error', async () => {
    const url = '/skip';
    const errorResponse = new Error('Some error');
    await setup(resultData);
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
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body:
          expect.stringContaining('"userName":"abc"') &&
          expect.stringContaining('"language":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248671"') &&
          expect.stringContaining('"type":"ocr"'),
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
    const url = '/store';
    const errorResponse = new Error('Some error');
    await setup(resultData);
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

    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();

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
        body:
          expect.stringContaining('"userInput":"बपपप"') &&
          expect.stringContaining('"language":"Hindi"') &&
          expect.stringContaining('"sentenceId":"1248671"') &&
          expect.stringContaining('"speakerDetails":{"userName":"abc"}') &&
          expect.stringContaining('"type":"ocr"'),
      });
    });

    await waitFor(() => expect(screen.queryByRole('img', { name: 'check' })).toBeInTheDocument());

    await waitFor(() => expect(screen.queryByRole('img', { name: 'check' })).not.toBeInTheDocument());

    await waitFor(() => {
      expect(screen.getByText('apiFailureError')).toBeInTheDocument();
    });

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'close' }));
    });

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith(expect.stringContaining('/thank-you'), undefined, {
        locale: 'en',
      });
    });
  });
});
