import { render, verifyAxeTest } from 'utils/testUtils';

import AudioController from '../AudioController';

describe('AudioController', () => {
  const setup = () =>
    render(
      <AudioController
        audioUrl="https://uat-data-crowdsource.azureedge.net/inbound%2Fasr%2FEnglish%2Fnewsonair.nic.in_09-08-2021_03-37%2F2_3_Regional-Kohima-English-0725-201951674824.wav"
        playAudio={true}
        onEnded={() => {}}
      />
    );

  verifyAxeTest(setup());

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup();

    expect(asFragment()).toMatchSnapshot();
  });
});
