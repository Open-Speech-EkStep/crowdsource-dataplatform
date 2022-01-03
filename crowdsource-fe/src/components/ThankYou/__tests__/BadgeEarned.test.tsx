import { render, userEvent, verifyAxeTest, screen } from 'utils/testUtils';

import BadgeEarned from '../BadgeEarned';

describe('BadgeEarned', () => {
  const setup = (language: any, rank: any) =>
    render(
      <BadgeEarned
        initiative="tts"
        badgeType="Bronze"
        contributionCount={5}
        language={language}
        source="contribute"
        winningBadge={[]}
        rank={rank}
      />
    );

  verifyAxeTest(setup('Hindi', 2));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('Hindi', 2);

    userEvent.click(screen.getByRole('button', { name: 'download download-image' }));

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the component without language and matches it against stored snapshot', () => {
    const { asFragment } = setup(undefined, undefined);

    userEvent.click(screen.getByRole('button', { name: 'download download-image' }));

    expect(asFragment()).toMatchSnapshot();
  });
});
