import { render } from '@testing-library/react';

import { screen } from 'utils/testUtils';

import LanguageSelector from '../LanguageSelector';

describe('LanguageSelector', () => {
  const setup = (language: string) => {
    const mockLanguageUpdate = jest.fn();
    return render(
      <LanguageSelector selectedLanguage={language} updateSelectedLanguage={mockLanguageUpdate} />
    );
  };

  it('should render snapshot', () => {
    const { asFragment } = setup('All Languages');
    expect(asFragment()).toMatchSnapshot();
  });

  it('should contain text', () => {
    setup('Engish');
    expect(screen.getByLabelText('Select a Language:')).toBeInTheDocument();
  });
});
