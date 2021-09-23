import { render, verifyAxeTest } from 'utils/testUtils';

import FeedbackSuccessModal from '../FeedbackSuccessModal';

describe('FeedbackSuccessModal', () => {
  const setup = () => render(<FeedbackSuccessModal show={false} onHide={() => {}} />);

  verifyAxeTest(setup());

  it('should render the component and match it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
