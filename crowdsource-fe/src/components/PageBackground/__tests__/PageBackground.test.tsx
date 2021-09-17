import { render, verifyAxeTest } from 'utils/testUtils';

import PageBackground from '../PageBackground';

describe('PageBackground', () => {
  const setup = () => render(<PageBackground />);

  verifyAxeTest(setup());
});
