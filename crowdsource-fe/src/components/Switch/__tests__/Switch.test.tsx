import { render, verifyAxeTest } from 'utils/testUtils';

import Switch from '../Switch';

describe('Switch', () => {
  const setup = () => render(<Switch optionOne="optionOne" optionTwo="optionTwo" toggleSwitch={() => {}} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
