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

  it('should show default languages when all languages selected in second dropdown', () => {
    setup();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select To Language' }), 'all');
    expect(screen.getByRole('combobox', { name: 'Select To Language' })).toBeDisabled();
  });
});
