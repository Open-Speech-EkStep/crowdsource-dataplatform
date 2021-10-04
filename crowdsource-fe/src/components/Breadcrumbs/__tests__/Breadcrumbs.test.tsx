import { render, verifyAxeTest } from 'utils/testUtils';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';

describe('Breadcrumbs', () => {
  const setup = () => render(<Breadcrumbs />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
