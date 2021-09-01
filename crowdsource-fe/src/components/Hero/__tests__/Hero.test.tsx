import Hero from 'components/Hero';
import { render, verifyAxeTest } from 'utils/testUtils';

describe('Hero', () => {
  const setup = () => render(<Hero />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
