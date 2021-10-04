import { render } from 'utils/testUtils';

import SunoTranscribe from '../SunoTranscribe';

describe('SunoTranscribe', () => {
  const setup = () => render(<SunoTranscribe />);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
