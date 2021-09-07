import '__fixtures__/mockComponentsWithSideEffects';
import { render, verifyAxeTest } from 'utils/testUtils';

import Stats from '../Stats';

describe('Stats', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const setup = () => {
    const statsContents: Array<{ id: string; stat: string | null; label: string }> = [
      { id: '1', stat: 'a', label: 'l1' },
      { id: '2', stat: 'b', label: 'l2' },
    ];

    const renderResult = render(<Stats contents={statsContents} />);

    return renderResult;
  };

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
