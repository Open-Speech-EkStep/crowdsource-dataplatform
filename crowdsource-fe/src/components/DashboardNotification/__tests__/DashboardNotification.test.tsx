import { render, verifyAxeTest, screen } from 'utils/testUtils';

import DashboardNotification from '../DashboardNotification';

describe('DashboardNotification', () => {
  const spyFn = jest.fn().mockReturnValue({
    style: {
      width: '50%',
    },
  });
  global.document.getElementById = spyFn;

  const setup = () => {
    return render(<DashboardNotification text="some-text" buttonLabel="Contribute Now" onClick={() => {}} />);
  };

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the valid text', () => {
    setup();

    expect(screen.getByText('some-text')).toBeInTheDocument();
  });

  it('should give width hundred percent to floated element', () => {
    setup();
    const obj = spyFn();
    expect(spyFn).toHaveBeenCalledWith('float');
    expect(obj.style.width).toBe('100%');
  });
});
