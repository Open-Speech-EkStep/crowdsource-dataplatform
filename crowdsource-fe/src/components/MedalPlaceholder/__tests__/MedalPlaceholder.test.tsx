import { render, verifyAxeTest, screen } from 'utils/testUtils';

import MedalPlaceholder from '../MedalPlaceholder';

describe('MedalPlaceholder', () => {
  const setup = () => render(<MedalPlaceholder medal="testmedal" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the given medal name', () => {
    setup();
    expect(screen.getByText('testmedal')).toBeInTheDocument();
  });
});
