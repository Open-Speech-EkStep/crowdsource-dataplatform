import { render, userEvent, verifyAxeTest, screen } from 'utils/testUtils';

import ImageView from '../ImageView';

describe('IconTextButton', () => {
  const setup = () => render(<ImageView imageUrl="picsum/photos.png" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should expand view and close when button clicked', async () => {
    setup();

    expect(screen.getByRole('button', { name: 'expandViewText' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'expandViewText' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('expandedView')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByTestId('expandedView')).not.toBeInTheDocument();
  });
});
