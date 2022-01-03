import { render, screen, verifyAxeTest } from 'utils/testUtils';

import Portal from '../Portal';

describe('Portal', () => {
  const setup = () =>
    render(
      <Portal>
        <div>test</div>
      </Portal>
    );

  verifyAxeTest(setup());

  it('should show the children inside the portal', () => {
    setup();
    expect(screen.getByText('test')).toBeTruthy();
  });
});
