/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen, userEvent } from 'utils/testUtils';

import SunoIndiaActions from '../SunoIndiaActions';

describe('Suno Actions', () => {
  const setup = () => {
    return render(<SunoIndiaActions />);
  };

  it('should render the suno india homepage', () => {
    setup();

    expect(screen.getByTestId('ContributionActions')).toBeInTheDocument();
  });

  it('should select the contribution language', async () => {
    await setup();

    userEvent.selectOptions(screen.getByTestId('select'), 'हिंदी');

    expect(screen.getByRole('combobox', { name: 'Select the language for contribution' })).toHaveValue(
      'Hindi'
    );
    expect(localStorage.setItem).toHaveBeenCalledWith('contributionLanguage', 'Hindi');

    expect(screen.getAllByTestId('ActionCardWarningMessage')[1]).toHaveClass('cardWarning');
  });
});
