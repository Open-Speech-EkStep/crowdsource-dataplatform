import { render, verifyAxeTest } from 'utils/testUtils';

import PageBackground from '../PageBackground';

describe('PageBackground', () => {
  const setup = () =>
    render(
      <PageBackground image="some-image.svg" size="cover">
        <div>Child Component</div>
      </PageBackground>
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
