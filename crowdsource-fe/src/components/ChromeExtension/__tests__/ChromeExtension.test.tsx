import { render, verifyAxeTest, userEvent, screen, waitFor } from 'utils/testUtils';

import ChromeExtension from '../ChromeExtension';

describe('Chrome Extension', () => {
  const setup = () => render(<ChromeExtension />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test he video modal is open or close', async () => {
    setup();

    userEvent.click(screen.getByRole('button', { name: 'Watch Video' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));
  });
});
