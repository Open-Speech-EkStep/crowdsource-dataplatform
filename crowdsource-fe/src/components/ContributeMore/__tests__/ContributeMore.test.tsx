import { render, verifyAxeTest } from 'utils/testUtils';

import ContributeMore from '../ContributeMore';

describe('ContributeMore', () => {
  const setup = (
    initiative: string,
    source: string,
    nextMileStone: number,
    contributionCount: number,
    nextBadgeType: string
  ) =>
    render(
      <ContributeMore
        initiative={initiative}
        source={source}
        nextMileStone={nextMileStone}
        contributionCount={contributionCount}
        nextBadgeType={nextBadgeType}
        url=""
        pageMediaTypeStr="sentence(s)"
      />
    );

  verifyAxeTest(setup('suno', 'contribute', 5, 0, 'Bronze'));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('suno', 'contribute', 5, 0, 'Bronze');

    expect(asFragment()).toMatchSnapshot();
  });
});
