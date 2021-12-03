import { SWRConfig } from 'swr';

import { render, waitFor } from 'utils/testUtils';

import '__fixtures__/mockComponentsWithSideEffects';
import AgeChart from '../AgeChart';

describe('AgeChart', () => {
  const setup = async (language: string | undefined) => {
    fetchMock.doMockOnceIf('/aggregated-json/ageGroupContributions.json').mockResponseOnce(
      JSON.stringify([
        {
          age_group: 'upto 10',
          contributions: 10,
          hours_contributed: 0.45,
          hours_validated: 0.2,
          speakers: 3,
        },
        {
          age_group: '30 - 60',
          contributions: 15,
          hours_contributed: 0.5,
          hours_validated: 0.0,
          speakers: 1,
        },
      ])
    );
    fetchMock.doMockOnceIf('/aggregated-json/ageGroupAndLanguageContributions.json').mockResponseOnce(
      JSON.stringify([
        {
          age_group: '30 - 60',
          contributions: 10,
          hours_contributed: 0.45,
          hours_validated: 0.2,
          speakers: 3,
          language: 'Hindi',
        },
      ])
    );
    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <AgeChart language={language} />
      </SWRConfig>
    );
    await waitFor(() => {
      expect(fetchMock).toBeCalled();
    });
    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup(undefined);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should fetch data from ageGroupContributions when language not specified', async () => {
    await setup(undefined);

    expect(fetchMock).toBeCalledWith('/aggregated-json/ageGroupContributions.json');
  });

  it('should fetch data from ageGroupAndLanguageContributions when language is specified', async () => {
    await setup('Hindi');

    expect(fetchMock).toBeCalledWith('/aggregated-json/ageGroupAndLanguageContributions.json');
  });
});
