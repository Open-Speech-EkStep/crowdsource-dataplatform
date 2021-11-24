import { when } from 'jest-when';

import { render, screen, userEvent } from 'utils/testUtils';

import BadgeDetail from '../BadgeDetail';

describe('BadgeDetail', () => {
  const setup = () => {
    when(localStorage.getItem)
      .calledWith('contributionLanguage')
      .mockImplementation(() => 'English');

    when(sessionStorage.getItem)
      .calledWith('prevPath')
      .mockImplementation(() => '/suno-india');

    return render(<BadgeDetail />);
  };

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render badges in "Assamese" language when Assamese is chosen from language dropdown', async () => {
    setup();

    userEvent.selectOptions(screen.getByTestId('SelectDropDownLanguage'), 'অসমীয়া');

    expect(screen.getByRole('combobox', { name: 'Your Language' })).toHaveValue('Assamese');
  });

  it('should render badge detail for selected initiative', async () => {
    let scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    setup();
    userEvent.click(screen.getByRole('tab', { name: 'bolo india' }));

    expect(scrollIntoViewMock).toBeCalled();
    userEvent.click(screen.getByRole('tab', { name: 'bolo india' }));
    expect(screen.getByRole('tab', { name: 'bolo india' })).toHaveClass('active');
  });

  it('should activate validate badges when validate radio button is selected', async () => {
    await setup();
    expect(screen.getByTestId('action2')).not.toBeChecked();
    userEvent.click(screen.getByTestId('action2'));
    expect(screen.getByTestId('action2')).toBeChecked();
    expect(screen.getByTestId('action1')).not.toBeChecked();
  });
});
