import { render, verifyAxeTest } from 'utils/testUtils';

import FeedbackSuccessModal from '../FeedbackSuccessModal';

describe('FeedbackModal', () => {
  const setup = () => render(<FeedbackSuccessModal show={false} onHide={() => {}} />);

  verifyAxeTest(setup());
});
