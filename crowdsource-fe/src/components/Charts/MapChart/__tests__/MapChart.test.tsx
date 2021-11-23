import { render, screen, userEvent, waitFor } from 'utils/testUtils';

import MapChart from '../MapChart';

describe('MapChart', () => {
  const anonumousStateData = {
    state: 'Unspecified Location',
    contribution: 2,
    validation: 3,
    speakers: 0,
    contributionText: 'contribution',
    validationText: 'validation',
    value: 5,
  };
  const setup = (data: Object[]) =>
    render(
      <MapChart
        sourceUrl="https://test/indiaMap.json"
        data={data}
        quarterUnit={0.25}
        anonymousStateData={anonumousStateData}
      />
    );

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup([]);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the component with unspecified block below map', async () => {
    const data = [
      {
        state: 'National Capital Territory of Delhi',
        total_speakers: 9,
        total_contributions: 0.028,
        total_validations: 0.002,
        total_contribution_count: 39,
        total_validation_count: 8,
        type: 'asr',
      },
      {
        state: '',
        total_speakers: 1,
        total_contributions: 0.0,
        total_validations: 22.0,
        total_contribution_count: 1,
        total_validation_count: 1,
        type: 'asr',
      },
    ];
    const { container } = setup(data);
    await waitFor(() => expect(container.querySelector('.hide')).toBeInTheDocument());

    userEvent.hover(screen.getByTestId('statePopover'));
    // await waitFor(() => expect(container.querySelector('.show')).toBeInTheDocument());
  });
});
