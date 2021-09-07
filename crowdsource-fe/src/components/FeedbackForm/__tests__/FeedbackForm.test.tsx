import { render, verifyAxeTest } from 'utils/testUtils';

import FeedbackForm from '../FeedbackForm';

describe('FeedbackForm', () => {
  const setup = () => render(<FeedbackForm />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
