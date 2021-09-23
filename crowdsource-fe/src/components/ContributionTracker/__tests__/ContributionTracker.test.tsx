import { render, screen, userEvent } from 'utils/testUtils';

import ContributionTracker from '../ContributionTracker';

describe('ContributionActions', () => {
  const setup = async () => {
    fetchMock.doMockOnceIf('/aggregated-json/topLanguagesByHoursContributed.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'Hindi',
          total_contributions: 0.049,
          type: 'text',
        },
        {
          language: 'Hindi',
          total_contributions: 0.049,
          type: 'text',
        },
        {
          language: 'Hindi',
          total_contributions: 0.049,
          type: 'text',
        },
        {
          language: 'Hindi',
          total_contributions: 0.049,
          type: 'text',
        },
      ])
    );

    fetchMock.doMockOnceIf('/aggregated-json/topLanguagesBySpeakerContributions.json').mockResponseOnce(
      JSON.stringify([
        {
          language: 'Hindi',
          total_speakers: 13,
          type: 'ocr',
        },
        {
          language: 'Hindi',
          total_speakers: 13,
          type: 'ocr',
        },
        {
          language: 'Hindi',
          total_speakers: 13,
          type: 'ocr',
        },
      ])
    );

    const renderResult = render(<ContributionTracker />);
    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the chart component after api gives data', async () => {
    await setup();

    expect(screen.getByTestId('ContributionTracker').children.length).toBe(2);
  });

  it('should render the chart for speaker data', async () => {
    await setup();

    userEvent.click(screen.getAllByRole('radio')[1]);
    expect(screen.getByTestId('ContributionTracker').children.length).toBe(2);
  });
});
