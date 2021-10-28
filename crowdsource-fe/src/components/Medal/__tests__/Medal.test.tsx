import { render, userEvent, waitFor, screen, fireEvent } from 'utils/testUtils';

import Medal from '../Medal';

describe('Medal', () => {
  const setup = (
    flag: boolean,
    props: {
      medal: string;
      action: string;
      initiative: string;
      language: string;
    } = {
      medal: 'testmedal',
      action: 'testaction',
      initiative: 'initiative',
      language: 'language',
    }
  ) =>
    flag
      ? render(<Medal {...props}></Medal>)
      : render(
          <>
            <Medal {...props}></Medal>
            <button>Test Button</button>
          </>
        );

  // setup(true);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup(true);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should not render when clicked outside', async () => {
    const { container } = setup(false);

    expect(container.querySelector('.position-absolute')).not.toBeInTheDocument();

    userEvent.click(screen.getByAltText('Medal'));

    await waitFor(() => expect(container.querySelector('.position-absolute')).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: /Test Button/ }));

    await waitFor(() => expect(container.querySelector('.position-absolute')).not.toBeInTheDocument());
  });

  it('should render on keydown', async () => {
    const { container } = setup(false);

    expect(container.querySelector('.position-absolute')).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByAltText('Medal'));

    await waitFor(() => expect(container.querySelector('.position-absolute')).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: /Test Button/ }));

    await waitFor(() => expect(container.querySelector('.position-absolute')).not.toBeInTheDocument());
  });
});
