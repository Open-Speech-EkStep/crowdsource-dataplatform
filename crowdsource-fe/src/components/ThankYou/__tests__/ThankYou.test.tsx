import { when } from 'jest-when';
import router from 'next/router';

import { render, waitFor, screen } from 'utils/testUtils';

import ThankYou from '../ThankYou';

describe('ThankYou', () => {
  const setup = async (initiative: 'tts' | 'ocr' | 'asr' | 'translation', data: any) => {
    router.asPath = '/tts-initiative/contribute/thank-you';
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
      .calledWith('translatedLanguage')
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
      expect(fetchMock).toBeCalledWith('/rewards?type=asr&language=English&source=contribute&userName=abc', {
        credentials: 'include',
        method: 'GET',
        mode: 'cors',
      });
    });

    return renderResult;
  };

  // verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', async () => {
    const data = {
      badgeId: '',
      badges: [],
      contributionCount: 0,
      currentBadgeType: '',
      isNewBadge: false,
      nextBadgeType: 'Bronze',
      nextMilestone: 5,
    };
    const { asFragment } = await setup('tts', data);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test when no badge earned', async () => {
    const data = {
      badgeId: '',
      badges: [],
      contributionCount: 0,
      currentBadgeType: '',
      isNewBadge: false,
      nextBadgeType: 'Bronze',
      nextMilestone: 5,
    };
    await setup('tts', data);

    expect(screen.getByText('contributeYourLanguage')).toBeInTheDocument();

    expect(screen.getByText('seeParticipationText')).toBeInTheDocument();
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
      currentBadgeType: 'Bronze',
      isNewBadge: true,
      nextBadgeType: 'Bronze',
      nextMilestone: 50,
    };
    await setup('tts', data);

    expect(screen.getByText('congratulationText')).toBeInTheDocument();

    expect(screen.getByText('ttsBadgeEarnedText')).toBeInTheDocument();

    expect(screen.getByText('seeParticipationText')).toBeInTheDocument();
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
      currentBadgeType: 'Bronze',
      isNewBadge: false,
      nextBadgeType: 'Bronze',
      nextMilestone: 50,
    };
    await setup('tts', data);

    expect(screen.getByText('ttsContributedMessage')).toBeInTheDocument();

    expect(screen.getByText('yourBadge')).toBeInTheDocument();

    expect(screen.getByText('contributorAcheived')).toBeInTheDocument();
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
      currentBadgeType: 'Silver',
      isNewBadge: false,
      nextBadgeType: 'Bronze',
      nextMilestone: 100,
    };
    await setup('tts', data);

    expect(screen.getByText('ttsContributedMessage')).toBeInTheDocument();

    expect(screen.getByText('yourBadge')).toBeInTheDocument();

    expect(screen.getByText('contributorAcheived')).toBeInTheDocument();
  });
});
