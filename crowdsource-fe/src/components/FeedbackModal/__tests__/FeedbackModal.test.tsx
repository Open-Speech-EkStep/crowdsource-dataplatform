import { render, verifyAxeTest } from 'utils/testUtils';

import FeedbackModal from '../FeedbackModal';

describe('FeedbackModal', () => {
  const setup = () => render(<FeedbackModal show={false} onHide={() => {}} />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
