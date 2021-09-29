import { render } from 'utils/testUtils';

import ViewAllDetailButton from '../ViewAllDetailButton';

describe('ViewAll Detail', () => {
  const setup = () => {
    return render(<ViewAllDetailButton initiative="suno" />);
  };

  it('should render the view all detail button', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
