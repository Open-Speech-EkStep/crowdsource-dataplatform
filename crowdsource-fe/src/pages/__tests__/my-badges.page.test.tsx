import { when } from 'jest-when';

import { render, screen, waitFor } from 'utils/testUtils';

import MyBadgesPage from '../my-badges.page';

describe('MyBadgesPage', () => {
  const dummyObj = { userName: 'test' };
  const setup = async () => {
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation((): any => dummyObj);

    fetchMock.doMockOnceIf('/user-rewards/test').mockResponseOnce(
      JSON.stringify([
        {
          badge: 'test',
          type: 'asr',
        },
      ])
    );

    const renderResult = render(<MyBadgesPage />);
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/user-rewards/test');
    });
    return renderResult;
  };

  it('should render the MyBadgesPage', () => {
    render(<MyBadgesPage />);

    expect(screen.getByText('Your Medal Gallery')).toBeInTheDocument();
    expect(screen.getByText('likho india')).toBeInTheDocument();
    expect(screen.getByText('suno india')).toBeInTheDocument();
    expect(screen.getByText('dekho india')).toBeInTheDocument();
    expect(screen.getByText('bolo india')).toBeInTheDocument();
  });
  it('should call local storage while rendering', async () => {
    const { asFragment } = await setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render functional page background', async () => {
    await setup();
    expect(screen.getByTestId('FunctionalPageBackground')).toBeInTheDocument();
  });
});
