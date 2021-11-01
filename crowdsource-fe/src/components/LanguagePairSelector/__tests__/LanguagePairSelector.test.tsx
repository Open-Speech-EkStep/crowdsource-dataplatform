import { screen, userEvent, render } from 'utils/testUtils';

import LanguagePairSelector from '../LanguagePairSelector';

describe('LanguageSelector', () => {
  const mockLanguageUpdate = jest.fn();
  const setup = () => {
    return render(<LanguagePairSelector updateSelectedLanguage={mockLanguageUpdate} />);
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
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select To Language' }), 'Hindi');
    expect(mockLanguageUpdate).toBeCalledWith('English-Hindi');
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select From Language' }), 'all');
    expect(screen.getByRole('combobox', { name: 'Select To Language' })).toBeDisabled();
  });
});
