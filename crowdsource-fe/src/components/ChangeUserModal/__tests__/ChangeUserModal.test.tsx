import { render, verifyAxeTest, screen, userEvent } from 'utils/testUtils';

import ChangeUserModal from '../ChangeUserModal';

describe('ChangeUserModal', () => {
  const setup = () => {
    const onHide = jest.fn();

    return {
      ...render(
        <ChangeUserModal show={true} onHide={onHide} doRedirection={true} redirectionUrl={'/suno'} />
      ),
      onHide,
    };
  };

  verifyAxeTest(() => {
    setup();

    return { container: screen.getByTestId('ChangeUserModal') };
  });

  it('should render the ChangeUserModal', () => {
    const { onHide } = setup();

    expect(screen.getByRole('heading', { name: 'changeUserModalHeading' })).toBeInTheDocument();
    expect(screen.getByText('changeUserModalSubHeading')).toBeInTheDocument();
    expect(screen.getByTestId('ChangeUserModal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(screen.getByTestId('ChangeUserForm')).toBeInTheDocument();

    expect(onHide).toHaveBeenCalledTimes(0);
  });

  it('should handle modal close/open behaviour', () => {
    const { onHide } = setup();

    userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(onHide).toHaveBeenCalledTimes(1);

    userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onHide).toHaveBeenCalledTimes(2);
  });
});
