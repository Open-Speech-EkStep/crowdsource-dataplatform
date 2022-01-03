import { render, userEvent, verifyAxeTest, waitFor, screen } from 'utils/testUtils';

import TranslationValidateTextArea from '../TranslationValidateTextArea';

describe('TranslationValidateTextArea', () => {
  const callback = jest.fn();
  const setup = (
    fromLanguage: string | null,
    toLanguage: string | null,
    text: string,
    validate: boolean = false
  ) =>
    render(
      <TranslationValidateTextArea
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
    const { asFragment } = setup('Hindi', 'English', 'test');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the textarea text with valid language', async () => {
    setup('Hindi', 'English', 'test');

    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), 'abc');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('should call error callback when input text updated but is equal to original', async () => {
    setup('Hindi', 'English', 'test');

    userEvent.clear(screen.getByRole('textbox', { name: 'label 1' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), 'test');

    expect(callback).toBeCalledWith(true);
  });

  it('should not show warning message if input text is same as original', async () => {
    setup('Hindi', 'English', 'test', true);

    expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    userEvent.clear(screen.getByRole('textbox', { name: 'label 1' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), 'test');

    await waitFor(() => {
      expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('ErrorText')).not.toBeInTheDocument();
    });
  });

  it('should auto validate if validate enabled', async () => {
    setup('Hindi', 'English', 'test', true);

    expect(screen.queryByTestId('ErrorText')).not.toBeInTheDocument();
    userEvent.clear(screen.getByRole('textbox', { name: 'label 1' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), 'wrong input text message');

    // await waitFor(() => {
    expect(screen.queryByText('validationWarningText')).toBeInTheDocument();
    // });
  });

  it('should show validation error message when user continues typing incorrectly', async () => {
    setup('Hindi', 'English', 'test', true);

    expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    userEvent.clear(screen.getByRole('textbox', { name: 'label 1' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), 'wrong input text message');
    expect(screen.queryByText('validationWarningText')).toBeInTheDocument();
    userEvent.type(screen.getByRole('textbox', { name: 'label 1' }), ' even more text');
    expect(screen.queryByText('validationWarningText')).toBeInTheDocument();
  });
});
