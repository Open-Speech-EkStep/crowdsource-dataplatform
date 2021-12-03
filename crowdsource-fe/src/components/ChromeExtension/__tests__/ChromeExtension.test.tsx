import { render, verifyAxeTest, userEvent, screen, waitFor } from 'utils/testUtils';

import ChromeExtension from '../ChromeExtension';

describe('Chrome Extension', () => {
  const setup = () => render(<ChromeExtension />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the video modal is open or close', async () => {
    setup();

    userEvent.click(screen.getByRole('button', { name: 'watchTheVideo' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: 'Close' }));
  });

  it('should test the chrome extension is open or close', async () => {
    setup();

    expect(screen.getByTestId('ChromeExtension')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Close Chrome Extension' }));
    await waitFor(() => {
      expect(screen.queryByText('Watch the video')).not.toBeInTheDocument();
    });
  });
});
