import { render, userEvent, verifyAxeTest, waitFor, screen } from 'utils/testUtils';

import EditTextBlock from '../EditTextBlock';

describe('EditTextBlock', () => {
  const callback = jest.fn();
  const setup = (contributionLanguage: string | null, text: string, validate: boolean = false) =>
    render(
      <EditTextBlock
        fromLanguage={contributionLanguage}
        toLanguage={contributionLanguage}
        initiative="asr"
        text={text}
        leftTextAreaLabel={`label 1`}
        rightTextAreaLabel={`label 2`}
        setHasError={callback}
        updateText={(text: string) => text}
        validate={validate}
        closeKeyboard={true}
      />
    );

  verifyAxeTest(setup('English', 'test'));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('English', 'test');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the textarea text with valid language', async () => {
    setup('English', 'test');

    userEvent.type(screen.getByRole('textbox', { name: 'label 2' }), 'abc');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('should call error callback when input text updated but is equal to original', async () => {
    setup('English', 'test');

    userEvent.clear(screen.getByRole('textbox', { name: 'label 2' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 2' }), 'test');

    expect(callback).toBeCalledWith(true);
  });

  it('should not show warning message if input text is same as original', async () => {
    setup('English', 'test', true);

    expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    userEvent.clear(screen.getByRole('textbox', { name: 'label 2' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 2' }), 'test');

    await waitFor(() => {
      expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    });
  });

  it('should auto validate if validate enabled', async () => {
    setup('English', 'test', true);

    expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    userEvent.clear(screen.getByRole('textbox', { name: 'label 2' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 2' }), 'wrong text');

    await waitFor(() => {
      expect(screen.queryByText('validationWarningText')).toBeInTheDocument();
    });
  });

  it('should test auto validate if language is not defined', async () => {
    setup(null, 'test', true);

    expect(screen.queryByText('validationWarningText')).not.toBeInTheDocument();
    userEvent.clear(screen.getByRole('textbox', { name: 'label 2' }));
    userEvent.type(screen.getByRole('textbox', { name: 'label 2' }), 'wrong text');

    await waitFor(() => {
      expect(screen.queryByText('typeInChosenLanguage')).toBeInTheDocument();
    });
  });
});
