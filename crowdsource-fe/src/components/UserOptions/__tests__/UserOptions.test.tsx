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

import UserOptions from '../UserOptions';

describe('UserOptions', () => {
  const setup = () => {
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => null);

    return render(<UserOptions />);
  };
  const setupWithSpeakerDetails = (data = {}) => {
    const speakerDetails = {
      gender: 'male',
      age: '',
      motherTongue: 'Hindi',
      userName: 'abcd',
      language: 'Hindi',
      toLanguage: '',
      ...data,
    };
    when(localStorage.getItem)
      .calledWith('speakerDetails')
      .mockImplementation(() => JSON.stringify(speakerDetails));

    return render(<UserOptions />);
  };

  verifyAxeTest(() => setup());
  verifyAxeTest(() => setupWithSpeakerDetails());

  it('should not render the component when speaker details are not present', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the component when speaker details are present', () => {
    const { asFragment } = setupWithSpeakerDetails();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the component when speaker details are present but username is not present', () => {
    const { asFragment } = setupWithSpeakerDetails({
      userName: '',
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should hide ChangeUserModal initially', () => {
    setupWithSpeakerDetails();

    expect(screen.queryByTestId('ChangeUserModal')).not.toBeInTheDocument();
  });

  it('should show ChangeUserModal when change user option is clicked', async () => {
    setupWithSpeakerDetails();

    userEvent.click(screen.getByRole('button', { name: 'languageIconAlt abcd' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'changeUser' })).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: 'changeUser' }));

    expect(screen.getByTestId('ChangeUserModal')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitForElementToBeRemoved(() => screen.queryByTestId('ChangeUserModal'));

    expect(screen.queryByTestId('ChangeUserModal')).not.toBeInTheDocument();
  });

  it('should navigate to my badges page on "my badges" link click', async () => {
    setupWithSpeakerDetails();

    userEvent.click(screen.getByRole('button', { name: 'languageIconAlt abcd' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'changeUser' })).toBeInTheDocument());

    expect(router.pathname).toBe('');

    userEvent.click(screen.getByRole('link', { name: 'myBadges' }));

    expect(router.pathname).toBe('/my-badges.html');
  });
});
