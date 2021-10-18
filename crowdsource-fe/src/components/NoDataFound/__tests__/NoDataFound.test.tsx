import { render, verifyAxeTest, screen } from 'utils/testUtils';

import NoDataFound from '../NoDataFound';

describe('NoDataFound', () => {
  const setup = () => render(<NoDataFound url="/some-url" initiative="suno" language="Hindi" />);

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the valid text', () => {
    setup();

    expect(screen.getByText('thankyouForEnthusiasm')).toBeInTheDocument();
  });
});
