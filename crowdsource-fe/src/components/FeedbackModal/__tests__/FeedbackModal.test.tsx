import { when } from 'jest-when';

import { screen, render, verifyAxeTest, fireEvent, waitFor } from 'utils/testUtils';

import FeedbackModal from '../FeedbackModal';

describe('FeedbackModal', () => {
  const setup = () => render(<FeedbackModal show={true} onHide={() => {}} onSuccess={() => {}} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should enable submit button on form update of required fields', async () => {
    setup();

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    fireEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  it('should post data with anonymous username on form submit', async () => {
    const language = 'Hindi';
    const module = 'm1';
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);
    when(localStorage.getItem)
      .calledWith('selectedModule')
      .mockImplementation(() => module);
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => null);

    const url = '/feedback';
    const successResponse = { k: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    setup();

    fireEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled());
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opinion_rating: '1',
          category: '',
          feedback: '',
          recommended: '',
          revisit: '',
          email: 'Anonymous',
          language,
          module,
          target_page: '',
        }),
      });
    });

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should post data on form submit', async () => {
    const language = 'Hindi';
    const module = 'm1';
    const userName = 'test';
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);
    when(localStorage.getItem)
      .calledWith('selectedModule')
      .mockImplementation(() => module);
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify({ userName }));

    const url = '/feedback';
    const successResponse = { k: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    setup();

    fireEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled());
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opinion_rating: '1',
          category: '',
          feedback: '',
          recommended: '',
          revisit: '',
          email: userName,
          language,
          module,
          target_page: '',
        }),
      });
    });

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
});
