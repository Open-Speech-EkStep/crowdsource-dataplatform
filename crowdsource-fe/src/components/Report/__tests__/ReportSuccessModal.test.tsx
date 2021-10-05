import { render, verifyAxeTest } from 'utils/testUtils';

import ReportSuccessModal from '../ReportSuccessModal';

describe('ReportSuccessModal', () => {
  const setup = () => render(<ReportSuccessModal show={false} onHide={() => {}} />);

  verifyAxeTest(setup());

  it('should render the component and match it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
