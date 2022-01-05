import { render, userEvent, waitFor, screen } from 'utils/testUtils';

import MapChart from '../MapChart';

describe('MapChart', () => {
  const anonymousStateData = {
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
        anonymousStateData={anonymousStateData}
      />
    );

  it('should render the component and matches it against stored snapshot', () => {
    const { asFragment } = setup([]);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should open and close unspecifiedLocation tooltip', async () => {
    setup([]);

    expect(screen.getByTestId('statePopover')).toBeInTheDocument();

    expect(screen.getByTestId('statePopover')).toHaveClass('hide');
    userEvent.hover(screen.getByRole('button'));
    await waitFor(async () => {
      expect(screen.getByTestId('statePopover')).toHaveClass('show');
      userEvent.unhover(screen.getByRole('button'));
      await waitFor(() => expect(screen.getByTestId('statePopover')).toHaveClass('hide'));
    });
  });
});
