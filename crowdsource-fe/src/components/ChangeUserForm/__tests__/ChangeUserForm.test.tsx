import router from 'next/router';

import { render, verifyAxeTest, screen, userEvent } from 'utils/testUtils';

import ChangeUserForm from '../ChangeUserForm';

describe('ChangeUserForm', () => {
  const setup = (redirectionUrl?: any, doRedirection?: boolean) => {
    router.locale = undefined;
    const onSubmit = jest.fn();

    return {
      ...render(
        <>
          <ChangeUserForm onSubmit={onSubmit} doRedirection={doRedirection} redirectionUrl={redirectionUrl} />
          <button form="changeUserForm">submit</button>
        </>
      ),
      onSubmit,
    };
  };

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should handle for valid/invalid username', () => {
    setup('/suno-india', true);

    expect(screen.queryByText('userNameError')).not.toBeInTheDocument();
    expect(screen.getByText('userNameHint')).toBeInTheDocument();

    userEvent.clear(screen.getByRole('textbox', { name: 'name' }));
    userEvent.type(screen.getByRole('textbox', { name: 'name' }), 'abc@abc.com');

    expect(screen.getByText('userNameError')).toBeInTheDocument();
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
    const { onSubmit } = setup();

    userEvent.clear(screen.getByRole('textbox', { name: 'name' }));
    userEvent.type(screen.getByRole('textbox', { name: 'name' }), 'abc@abc.com');

    userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(localStorage.setItem).not.toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalledTimes(1);

    userEvent.clear(screen.getByRole('textbox', { name: 'name' }));
    userEvent.type(screen.getByRole('textbox', { name: 'name' }), 'abc');

    userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'speakerDetails',
      '{"userName":"abc","motherTongue":"","age":"","gender":"","language":"English","toLanguage":""}'
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);

    userEvent.click(screen.getByRole('combobox', { name: 'motherTongue' }));
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'motherTongue' }), 'Hindi');

    userEvent.click(screen.getByRole('combobox', { name: 'ageGroup' }));
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'ageGroup' }), '30 - 60');

    userEvent.click(screen.getByRole('radio', { name: 'male' }));

    jest.clearAllMocks();

    userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'speakerDetails',
      '{"userName":"abc","motherTongue":"Hindi","age":"30 - 60","gender":"male","language":"English","toLanguage":""}'
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
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
    userEvent.click(screen.getByRole('button', { name: 'submit' }));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'speakerDetails',
      '{"userName":"","motherTongue":"","age":"","gender":"Rather Not Say","language":"English","toLanguage":""}'
    );

    userEvent.click(screen.getByRole('radio', { name: 'transgenderMale' }));

    jest.clearAllMocks();
    userEvent.click(screen.getByRole('button', { name: 'submit' }));
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
    userEvent.click(screen.getByRole('button', { name: 'submit' }));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'speakerDetails',
      '{"userName":"","motherTongue":"","age":"","gender":"female","language":"English","toLanguage":""}'
    );
  });
});
