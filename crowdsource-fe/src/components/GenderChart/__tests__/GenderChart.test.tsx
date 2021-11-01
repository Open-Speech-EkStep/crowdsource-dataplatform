import { SWRConfig } from 'swr';

import { render, waitFor } from 'utils/testUtils';

import '__fixtures__/mockComponentsWithSideEffects';
import GenderChart from '../GenderChart';

describe('GenderChart', () => {
  const setup = async (language: string | undefined) => {
    fetchMock.doMockOnceIf('/aggregated-json/genderGroupContributions.json').mockResponseOnce(
      JSON.stringify([
        {
          gender: 'male',
          contributions: 10,
          hours_contributed: 0.45,
          hours_validated: 0.2,
          speakers: 3,
        },
        {
          gender: 'female',
          contributions: 10,
          hours_contributed: 0.45,
          hours_validated: 0.2,
          speakers: 3,
        },
        {
          gender: 'Transgender - He',
          contributions: 10,
          hours_contributed: 0.45,
          hours_validated: 0.2,
          speakers: 3,
        },
        {
          gender: '',
          contributions: 10,
          hours_contributed: 0.45,
          hours_validated: 0.2,
          speakers: 3,
        },
      ])
    );
    fetchMock.doMockOnceIf('/aggregated-json/genderGroupAndLanguageContributions.json').mockResponseOnce(
      JSON.stringify([
        {
          gender: 'male',
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
        <GenderChart language={language} />
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

  it('should fetch data from genderGroupContributions when language not specified', async () => {
    await setup(undefined);

    expect(fetchMock).toBeCalledWith('/aggregated-json/genderGroupContributions.json');
  });

  it('should fetch data from genderGroupAndLanguageContributions when language is specified', async () => {
    await setup('Hindi');

    expect(fetchMock).toBeCalledWith('/aggregated-json/genderGroupAndLanguageContributions.json');
  });
});
