import { render, verifyAxeTest, userEvent, screen, waitFor } from 'utils/testUtils';

import TextEditArea from '../TextEditArea';

describe('TextEditArea English', () => {
  const setup = (contributionLanguage: string) =>
    render(
      <TextEditArea
        language={contributionLanguage}
        initiative="suno"
        setTextValue={value => value}
        isTextareaDisabled={false}
      />
    );

  verifyAxeTest(setup('English'));

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup('English');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should test the textarea text with valid language', async () => {
    setup('English');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (english)' }), 'abc');

    await waitFor(() => {
      expect(screen.queryByText('Please type in your chosen language')).not.toBeInTheDocument();
    });
  });

  it('should show the error with "Special characters are not allowed"', async () => {
    setup('English');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (english)' }), 'abc@');

    expect(screen.getByText('specialCharacters')).toBeInTheDocument();
  });

  it('should show the error with "Please type in your chosen language"', async () => {
    setup('English');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (english)' }), 'बपपप');

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

    expect(screen.getByRole('textbox', { name: 'addText (english)' })).toHaveValue('A');
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

    userEvent.type(screen.getByRole('textbox', { name: 'addText (english)' }), 'abc');

    userEvent.clear(screen.getByRole('textbox', { name: 'addText (english)' }));

    await waitFor(() => {
      expect(screen.queryByText('X')).not.toBeInTheDocument();
    });
  });
});

describe('TextEditArea Hindi', () => {
  const setup = (contributionLanguage: string) =>
    render(
      <TextEditArea
        language={contributionLanguage}
        initiative="suno"
        setTextValue={value => value}
        isTextareaDisabled={false}
      />
    );

  it('should test the textarea text with valid language', async () => {
    setup('Hindi');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (hindi)' }), 'बपपप');

    await waitFor(() => {
      expect(screen.queryByText('typeInChosenLanguage')).not.toBeInTheDocument();
    });
  });

  it('should show the error with "Special characters are not allowed"', async () => {
    setup('Hindi');

    userEvent.type(screen.getByRole('textbox', { name: 'addText (hindi)' }), 'बपपप@.');

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

    expect(screen.getByRole('textbox', { name: 'addText (hindi)' })).toHaveValue('क्ष');
  });

  it('should hide the virtual keyboard when user empty the textfield', async () => {
    setup('Hindi');

    userEvent.click(screen.getByRole('button', { name: 'keyboardBtn' }));

    await waitFor(() => {
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument();
    });

    userEvent.type(screen.getByRole('textbox', { name: 'addText (hindi)' }), 'बपपप');

    userEvent.clear(screen.getByRole('textbox', { name: 'addText (hindi)' }));

    await waitFor(() => {
      expect(screen.queryByText('X')).not.toBeInTheDocument();
    });
  });
});
