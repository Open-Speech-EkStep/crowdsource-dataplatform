import type { ReactNode } from 'react';

import { render, verifyAxeTest, screen } from 'utils/testUtils';

import BadgeSection from '../BadgeSection';

describe('BadgeSection', () => {
  const setup = (
    props: {
      initiative: string;
      languages: Array<string>;
    } = {
      initiative: 'test',
      languages: ['en', 'hi'],
    }
  ) => render(<BadgeSection {...props}></BadgeSection>);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment).toMatchSnapshot();
    expect(screen.getByText('Contribution')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
  });
});
