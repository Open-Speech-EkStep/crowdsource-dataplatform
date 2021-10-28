import { when } from 'jest-when';

import { render, waitFor, screen, userEvent } from 'utils/testUtils';

import MedalGallery from '../MedalGallery';

describe('MedalGallery', () => {
  const setup = async (
    apiResponse = [
      {
        generated_at: '2021-10-22T12:45:10.744Z',
        generated_badge_id: '25aebf4c-8d74-4bf4-a1d6-8e82b71c8d7c',
        language: 'Bengali',
        milestone: 600,
        type: 'asr',
        category: 'validate',
        grade: 'Platinum',
      },
      {
        generated_at: '2021-10-22T12:45:10.744Z',
        generated_badge_id: '8ae60a75-0cfd-47c9-937b-0fb2560ade13',
        language: 'Bengali',
        milestone: 200,
        type: 'parallel',
        category: 'validate',
        grade: 'Gold',
      },
    ]
  ) => {
    const dummyObj = { userName: 'testUser' };

    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation((): any => dummyObj);

    fetchMock.doMockOnceIf('/user-rewards/testUser').mockResponseOnce(JSON.stringify(apiResponse));

    const renderResult = render(<MedalGallery />);
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/user-rewards/testUser');
    });
    return renderResult;
  };

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

    expect(infoMessage?.innerHTML).toEqual('noBadgeText');
  });

  it('should render the if we click in other initiatives', async () => {
    let scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const { container } = await setup([]);
    userEvent.click(screen.getByRole('tab', { name: 'bolo india' }));

    expect(scrollIntoViewMock).toBeCalled();

    let badgeSectionClass = container.querySelector('[class="fw-light"]');

    expect(badgeSectionClass).toBeNull();

    let infoMessage = container.querySelector('[class="w-100"]');

    expect(infoMessage?.innerHTML).toEqual('noBadgeText');
  });
});
