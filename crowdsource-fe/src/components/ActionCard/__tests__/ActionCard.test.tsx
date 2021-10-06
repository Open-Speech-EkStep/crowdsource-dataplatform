import { when } from 'jest-when';
import router from 'next/router';

import {
  render,
  verifyAxeTest,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
} from 'utils/testUtils';

import ActionCard from '../ActionCard';

describe('ActionCard', () => {
  const setup = () => {
    router.locale = 'as';
    const rendereResult = render(
      <ActionCard
        icon="some-icon.svg"
        type="contribute"
        text="some-text"
        initiative="suno"
        warningMsg="Only contributions invited for the selected language"
      />
    );
    return rendereResult;
  };

  verifyAxeTest(setup());

  it('should render the component and match it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should show the user detail modal when user not registered', async () => {
    setup();

    userEvent.click(screen.getByTestId('cardAnchor'));

    await waitFor(() => expect(screen.getByTestId('ChangeUserForm')).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitForElementToBeRemoved(() => screen.queryByTestId('ChangeUserModal'));

    expect(screen.queryByTestId('ChangeUserModal')).not.toBeInTheDocument();
  });

  it('should not show the userdetail modal when user detail is present in local storage', async () => {
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(
        () => '{"userName":"abc","motherTongue":"","age":"","gender":"","language":"English","toLanguage":""}'
      );

    setup();

    userEvent.click(screen.getByTestId('cardAnchor'));

    expect(screen.queryByTestId('ChangeUserModal')).not.toBeInTheDocument();
  });
});
