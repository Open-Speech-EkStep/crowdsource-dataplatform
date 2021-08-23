import { axe } from 'jest-axe';

import { render } from 'utils/testUtils';

import Body from '../Body';

describe('Body', () => {
  const setup = () => render(<Body>Hello World</Body>);

  it('should not fail an axe audit', async () => {
    const { container } = setup();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
