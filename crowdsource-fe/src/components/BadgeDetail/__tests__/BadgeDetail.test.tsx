import { render, screen, userEvent } from 'utils/testUtils';

import BadgeDetail from '../BadgeDetail';

describe('BadgeDetail', () => {
  const setup = () => render(<BadgeDetail />);

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('badgesDetailPageHeading')).toBeInTheDocument();
  });

  it('should render badges in "Assamese" language when Assamese is chosen from language dropdown', async () => {
    setup();

    userEvent.selectOptions(screen.getByTestId('SelectDropDownLanguage'), 'অসমীয়া');

    expect(screen.getByRole('combobox', { name: 'Your Language' })).toHaveValue('Assamese');
  });

  it('should render badge detail for selected initiative', async () => {
    let scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    await setup();
    userEvent.click(screen.getByRole('tab', { name: 'bolo india' }));

    expect(scrollIntoViewMock).toBeCalled();
    userEvent.click(screen.getByRole('tab', { name: 'bolo india' }));
    expect(screen.getByRole('tab', { name: 'bolo india' })).toHaveClass('active');
  });
});
