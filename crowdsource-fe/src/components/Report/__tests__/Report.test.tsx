import { when } from 'jest-when';
import router from 'next/router';

import { screen, render, verifyAxeTest, userEvent, waitFor } from 'utils/testUtils';

import Report from '../Report';

describe('Report', () => {
  const setup = async () => {
    router.asPath = '/tts-initiative/contribute';
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => null);
    const result = render(<Report onSuccess={() => {}} initiative="translation" action="contribute" />);
    return result;
  };

  async () => {
    verifyAxeTest(await setup());
  };

  it('should open report modal if button clicked', async () => {
    await setup();

    userEvent.click(screen.getByRole('button', { name: 'reportIconAlt report' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should show success modal if report submitted', async () => {
    const url = '/report';
    const successResponse = { k: 'response' };

    await setup();

    userEvent.click(screen.getByRole('button', { name: 'reportIconAlt report' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    userEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText('translationReportSubmitSuccess')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('translationReportSubmitSuccess')).not.toBeInTheDocument();
  });

  it('should show error popup when api returns error', async () => {
    const url = '/report';
    const errorResponse = new Error('Some error');

    await setup();

    userEvent.click(screen.getByRole('button', { name: 'reportIconAlt report' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);

    userEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

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
});
