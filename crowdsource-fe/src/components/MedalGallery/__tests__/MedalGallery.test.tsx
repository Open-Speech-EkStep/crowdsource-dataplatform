import { when } from 'jest-when';

import { render, waitFor } from 'utils/testUtils';

import MedalGallery from '../MedalGallery';

describe('MedalGallery', () => {
  const setup = async (apiResponse= [
    {
      badge: 'test',
      type: 'asr',
    },
  ]) => {
    const dummyObj = { userName: 'testUser' };

    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation((): any => dummyObj);

    fetchMock.doMockOnceIf('/user-rewards/testUser').mockResponseOnce(
      JSON.stringify(apiResponse)
    );

    const renderResult = render(<MedalGallery />);
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/user-rewards/testUser');
    });
    return renderResult;
  };


  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the userName', async () => {
    const { container } = await setup();

    let usernameContainer = container.querySelector('[class="highlight"]');

    expect(usernameContainer?.innerHTML).toEqual('testUser');
  });

  it('should not render the badgeSection if userBadges is empty', async () => {
    const { container } = await setup([]);

    let badgeSectionClass = container.querySelector('[class="fw-light"]');

    expect(badgeSectionClass).toBeNull();
  });

  it('should render the badgeSection if userBadges is not empty', async () => {
    const { container } = await setup();

    let badgeSectionClass = container.querySelector('[class="fw-light"]');

    expect(badgeSectionClass).not.toBeNull();
  });

  it('should not render the badgeSection if userBadges is empty and show info message', async () => {
    const { container } = await setup([]);

    let badgeSectionClass = container.querySelector('[class="fw-light"]');

    expect(badgeSectionClass).toBeNull();

    let infoMessage = container.querySelector('[class="w-100"]');

    expect(infoMessage?.innerHTML).toEqual('No badge earned for suno India');
  });
});
