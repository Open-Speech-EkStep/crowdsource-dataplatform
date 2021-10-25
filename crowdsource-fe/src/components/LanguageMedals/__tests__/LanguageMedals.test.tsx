import type { ReactNode } from 'react';

import { render, verifyAxeTest, screen } from 'utils/testUtils';

import LanguageMedals from '../LanguageMedals';

describe('LanguageMedals', () => {
  const setup = (
    props: {
      initiative: string;
      language: string;
    } = {
      initiative: 'title',
      language: 'subTitle',
    }
  ) => render(<LanguageMedals {...props}></LanguageMedals>);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment).toMatchSnapshot();
  });
});
