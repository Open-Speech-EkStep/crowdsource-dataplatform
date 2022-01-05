import { fireEvent, render, screen, userEvent, verifyAxeTest, waitFor } from 'utils/testUtils';

import Navigation from '../Navigation';

describe('Navigation', () => {
  const setup = () =>
    render(
      <>
        <Navigation />
        <button>Test Button</button>
      </>
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should handle navbar toggle behaviour', async () => {
    const { container } = setup();

    expect(container.querySelector('.navbar-collapse')).not.toHaveClass('show');

    userEvent.click(screen.getByRole('button', { name: /Toggle navigation/ }));

    await waitFor(() => expect(container.querySelector('.navbar-collapse')).toHaveClass('show'));

    userEvent.click(screen.getByRole('button', { name: /Toggle navigation/ }));

    await waitFor(() => expect(container.querySelector('.navbar-collapse')).not.toHaveClass('show'));
  });

  it('should collapse when clicked outside', async () => {
    const { container } = setup();

    expect(container.querySelector('.navbar-collapse')).not.toHaveClass('show');

    userEvent.click(screen.getByRole('button', { name: /Toggle navigation/ }));

    await waitFor(() => expect(container.querySelector('.navbar-collapse')).toHaveClass('show'));

    userEvent.click(screen.getByRole('button', { name: /Test Button/ }));

    await waitFor(() => expect(container.querySelector('.navbar-collapse')).not.toHaveClass('show'));
  });

  it('should collapse when page is scrolling', async () => {
    const { container } = setup();

    expect(container.querySelector('.navbar-collapse')).not.toHaveClass('show');

    userEvent.click(screen.getByRole('button', { name: /Toggle navigation/ }));

    await waitFor(() => expect(container.querySelector('.navbar-collapse')).toHaveClass('show'));

    fireEvent.scroll(document, { target: { scrollY: 100 } });

    await waitFor(() => expect(container.querySelector('.navbar-collapse')).not.toHaveClass('show'));
  });
});
