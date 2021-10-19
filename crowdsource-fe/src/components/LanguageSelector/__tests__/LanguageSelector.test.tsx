import { screen, userEvent, render, waitFor } from 'utils/testUtils';

import LanguageSelector from '../LanguageSelector';

describe('LanguageSelector', () => {
  const mockLanguageUpdate = jest.fn();
  const setup = (language: string | undefined) => {
    return render(
      <LanguageSelector selectedLanguage={language} updateSelectedLanguage={mockLanguageUpdate} />
    );
  };

  it('should render snapshot', () => {
    const { asFragment } = setup(undefined);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should contain text', () => {
    setup('English');
    expect(screen.getByLabelText('Select a Language:')).toBeInTheDocument();
  });

  it('should call callback fn when language selected', async () => {
    setup(undefined);
    expect(screen.getByRole('combobox', { name: 'Select Language' })).toBeInTheDocument();
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select Language' }), 'English');
    expect(mockLanguageUpdate).toBeCalledWith('English');
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Select Language' }), 'all');
    await waitFor(() => {
      expect(mockLanguageUpdate).toBeCalledWith(undefined);
    });
  });
});
