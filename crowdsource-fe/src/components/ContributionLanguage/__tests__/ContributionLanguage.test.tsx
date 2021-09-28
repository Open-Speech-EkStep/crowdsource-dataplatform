/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen, userEvent } from 'utils/testUtils';

import ContributionLanguage from '../ContributionLanguage';

describe('Suno Actions', () => {
  const setup = () => {
    return render(<ContributionLanguage />);
  };

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should select the contribution language', async () => {
    setup();

    userEvent.selectOptions(screen.getByTestId('select'), 'हिंदी');

    expect(screen.getByRole('combobox', { name: 'Select the language for contribution' })).toHaveValue(
      'Hindi'
    );
    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'Hindi');
  });
});
