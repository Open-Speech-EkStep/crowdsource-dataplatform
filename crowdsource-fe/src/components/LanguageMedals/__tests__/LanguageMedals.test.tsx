import { render, verifyAxeTest } from 'utils/testUtils';

import LanguageMedals from '../LanguageMedals';

describe('LanguageMedals', () => {
  const setup = (
    props: {
      initiative: string;
      language: string;
      languageBadges: any;
    } = {
      initiative: 'title',
      language: 'subTitle',
      languageBadges: [
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
          generated_badge_id: '25aebf4c-8d74-4bf4-a1d6-8e82b71c8d7c',
          language: 'English',
          milestone: 600,
          type: 'asr',
          category: 'contribute',
          grade: 'Bronze',
        },
      ],
    }
  ) => render(<LanguageMedals {...props}></LanguageMedals>);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment).toMatchSnapshot();
  });
});
