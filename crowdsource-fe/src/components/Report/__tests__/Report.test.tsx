import { when } from 'jest-when';

import { screen, render, verifyAxeTest, userEvent, waitFor } from 'utils/testUtils';

import Report from '../Report';

describe('Report', () => {
  const setup = async () => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'Hindi');
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => null);
    const result = render(<Report onSuccess={() => {}} initiative="likho" initiativeMediaType="sentences" />);
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
      expect(screen.getByText('reportSubmitSuccess')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('reportSubmitSuccess')).not.toBeInTheDocument();
  });
});
