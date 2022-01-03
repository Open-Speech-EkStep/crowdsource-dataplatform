import { render, verifyAxeTest } from 'utils/testUtils';

import PageHeader from '../PageHeader';

describe('PageHeadeer', () => {
  const setup = () => render(<PageHeader initiative="tts" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
