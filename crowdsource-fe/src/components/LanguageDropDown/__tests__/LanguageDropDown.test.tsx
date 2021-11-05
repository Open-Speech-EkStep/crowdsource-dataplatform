/* eslint-disable import/no-internal-modules */
import '__fixtures__/mockComponentsWithSideEffects';

import { render, screen, userEvent } from 'utils/testUtils';

import LanguageDropDown from '../LanguageDropDown';

describe('Badges', () => {
  const mockLanguageUpdate = jest.fn();
  const setup = (language: string) => {
    return render(
      <LanguageDropDown selectedLanguage={language} updateSelectedLanguage={mockLanguageUpdate} />
    );
  };

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('english');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should contain text', () => {
    setup('English');
    expect(screen.getByLabelText('selectDropDownLanguagePrompt:')).toBeInTheDocument();
  });

  it('should call callback fn when language selected', async () => {
    setup('English');
    expect(screen.getByTestId('SelectDropDownLanguage')).toBeInTheDocument();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Your Language' }), 'English');
    expect(mockLanguageUpdate).toBeCalledWith('English');
  });

  it('should select the "Assamese" language', async () => {
    setup('Assamese');

    userEvent.selectOptions(screen.getByTestId('SelectDropDownLanguage'), 'অসমীয়া');

    expect(screen.getByRole('combobox', { name: 'Your Language' })).toHaveValue('Assamese');
  });
});
