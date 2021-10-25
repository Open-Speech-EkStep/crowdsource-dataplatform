import { render, verifyAxeTest } from 'utils/testUtils';

import BadgeEarned from '../BadgeEarned';

describe('BadgeEarned', () => {
  const setup = () =>
    render(
      <BadgeEarned
        initiative="suno"
        badgeType="Bronze"
        contributionCount={5}
        pageMediaTypeStr="seentence (s)"
        language="Hindi"
      />
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
