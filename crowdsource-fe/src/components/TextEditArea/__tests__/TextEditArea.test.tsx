import { render, verifyAxeTest, userEvent, screen, waitFor } from 'utils/testUtils';

import TextEditArea from '../TextEditArea';

describe('TextEditArea English', () => {
  const setup = (contributionLanguage: string) =>
    render(
      <TextEditArea
        id="textarea"
        language={contributionLanguage}
        initiative="suno"
        setTextValue={value => value}
        isTextareaDisabled={false}
        label={`addText (${contributionLanguage})`}
        onError={() => {}}
      />
    );

  verifyAxeTest(setup('English'));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('English');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the textarea text with valid language', async () => {
    setup('English');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (English)' }), 'abc');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('should show the error with "Special characters are not allowed"', async () => {
    setup('English');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (English)' }), 'abc@');

    expect(screen.getByText('specialCharacters')).toBeInTheDocument();
  });

  it('should show the error with "Please type in your chosen language"', async () => {
    setup('English');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (English)' }), 'बपपप');

    expect(screen.getByTestId('ErrorText')).toBeInTheDocument();
    expect(screen.getByText('typeInChosenLanguage')).toBeInTheDocument();
  });

  it('should test the textarea button for setting layout from virtual keyboard', async () => {
    setup('English');
    userEvent.click(screen.getByRole('button', { name: 'keyboardBtn' }));

    await waitFor(() => {
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    userEvent.click(screen.getAllByText('shift')[1]);
    userEvent.click(screen.getAllByText('shift')[1]);
  });

  it('should test the textarea text from virtual keyboard', async () => {
    setup('English');
    userEvent.click(screen.getByRole('button', { name: 'keyboardBtn' }));

    await waitFor(() => {
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('caps'));
    userEvent.click(screen.getByText('A'));

    expect(screen.getByRole('textbox', { name: 'addText (English)' })).toHaveValue('A');
  });

  it('should show the virtual keyboard on button click', async () => {
    setup('English');

    userEvent.click(screen.getByRole('button', { name: 'keyboardBtn' }));

    await waitFor(() => {
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('close-keyboard'));

    await waitFor(() => {
      expect(screen.queryByText('X')).not.toBeInTheDocument();
    });
  });

  it('should hide the virtual keyboard when user empty the textfield', async () => {
    setup('English');

    userEvent.click(screen.getByRole('button', { name: 'keyboardBtn' }));

    await waitFor(() => {
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    userEvent.type(screen.getByRole('textbox', { name: 'addText (English)' }), 'abc');

    userEvent.clear(screen.getByRole('textbox', { name: 'addText (English)' }));

    await waitFor(() => {
      expect(screen.queryByText('X')).not.toBeInTheDocument();
    });
  });
});

describe('TextEditArea Hindi', () => {
  const setup = (contributionLanguage: string) =>
    render(
      <TextEditArea
        id="textarea"
        language={contributionLanguage}
        initiative="suno"
        setTextValue={value => value}
        isTextareaDisabled={false}
        label={`addText (${contributionLanguage})`}
        onError={() => {}}
      />
    );

  it('should render the component and matches it against stored snapshot in hindi', () => {
    const { asFragment } = setup('Hindi');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the textarea text with valid language', async () => {
    setup('Hindi');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (Hindi)' }), 'बपपप');

    await waitFor(() => {
      expect(screen.queryByText('typeInChosenLanguage')).not.toBeInTheDocument();
    });
  });

  it('should show the error with "Special characters are not allowed"', async () => {
    setup('Hindi');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (Hindi)' }), 'बपपप@.');

    expect(screen.getByTestId('ErrorText')).toBeInTheDocument();
    expect(screen.getByText('specialCharacters')).toBeInTheDocument();
  });

  it('should test the textarea text from virtual keyboard for "Hindi" language', async () => {
    setup('Hindi');
    userEvent.click(screen.getByRole('button', { name: 'keyboardBtn' }));

    await waitFor(() => {
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('caps'));
    userEvent.click(screen.getByText('क्ष'));

    expect(screen.getByRole('textbox', { name: 'addText (Hindi)' })).toHaveValue('क्ष');
  });

  it('should hide the virtual keyboard when user empty the textfield', async () => {
    setup('Hindi');

    userEvent.click(screen.getByRole('button', { name: 'keyboardBtn' }));

    await waitFor(() => {
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    userEvent.type(screen.getByRole('textbox', { name: 'addText (Hindi)' }), 'बपपप');

    userEvent.clear(screen.getByRole('textbox', { name: 'addText (Hindi)' }));

    await waitFor(() => {
      expect(screen.queryByText('X')).not.toBeInTheDocument();
    });
  });
});
