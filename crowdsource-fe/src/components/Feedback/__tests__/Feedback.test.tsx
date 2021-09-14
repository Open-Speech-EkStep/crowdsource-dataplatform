import { screen, render, verifyAxeTest, fireEvent, waitFor } from 'utils/testUtils';

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

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should open feedback if button clicked', async () => {
    await setup();

    fireEvent.click(screen.getByRole('button', { name: 'feedbackIconAlt' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should show success modal if feedback submitted', async () => {
    const url = '/feedback';
    const successResponse = { k: 'response' };

    await setup();

    fireEvent.click(screen.getByRole('button', { name: 'feedbackIconAlt' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fetchMock.doMockOnceIf(url).mockResponseOnce(JSON.stringify(successResponse));

    fireEvent.click(screen.getAllByRole('radio')[0]);

    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText('submitSuccess')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('submitSuccess')).not.toBeInTheDocument();
  });
});
