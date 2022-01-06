import '__fixtures__/mockComponentsWithSideEffects';
import { SWRConfig } from 'swr';

import { render, waitFor } from 'utils/testUtils';

import IndiaMapChart from '../IndiaMapChart';

describe('IndiaMapChart without language', () => {
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
          state: 'Punjab',
          total_speakers: 3,
          total_contributions: 0.0,
          total_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 6,
          type: 'ocr',
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

  it('should fetch data from CumulativeDataByState for ocr', async () => {
    await setup('ocr', undefined);

    expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByState.json');
  });
});

describe('IndiaMapChart with language', () => {
  const setup = async (
    type: 'asr' | 'ocr' | 'text' | 'parallel',
    language: string | undefined,
    responseData: any
  ) => {
    fetchMock
      .doMockOnceIf('/aggregated-json/cumulativeDataByLanguageAndState.json')
      .mockResponseOnce(JSON.stringify(responseData));
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

  it('should fetch data from CumulativeDataByLanguageAndState for asr when language is specified', async () => {
    const data = [
      {
        state: 'Punjab',
        language: 'Hindi',
        total_speakers: 1,
        total_contributions: 0.001,
        total_validations: 1,
        total_contribution_count: 1,
        total_validation_count: 0,
        type: 'asr',
      },
    ];
    await setup('asr', 'Hindi', data);
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguageAndState.json');
    });
  });

  it('should set the default value for ocr when some params are missing from api', async () => {
    const data = [
      {
        state: 'Punjab',
        language: 'Hindi',
        total_speakers: 1,
        total_validations: 0,
        type: 'ocr',
      },
    ];
    await setup('ocr', 'Hindi', data);
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguageAndState.json');
    });
  });

  it('should set the default value for asr when some params are missing from api', async () => {
    const data = [
      {
        state: 'Punjab',
        language: 'Hindi',
        total_speakers: 1,
        total_validations: 0,
        total_contribution_count: 1,
        total_validation_count: 0,
        type: 'asr',
      },
    ];
    await setup('asr', 'Hindi', data);
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguageAndState.json');
    });
  });

  it('should set the default value for asr when language is not matching', async () => {
    const data = [
      {
        state: 'Punjab',
        language: 'English',
        total_speakers: 1,
        total_validations: 0,
        total_contribution_count: 1,
        total_validation_count: 0,
        type: 'asr',
      },
    ];
    await setup('asr', 'Hindi', data);
    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/cumulativeDataByLanguageAndState.json');
    });
  });
});
