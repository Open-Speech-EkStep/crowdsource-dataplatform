import { render, verifyAxeTest, screen } from 'utils/testUtils';

import Button from '../Button';

describe('Button', () => {
  const setup = (type: 'primary' | 'secondary' | 'tertiary' | 'normal') =>
    render(<Button variant={type}>some text</Button>);

  verifyAxeTest(setup('normal'));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('normal');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the primary button', () => {
    setup('primary');

    expect(screen.getByTestId('Button')).toHaveClass('btn-primary');
  });

  it('should render the secondary button', () => {
    setup('secondary');

    expect(screen.getByTestId('Button')).toHaveClass('btn-light');
  });

  it('should render the tertiary button', () => {
    setup('tertiary');

    expect(screen.getByTestId('Button')).toHaveClass('btn-transparent');
  });
});
