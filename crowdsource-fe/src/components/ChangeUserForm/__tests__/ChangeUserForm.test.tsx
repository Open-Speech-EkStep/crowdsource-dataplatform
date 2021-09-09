import { render, verifyAxeTest } from 'utils/testUtils';

import ChangeUserForm from '../FeedbackForm';

describe('FeedbackForm', () => {
  const setup = () => render(<ChangeUserForm />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
