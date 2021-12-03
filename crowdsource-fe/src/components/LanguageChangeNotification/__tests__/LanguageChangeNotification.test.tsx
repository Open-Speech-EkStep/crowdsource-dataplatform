import router from 'next/router';

import { render, screen, verifyAxeTest } from 'utils/testUtils';

import LanguageChangeNotification from '../LanguageChangeNotification';

describe('LanguageChangeNotification', () => {
  const setup = (
    props: {
      oldValue: string;
      newValue: string;
      show: boolean;
      onHide: () => void;
    } = {
      oldValue: 'from language',
      newValue: 'to language',
      show: true,
      onHide: () => {},
    }
  ) => {
    router.pathname = '/suno-india/dashboard';
    return render(<LanguageChangeNotification {...props} />);
  };

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    setup();

    expect(screen.getByTestId('Modal')).toMatchSnapshot();
  });
});
