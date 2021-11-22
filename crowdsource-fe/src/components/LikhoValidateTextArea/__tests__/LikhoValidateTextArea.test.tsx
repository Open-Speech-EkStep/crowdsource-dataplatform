import { render, userEvent, verifyAxeTest, waitFor, screen } from 'utils/testUtils';

jest.mock('utils/validations');
import LikhoValidateTextArea from '../LikhoValidateTextArea';

describe('LikhoValidateTextArea', () => {
  const callback = jest.fn();
  const setup = (
    fromLanguage: string | null,
    toLanguage: string | null,
    text: string,
    validate: boolean = false
  ) =>
    render(
      <LikhoValidateTextArea
        fromLanguage={fromLanguage}
        toLanguage={toLanguage}
        initiative="parallel"
        text={text}
        textAreaLabel={`label 1`}
        setHasError={callback}
        updateText={(text: string) => text}
        validate={validate}
      />
    );

  verifyAxeTest(setup('English', 'Hindi', 'test'));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('English', 'Hindi', 'test');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the textarea text with valid language', async () => {
    setup('English', 'Hindi', 'test');

    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), 'abc');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('should call error callback when input text updated but is equal to original', async () => {
    setup('English', 'Hindi', 'test');

    userEvent.clear(screen.getByRole('textbox', { name: 'label 1' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), 'test');

    expect(callback).toBeCalledWith(true);
  });

  it('should not show warning message if input text is same as original', async () => {
    setup('English', 'Hindi', 'test', true);

    expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    userEvent.clear(screen.getByRole('textbox', { name: 'label 1' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), 'test');

    await waitFor(() => {
      expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    });
  });

  it('should auto validate if validate enabled', async () => {
    setup('Hindi', 'English', 'test', true);

    expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    userEvent.clear(screen.getByRole('textbox', { name: 'label 1' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), 'wrong input msg');

    await waitFor(() => {
      expect(screen.queryByText('validationWarningText')).toBeInTheDocument();
    });
  });
});
