import { when } from 'jest-when';

import { render, verifyAxeTest } from 'utils/testUtils';

import Header from '../Header';

describe('Header', () => {
  const setup = () => {
    const speakerDetails = {
      gender: 'male',
      age: '',
      motherTongue: 'Hindi',
      userName: 'abcd',
      language: 'Hindi',
      toLanguage: '',
    };
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify(speakerDetails));

    return render(<Header />);
  };

  verifyAxeTest(() => setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
