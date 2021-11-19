import { when } from 'jest-when';

import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import LikhoTranslate from '../LikhoTranslate';

describe('LikhoTranslate', () => {
  const resultData = {
    data: [
      {
        dataset_row_id: 1138910,
        media_data: 'Hey , how have you been ',
        source_info: null,
      },
      {
        dataset_row_id: 1138911,
        media_data: 'Hey , how have you been ',
        source_info: null,
      },
      {
        dataset_row_id: 1138912,
        media_data: 'Hey , how have you been',
        source_info: null,
      },
      {
        dataset_row_id: 1138913,
        media_data: 'Hey , how have you been',
        source_info: null,
      },
      {
        dataset_row_id: 1138914,
        media_data: 'Hey , how have you been',
        source_info: null,
      },
    ],
  };
  const setup = async (result: any) => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');

    when(localStorage.getItem)
      .calledWith('likho_to-language')
      .mockImplementation(() => 'English');

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

    fetchMock.doMockOnceIf('/media/parallel').mockResponseOnce(JSON.stringify(result));
    const renderResult = render(<LikhoTranslate />);

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/media/parallel', {
        body: JSON.stringify({
          language: 'Hindi',
          toLanguage: 'English',
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

  it('should test the textarea text with valid language', async () => {
    await setup(resultData);

    userEvent.type(screen.getByRole('textbox', { name: 'english' }), 'बपपप');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('should show the thank you message when no data present', async () => {
    const result = { data: [] };
    await setup(result);

    await waitFor(() => {
      expect(screen.getByText('parallelContributeNoDataThankYouMessage')).toBeInTheDocument();
    });
  });

  it('should show the error popup when api throw the error and close modal on clicking button', async () => {
    const url = '/media/parallel';
    const errorResponse = new Error('Some error');
    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);
    render(<LikhoTranslate />);
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/media/parallel', {
        body: JSON.stringify({
          language: 'Hindi',
          toLanguage: 'English',
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

  it('should test the cancel button functionality', async () => {
    await setup(resultData);

    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled();

    userEvent.type(screen.getByRole('textbox', { name: 'english' }), 'abcd');

    expect(screen.getByRole('button', { name: 'cancel' })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: 'cancel' }));

    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'english' })).toHaveValue('');
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
          language: 'English',
          fromLanguage: 'Hindi',
          sentenceId: 1138910,
          state_region: 'National Capital Territory of Delhi',
          country: 'India',
          type: 'parallel',
        }),
      });
    });
  });

  it('should test the submit button', async () => {
    const url = '/store';
    const successResponse = { success: true };

    await setup(resultData);

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled();

    userEvent.type(screen.getByRole('textbox', { name: 'english' }), 'abcd');

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
          userInput: 'abcd',
          speakerDetails: '{"userName":"abc"}',
          language: 'English',
          fromLanguage: 'Hindi',
          type: 'parallel',
          sentenceId: 1138910,
          state: 'National Capital Territory of Delhi',
          country: 'India',
          device: 'android 11',
          browser: 'Chrome 13',
        }),
      });
    });

    await waitFor(() => expect(screen.getByRole('img', { name: 'check' })).toBeInTheDocument());

    await waitFor(() => expect(screen.queryByRole('img', { name: 'check' })).not.toBeInTheDocument());
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
