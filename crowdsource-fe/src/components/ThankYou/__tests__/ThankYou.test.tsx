import { when } from 'jest-when';
import router from 'next/router';

import { render, waitFor, screen } from 'utils/testUtils';

import ThankYou from '../ThankYou';

describe('ThankYou', () => {
  const setup = async (initiative: 'suno' | 'dekho' | 'bolo' | 'likho', data: any) => {
    router.asPath = '/sunoIndia/thank-you';
    const speakerDetails = {
      userName: 'abc',
      motherTongue: '',
      age: '',
      gender: '',
      language: 'Hindi',
      toLanguage: '',
    };

    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify(speakerDetails));

    const language = 'English';

    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => language);

    when(localStorage.getItem)
      .calledWith('likho_to-language')
      .mockImplementation(() => 'Hindi');

    fetchMock
      .doMockIf('/rewards?type=asr&language=English&source=contribute&userName=abc')
      .mockResponse(JSON.stringify(data));

    const renderResult = render(<ThankYou initiative={initiative} />);

    await waitFor(() => {
      expect(localStorage.getItem).toBeCalledWith('contributionLanguage');
    });
    await waitFor(() => {
      expect(localStorage.getItem).toBeCalledWith('speakerDetails');
    });

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/rewards?type=asr&language=English&source=contribute&userName=abc');
    });

    return renderResult;
  };

  // verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', async () => {
    const data = {
      badgeId: '',
      badges: [],
      contributionCount: 0,
      currentAmount: 0.072,
      currentBadgeType: '',
      currentMilestone: 5,
      isNewBadge: false,
      languageGoal: 5,
      nextBadgeType: 'Bronze',
      nextMilestone: 5,
      sequence: '1st',
    };
    const { asFragment } = await setup('suno', data);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test when no badge earned', async () => {
    const data = {
      badgeId: '',
      badges: [],
      contributionCount: 0,
      currentAmount: 0.072,
      currentBadgeType: '',
      currentMilestone: 0,
      isNewBadge: false,
      languageGoal: 5,
      nextBadgeType: 'Bronze',
      nextMilestone: 5,
      sequence: '1st',
    };
    await setup('suno', data);

    expect(screen.getByText('Contribute to your language!')).toBeInTheDocument();

    expect(screen.getByText('Participate to see English in top 3')).toBeInTheDocument();
  });

  it('should test when user earned the badge', async () => {
    const data = {
      badgeId: '',
      badges: [
        {
          generated_badge_id: 'de68ee51-d018-4b20-ba90-1d608bd35eda',
          grade: 'Bronze',
        },
      ],
      contributionCount: 5,
      currentAmount: 0.072,
      currentBadgeType: 'Bronze',
      currentMilestone: 5,
      isNewBadge: true,
      languageGoal: 5,
      nextBadgeType: 'Bronze',
      nextMilestone: 50,
      sequence: '1st',
    };
    await setup('suno', data);

    expect(screen.getByText('Congratulations on winning a new badge!')).toBeInTheDocument();

    expect(screen.getByText('Bronze Bhasha Samarthak')).toBeInTheDocument();

    expect(screen.getByText('Participate to see English in top 3')).toBeInTheDocument();
  });

  it('should test after user earned the badge', async () => {
    const data = {
      badgeId: '',
      badges: [
        {
          generated_badge_id: 'de68ee51-d018-4b20-ba90-1d608bd35eda',
          grade: 'Bronze',
        },
      ],
      contributionCount: 6,
      currentAmount: 0.072,
      currentBadgeType: 'Bronze',
      currentMilestone: 5,
      isNewBadge: false,
      languageGoal: 5,
      nextBadgeType: 'Bronze',
      nextMilestone: 50,
      sequence: '2nd',
    };
    await setup('suno', data);

    expect(screen.getByText('You contributed 6 sentence(s) for your language!')).toBeInTheDocument();

    expect(screen.getByText('Your Badge')).toBeInTheDocument();

    expect(screen.getByText('Bronze contributor')).toBeInTheDocument();
  });

  it('should test after user earned the silver badge', async () => {
    const data = {
      badgeId: '',
      badges: [
        {
          generated_badge_id: 'de68ee51-d018-4b20-ba90-1d608bd35eda',
          grade: 'Bronze',
        },
        {
          generated_badge_id: 'de68ee51-d018-4b20-ba90-1d608bd35eda',
          grade: 'Silver',
        },
      ],
      contributionCount: 60,
      currentAmount: 0.072,
      currentBadgeType: 'Silver',
      currentMilestone: 50,
      isNewBadge: false,
      languageGoal: 5,
      nextBadgeType: 'Bronze',
      nextMilestone: 100,
      sequence: '3rd',
    };
    await setup('suno', data);

    expect(screen.getByText('You contributed 60 sentence(s) for your language!')).toBeInTheDocument();

    expect(screen.getByText('Your Badge')).toBeInTheDocument();

    expect(screen.getByText('Silver contributor')).toBeInTheDocument();
  });
});
