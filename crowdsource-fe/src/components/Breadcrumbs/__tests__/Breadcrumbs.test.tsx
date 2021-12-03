import { render, verifyAxeTest } from 'utils/testUtils';

import Breadcrumbs from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  const setup = () => render(<Breadcrumbs initiative="suno" path="transcribe" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
