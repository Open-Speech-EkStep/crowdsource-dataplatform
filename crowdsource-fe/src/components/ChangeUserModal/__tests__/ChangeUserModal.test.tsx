import { render, screen, userEvent, verifyAxeTest } from 'utils/testUtils';

import ChangeUserModal from '../ChangeUserModal';

describe('ChangeUserModal', () => {
  const setup = (redirectionUrl?: any, doRedirection?: boolean) => {
    const onHide = jest.fn();

    return {
      ...render(
        <ChangeUserModal
          show={true}
          onHide={onHide}
          doRedirection={doRedirection}
          redirectionUrl={redirectionUrl}
        />
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

  it('should handle for valid/invalid username', () => {
    setup('/suno-india', true);

    expect(screen.queryByText('userNameError')).not.toBeInTheDocument();
    expect(screen.getByText('userNameHint')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).not.toBeDisabled();

    userEvent.clear(screen.getByRole('textbox', { name: 'name' }));
    userEvent.type(screen.getByRole('textbox', { name: 'name' }), 'abc@abc.com');

    expect(screen.getByText('userNameError')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeDisabled();
    expect(screen.queryByText('userNameHint')).not.toBeInTheDocument();

    userEvent.clear(screen.getByRole('textbox', { name: 'name' }));
    userEvent.type(screen.getByRole('textbox', { name: 'name' }), '9879879878');

    expect(screen.getByText('userNameError')).toBeInTheDocument();
    expect(screen.queryByText('userNameHint')).not.toBeInTheDocument();

    userEvent.clear(screen.getByRole('textbox', { name: 'name' }));
    userEvent.type(screen.getByRole('textbox', { name: 'name' }), 'abc_123');

    expect(screen.queryByText('userNameError')).not.toBeInTheDocument();
    expect(screen.getByText('userNameHint')).toBeInTheDocument();
  });

  it('should save user details in localstorage', () => {
    const { onHide } = setup();

    userEvent.clear(screen.getByRole('textbox', { name: 'name' }));
    userEvent.type(screen.getByRole('textbox', { name: 'name' }), 'abc@abc.com');

    userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(localStorage.setItem).not.toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalledTimes(1);

    userEvent.clear(screen.getByRole('textbox', { name: 'name' }));
    userEvent.type(screen.getByRole('textbox', { name: 'name' }), 'abc');

    userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'speakerDetails',
      '{"userName":"abc","motherTongue":"","age":"","gender":"","language":"English","toLanguage":""}'
    );
    expect(onHide).toHaveBeenCalledTimes(1);

    userEvent.click(screen.getByRole('combobox', { name: 'motherTongue' }));
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'motherTongue' }), 'Hindi');

    userEvent.click(screen.getByRole('combobox', { name: 'ageGroup' }));
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'ageGroup' }), '30 - 60');

    userEvent.click(screen.getByRole('radio', { name: 'male' }));

    jest.clearAllMocks();

    userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'speakerDetails',
      '{"userName":"abc","motherTongue":"Hindi","age":"30 - 60","gender":"male","language":"English","toLanguage":""}'
    );
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it('should handle gender radio combinations', () => {
    setup(null, true);

    userEvent.click(screen.getByRole('radio', { name: 'male' }));

    expect(screen.getByRole('radio', { name: 'male' })).toBeChecked();
    expect(screen.queryByRole('radio', { name: 'transgenderMale' })).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'transgenderFemale' })).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'ratherNotSayGender' })).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('radio', { name: 'female' }));

    expect(screen.getByRole('radio', { name: 'male' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'female' })).toBeChecked();
    expect(screen.queryByRole('radio', { name: 'transgenderMale' })).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'transgenderFemale' })).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'ratherNotSayGender' })).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('radio', { name: 'others' }));

    expect(screen.getByRole('radio', { name: 'male' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'female' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'others' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'transgenderMale' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'transgenderFemale' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'ratherNotSayGender' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'ratherNotSayGender' })).toBeChecked();

    jest.clearAllMocks();
    userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'speakerDetails',
      '{"userName":"","motherTongue":"","age":"","gender":"Rather Not Say","language":"English","toLanguage":""}'
    );

    userEvent.click(screen.getByRole('radio', { name: 'transgenderMale' }));

    jest.clearAllMocks();
    userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'speakerDetails',
      '{"userName":"","motherTongue":"","age":"","gender":"Transgender - He","language":"English","toLanguage":""}'
    );

    userEvent.click(screen.getByRole('radio', { name: 'female' }));

    expect(screen.getByRole('radio', { name: 'female' })).toBeChecked();
    expect(screen.queryByRole('radio', { name: 'transgenderMale' })).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'transgenderFemale' })).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'ratherNotSayGender' })).not.toBeInTheDocument();

    jest.clearAllMocks();
    userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'speakerDetails',
      '{"userName":"","motherTongue":"","age":"","gender":"female","language":"English","toLanguage":""}'
    );
  });
});
