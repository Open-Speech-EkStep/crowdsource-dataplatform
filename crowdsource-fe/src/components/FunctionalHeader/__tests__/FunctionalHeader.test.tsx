import { render, verifyAxeTest, screen, userEvent, waitFor } from 'utils/testUtils';

import FunctionalHeader from '../FunctionalHeader';

describe('FunctionalHeader', () => {
  const setup = () =>
    render(
      <FunctionalHeader
        onSuccess={() => {}}
        initiative="tts"
        type="contribute"
        action="transcribe"
        showSpeaker={true}
        showTipButton={true}
        toggleQuickTips={() => {}}
      />
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should hide the quick tipe bar when user click on tips button', async () => {
    await setup();

    userEvent.click(screen.getByRole('button', { name: 'tipsIconAlt tips' }));

    await waitFor(() => {
      expect(screen.queryByTestId('QuickTips')).not.toBeInTheDocument();
    });
  });
});
