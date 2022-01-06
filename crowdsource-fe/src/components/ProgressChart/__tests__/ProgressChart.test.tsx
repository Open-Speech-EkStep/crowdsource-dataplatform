import '__fixtures__/mockComponentsWithSideEffects';
import { SWRConfig } from 'swr';

import { render, userEvent, verifyAxeTest, waitFor, screen } from 'utils/testUtils';

import ProgressChart from '../ProgressChart';

describe('ProgressChart', () => {
  const setup = async (type: 'asr' | 'ocr' | 'text' | 'parallel', language: string | undefined) => {
    fetchMock.doMockOnceIf('/aggregated-json/monthlyTimelineCumulative.json').mockResponseOnce(
      JSON.stringify([
        {
          year: 2021,
          month: 5,
          cumulative_contributions: 0.01,
          cumulative_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'asr',
        },
        {
          year: 2021,
          month: 6,
          cumulative_contributions: 0.002,
          cumulative_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'asr',
        },
        {
          year: 2021,
          month: 4,
          cumulative_contributions: 0.02,
          cumulative_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'ocr',
        },
        {
          year: 2021,
          month: 7,
          cumulative_contributions: 0.102,
          cumulative_validations: 2.02,
          total_contribution_count: 1,
          total_validation_count: 2,
          type: 'ocr',
        },
      ])
    );

    fetchMock.doMockOnceIf('/aggregated-json/quarterlyTimelineCumulative.json').mockResponseOnce(
      JSON.stringify([
        {
          year: 2021,
          quarter: 5,
          cumulative_contributions: 0.01,
          cumulative_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'asr',
        },
        {
          year: 2021,
          quarter: 6,
          cumulative_contributions: 0.002,
          cumulative_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'asr',
        },
      ])
    );

    fetchMock.doMockOnceIf('/aggregated-json/monthlyTimeline.json').mockResponseOnce(
      JSON.stringify([
        {
          year: 2021,
          month: 5,
          language: 'Hindi',
          cumulative_contributions: 0.01,
          cumulative_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'asr',
        },
        {
          year: 2021,
          month: 6,
          language: 'Hindi',
          cumulative_contributions: 0.002,
          cumulative_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'asr',
        },
        {
          year: 2021,
          month: 4,
          cumulative_contributions: 0.02,
          cumulative_validations: 0,
          total_contribution_count: 1,
          total_validation_count: 0,
          type: 'ocr',
        },
        {
          year: 2021,
          month: 7,
          cumulative_contributions: 0.102,
          cumulative_validations: 2.02,
          total_contribution_count: 1,
          total_validation_count: 2,
          type: 'ocr',
        },
      ])
    );

    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <ProgressChart type={type} language={language} />
      </SWRConfig>
    );
    await waitFor(() => expect(fetchMock).toBeCalled());
    return renderResult;
  };

  async () => {
    verifyAxeTest(await setup('asr', undefined));
  };

  it('should render the component and matches it against stored snapshot', async () => {
    const { asFragment } = await setup('asr', undefined);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should fetch data from monthlyTimelineCumulative when language not specified', async () => {
    await setup('asr', undefined);

    expect(fetchMock).toBeCalledWith('/aggregated-json/monthlyTimelineCumulative.json');
  });

  it('should fetch data from monthlyTimeline when language is specified', async () => {
    await setup('asr', 'Hindi');

    expect(fetchMock).toBeCalledWith('/aggregated-json/monthlyTimeline.json');
  });

  it('should fetch data from quarterlyTimelineCumulative and monthlyTimelineCumulative when selected', async () => {
    await setup('asr', undefined);
    userEvent.click(screen.getByRole('button', { name: 'quarterly' }));

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/quarterlyTimelineCumulative.json');
    });

    userEvent.click(screen.getByRole('button', { name: 'monthly' }));

    await waitFor(() => {
      expect(fetchMock).toBeCalledWith('/aggregated-json/monthlyTimelineCumulative.json');
    });
  });

  it('should fetch data from monthlyTimelineCumulative when language not specified and time formatting is not needed', async () => {
    await setup('ocr', undefined);

    expect(fetchMock).toBeCalledWith('/aggregated-json/monthlyTimelineCumulative.json');
  });
});
