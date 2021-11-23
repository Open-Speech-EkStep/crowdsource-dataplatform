import { render, verifyAxeTest } from 'utils/testUtils';

import ImageBasePath from '../ImageBasePath';

describe('ImageBasePath', () => {
  const setup = () =>
    render(
      <ImageBasePath src="/images/correct.svg" width="24" height="24" alt="Correct Icon"></ImageBasePath>
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
