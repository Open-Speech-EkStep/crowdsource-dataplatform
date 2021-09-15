import { render, verifyAxeTest } from 'utils/testUtils';

import TermsAndConditionsLink from '../TermsAndConditionsLink';

describe('TermsAndConditionsLink', () => {
  const setup = () => render(<TermsAndConditionsLink />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
