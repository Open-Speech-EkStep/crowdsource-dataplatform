import { screen, render, verifyAxeTest, userEvent, waitFor } from 'utils/testUtils';

import Feedback from '../Feedback';

describe('Feedback', () => {
  const setup = async () => {
    const result = render(<Feedback />);
    await screen.findByRole('button', { name: 'feedbackIconAlt' });
    return result;
  };

  async () => {
    verifyAxeTest(await setup());
  };

  it('should open feedback if button clicked', async () => {
    await setup();

    userEvent.click(screen.getByRole('button', { name: 'feedbackIconAlt' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should show success modal if feedback submitted', async () => {
    const url = '/feedback';
    const successResponse = { k: 'response' };

    await setup();

    userEvent.click(screen.getByRole('button', { name: 'feedbackIconAlt' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    userEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText('submitSuccess')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('submitSuccess')).not.toBeInTheDocument();
  });

  it('should show error popup when api returns error', async () => {
    const url = '/feedback';
    const errorResponse = new Error('Some error');

    await setup();

    userEvent.click(screen.getByRole('button', { name: 'feedbackIconAlt' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fetchMock.doMockOnceIf(url).mockRejectOnce(errorResponse);

    userEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    expect(screen.queryByText('submitSuccess')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('apiFailureError')).toBeInTheDocument();
    });

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'proceed' }));
    });

    await waitFor(() => {
      expect(screen.queryByText('apiFailureError')).not.toBeInTheDocument();
    });
  });
});
