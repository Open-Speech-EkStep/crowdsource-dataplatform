import '__fixtures__/mockComponentsWithSideEffects';
import { SWRConfig } from 'swr';

import { render, waitFor } from 'utils/testUtils';

import IndiaMapChart from '../IndiaMapChart';

describe('IndiaMapChart', () => {
  const setup = async (type: 'asr' | 'ocr' | 'text' | 'parallel', language: string | undefined) => {
    fetchMock.doMockOnceIf('/aggregated-json/cumulativeDataByState.json').mockResponseOnce(
      JSON.stringify([
        {
          state: 'S1',
          total_speakers: 1,
          total_contributions: 0.001,
          total_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'asr',
        },
        {
          state: 'S2',
          total_speakers: 3,
          total_contributions: 0.0,
          total_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 6,
          type: 'ocr',
        },
      ])
    );
    fetchMock.doMockOnceIf('/aggregated-json/cumulativeDataByLanguageAndState.json').mockResponseOnce(
      JSON.stringify([
        {
          state: 'S1',
          language: 'Hindi',
          total_speakers: 1,
          total_contributions: 0.001,
          total_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'asr',
        },
      ])
    );
    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <IndiaMapChart type={type} language={language} />
      </SWRConfig>
    );
    await waitFor(() => {
      expect(fetchMock).toBeCalled();
    });
    return renderResult;
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('asr', undefined);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should fetch data from cumulativeDataByState when language not specified', async () => {
    await setup('asr', undefined);

    expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByState.json');
  });

  it('should fetch data from CumulativeDataByLanguageAndState when language is specified', async () => {
    await setup('asr', 'Hindi');

    expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguageAndState.json');
  });

  it('should fetch data from CumulativeDataByState for ocr', async () => {
    await setup('ocr', undefined);

    expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByState.json');
  });
});
