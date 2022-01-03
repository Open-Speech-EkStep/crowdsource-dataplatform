import { when } from 'jest-when';
import router from 'next/router';

import { render, verifyAxeTest, screen, userEvent, waitFor } from 'utils/testUtils';

import ReportModal from '../ReportModal';

describe('ReportModal', () => {
  const setup = () => {
    router.asPath = '/tts-initiative/contribute';
    return render(
      <ReportModal
        show={true}
        onHide={() => {}}
        onSuccess={() => {}}
        reportSubheadingText="asrContributeReportModalSubHeading"
        initiative="tts"
        onError={() => {}}
      />
    );
  };

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

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

    const url = '/report';
    const successResponse = { k: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));
    await router.push('/tts-initiative/contribute');

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
          language: 'Hindi',
          reportText: 'Offensive',
          sentenceId: 1993205,
          source: 'contribution',
          userName: 'Anonymous',
        }),
      });
    });

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should post data on report form submit', async () => {
    const language = 'Hindi';
    const userName = 'XYZ';

    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify({ userName }));

    const url = '/report';
    const successResponse = { k: 'response' };

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));
    await router.push('/tts-initiative/contribute');

    setup();

    userEvent.click(screen.getAllByRole('radio')[0]);

    const inputEl = screen.getByTestId('report-textarea');
    userEvent.type(inputEl, 'Dummy Text');

    expect(inputEl).toHaveValue('Dummy Text');

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
          language: 'Hindi',
          reportText: 'Offensive - Dummy Text',
          sentenceId: 1993205,
          source: 'contribution',
          userName: 'XYZ',
        }),
      });
    });

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
});
