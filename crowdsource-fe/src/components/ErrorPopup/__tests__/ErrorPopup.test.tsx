import router from 'next/router';

import { render, screen, verifyAxeTest } from 'utils/testUtils';

import ErrorPopup from '../ErrorPopup';

describe('ErrorPopup', () => {
  const setup = (
    props: {
      show: boolean;
      errorMsg: string;
      onHide: () => void;
    } = {
      show: true,
      errorMsg: 'An unexpected error has occured',
      onHide: () => {},
    }
  ) => {
    router.pathname = '/tts-initiative/dashboard';
    return render(<ErrorPopup {...props} />);
  };

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    setup();

    expect(screen.getByTestId('Modal')).toMatchSnapshot();
  });
});
