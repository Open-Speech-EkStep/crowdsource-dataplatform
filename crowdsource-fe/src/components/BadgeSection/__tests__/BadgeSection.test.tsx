import { render, verifyAxeTest, screen } from 'utils/testUtils';

import BadgeSection from '../BadgeSection';

describe('BadgeSection', () => {
  const setup = (
    props: {
      initiative: string;
      initiativeBadge: Array<any>;
    } = {
      initiative: 'test',
      initiativeBadge: [
        {
          asr: [
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
          ],
        },
      ],
    }
  ) => render(<BadgeSection {...props}></BadgeSection>);
  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment).toMatchSnapshot();
    expect(screen.getByText('contribution')).toBeInTheDocument();
    expect(screen.getByText('validation')).toBeInTheDocument();
  });
});
