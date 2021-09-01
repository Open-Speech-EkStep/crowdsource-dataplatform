import PageBackground from 'components/PageBackground/PageBackground';
import { render, verifyAxeTest } from 'utils/testUtils';

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
