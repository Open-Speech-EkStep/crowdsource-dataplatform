import { render } from 'utils/testUtils';

import ViewAllDetailButton from '../ViewAllDetailButton';

describe('ViewAllDetailButton', () => {
  const setup = () => {
    return render(<ViewAllDetailButton initiative="tts" />);
  };

  it('should render the view all detail button', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
