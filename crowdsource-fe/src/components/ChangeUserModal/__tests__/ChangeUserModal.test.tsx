import { render, verifyAxeTest } from 'utils/testUtils';

import ChangeUserModal from '../ChangeUserModal';

describe('ChangeUserModal', () => {
  const setup = () => render(<ChangeUserModal show={false} onHide={() => {}} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
