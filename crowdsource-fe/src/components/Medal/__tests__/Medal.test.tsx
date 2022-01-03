import { render, userEvent, waitFor, screen, fireEvent } from 'utils/testUtils';

import Medal from '../Medal';

describe('Medal', () => {
  const mockMedalClick = jest.fn();
  const setup = (
    isOuterComponentPresent: boolean,
    isCallBack: boolean = false,
    props: {
      medal: string;
      action: string;
      initiative: 'tts' | 'asr' | 'translation' | 'ocr';
      language: string;
      selectedMedal?: string | '';
      handleClick?: () => void;
    } = {
      medal: 'testmedal',
      action: 'testaction',
      initiative: 'tts',
      language: 'English',
      selectedMedal: '',
    }
  ) => {
    return isOuterComponentPresent
      ? render(
          isCallBack ? (
            <>
              <Medal {...props} handleClick={mockMedalClick}></Medal>
              <button>Test Button</button>
            </>
          ) : (
            <>
              <Medal {...props}></Medal>
              <button>Test Button</button>
            </>
          )
        )
      : render(<Medal {...props}></Medal>);
  };

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup(false, false);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should not render when clicked outside', async () => {
    const { container } = setup(true, false);

    expect(container.querySelector('.position-absolute')).not.toBeInTheDocument();

    userEvent.click(screen.getByAltText('Medal'));

    await waitFor(() => expect(container.querySelector('.position-absolute')).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: /Test Button/ }));

    await waitFor(() => expect(container.querySelector('.position-absolute')).not.toBeInTheDocument());
  });

  it('should render on keydown', async () => {
    const { container } = setup(true, false);

    expect(container.querySelector('.position-absolute')).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByAltText('Medal'));

    await waitFor(() => expect(container.querySelector('.position-absolute')).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: /Test Button/ }));

    await waitFor(() => expect(container.querySelector('.position-absolute')).not.toBeInTheDocument());
  });

  it('should call callback fn when callback is provided', async () => {
    const { container } = setup(true, true);
    expect(container.querySelector('.active')).not.toBeInTheDocument();

    userEvent.click(screen.getByAltText('Medal'));

    await waitFor(() => expect(mockMedalClick).toBeCalled());
    await waitFor(() => expect(container.querySelector('.active')).toBeInTheDocument());
  });

  it('should not add active class when hasMedalActive parameter is false', async () => {
    const { container } = setup(true, false);

    expect(container.querySelector('.active')).not.toBeInTheDocument();

    userEvent.click(screen.getByAltText('Medal'));

    await waitFor(() => expect(container.querySelector('.active')).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: /Test Button/ }));

    await waitFor(() => expect(container.querySelector('.active')).not.toBeInTheDocument());
  });
});
