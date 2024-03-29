import { when } from 'jest-when';
import router from 'next/router';

import { screen, render, verifyAxeTest, userEvent, waitFor } from 'utils/testUtils';

import FeedbackModal from '../FeedbackModal';

describe('FeedbackModal', () => {
  const setup = () =>
    render(<FeedbackModal show={true} onHide={() => {}} onError={() => {}} onSuccess={() => {}} />);

  verifyAxeTest(setup());

  it('should enable submit button on form update of required fields', async () => {
    setup();

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    userEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  it('should post data with anonymous username on form submit', async () => {
    const language = 'Hindi';
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => null);

    const url = '/feedback';
    const successResponse = { k: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));
    await router.push('/home');

    setup();

    userEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled());
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opinion_rating: '1',
          category: '',
          feedback: '',
          recommended: '',
          revisit: '',
          email: 'Anonymous',
          language,
          module: 'Others',
          target_page: 'Home Page',
        }),
      });
    });

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should post data on form submit', async () => {
    const language = 'Hindi';
    const userName = 'test';

    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify({ userName }));

    const url = '/feedback';
    const successResponse = { k: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));
    await router.push('/home');

    setup();

    userEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled());
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opinion_rating: '1',
          category: '',
          feedback: '',
          recommended: '',
          revisit: '',
          email: userName,
          language,
          module: 'Others',
          target_page: 'Home Page',
        }),
      });
    });

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
});
