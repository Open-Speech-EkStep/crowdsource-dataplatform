import { render, userEvent, verifyAxeTest, screen } from 'utils/testUtils';

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
        source="contribute"
        winningBadge={[]}
      />
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    userEvent.click(screen.getByRole('button', { name: 'download download-image' }));

    expect(asFragment()).toMatchSnapshot();
  });
});
