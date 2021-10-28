import router from 'next/router';

import { render, verifyAxeTest, userEvent, screen } from 'utils/testUtils';

import ContributeMore from '../ContributeMore';

describe('ContributeMore', () => {
  const setup = (
    initiative: string,
    source: string,
    nextMileStone: number,
    contributionCount: number,
    nextBadgeType: string,
    badgeType: string
  ) => {
    router.asPath = '/sunoIndia/thank-you';
    const badgeData = [
      {
        generated_badge_id: '4e614ac7-11d8-4126-a3ad-0540fbb4430e',
        grade: 'Bronze',
      },
      {
        generated_badge_id: '4e614ac7-11d8-4126-a3ad-0540fbb44323',
        grade: 'Silver',
      },
      {
        generated_badge_id: '4e614ac7-11d8-4126-a3ad-0540fbb44356',
        grade: 'Gold',
      },
      {
        generated_badge_id: '4e614ac7-11d8-4126-a3ad-0540fbb443124',
        grade: 'Platinum',
      },
    ];
    return render(
      <ContributeMore
        initiative={initiative}
        source={source}
        nextMileStone={nextMileStone}
        contributionCount={contributionCount}
        nextBadgeType={nextBadgeType}
        url=""
        pageMediaTypeStr="sentence(s)"
        badges={badgeData}
        isTopLanguage="see"
        badgeType={badgeType}
      />
    );
  };

  verifyAxeTest(setup('suno', 'contribute', 5, 0, 'Bronze', 'Bronze'));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('suno', 'contribute', 5, 0, 'Bronze', 'Bronze');

    expect(asFragment()).toMatchSnapshot();
  });

  it('after user earn the platinum badge and should download all the badges', () => {
    setup('suno', 'contribute', 200, 0, 'Platinum', 'Platinum');

    userEvent.click(screen.getByRole('img', { name: 'bronzeDownload' }));

    userEvent.click(screen.getByRole('img', { name: 'silverDownload' }));

    userEvent.click(screen.getByRole('img', { name: 'goldDownload' }));

    userEvent.click(screen.getByRole('img', { name: 'platinumDownload' }));

    expect(screen.getByText('seeContributeText')).toBeInTheDocument();
  });
});
