import { screen, userEvent, render } from 'utils/testUtils';

import LanguagePairSelector from '../LanguagePairSelector';

describe('LanguagePairSelector', () => {
  const mockLanguageUpdate = jest.fn();
  const setup = () => {
    return render(
      <LanguagePairSelector
        fromLanguage={undefined}
        toLanguage={undefined}
        updateSelectedLanguages={mockLanguageUpdate}
      />
    );
  };

  it('should render snapshot', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should contain text', () => {
    setup();
    expect(screen.getByLabelText('selectLanguagePairPrompt:')).toBeInTheDocument();
  });

  it('should call callback fn when language selected', async () => {
    setup();
    expect(screen.getByRole('combobox', { name: 'Select From Language' })).toBeInTheDocument();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select From Language' }), 'English');
    expect(mockLanguageUpdate).not.toBeCalled();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select To Language' }), 'Hindi');
    expect(mockLanguageUpdate).toBeCalledWith('English', 'Hindi');
  });

  it('should disable second dropdown when all languages selected in first dropdown', () => {
    setup();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select From Language' }), 'all');
    expect(screen.getByRole('combobox', { name: 'Select To Language' })).toBeDisabled();
  });

  it('should show default languages when all languages selected in second dropdown', async () => {
    setup();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select From Language' }), 'English');
    expect(screen.getByRole('combobox', { name: 'Select To Language' })).toBeEnabled();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select To Language' }), 'Hindi');
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select To Language' }), 'all');
    expect(mockLanguageUpdate).toBeCalledWith(undefined, undefined);
  });

  it('should show all languages when all languages selected in first dropdown', () => {
    setup();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select From Language' }), 'English');
    expect(screen.getByRole('combobox', { name: 'Select From Language' })).toHaveValue('English');
    expect(screen.getByRole('combobox', { name: 'Select To Language' })).toBeEnabled();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select From Language' }), 'all');
    expect(mockLanguageUpdate).toBeCalledWith(undefined, undefined);
  });

  it('should show all languages in second dropdown when first dropdown is changed', () => {
    setup();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select From Language' }), 'English');
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select To Language' }), 'Hindi');
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select From Language' }), 'Bengali');
    expect(screen.getByRole('combobox', { name: 'Select To Language' })).toHaveValue('all');
  });
});
