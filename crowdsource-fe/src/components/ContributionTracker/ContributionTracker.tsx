import React, { useState } from 'react';

// import { BarChart } from 'components/Charts';
import type { ChartPropModel } from 'interface';

const ContributionTracker = () => {
  const [chartData] = useState<ChartPropModel>({
    data: [
      {
        category: 'Male',
        value: 2025,
      },
      {
        category: 'Tens',
        value: 100,
      },
      {
        category: 'Ones',
        value: 500,
      },
      {
        category: 'Twos',
        value: 1000,
      },
    ],
    colors: ['#F7CC56', '#F7CC56', '#F7CC56', '#EF8537'],
    xAxisLabel: 'Month',
    yAxisLabel: 'Contribution (in hours)',
  });

  console.log(chartData);

  //   const { data: topLanguagesByHoursData, error } = useFetch<Array<TopLanguagesByHoursModel>>(
  //     apiPaths.topLanguagesByHoursContributed
  //   );

  //   const { data: topLanguagesBySpeakerData, error: error1 } = useFetch<Array<TopLanguagesBySpeakerModel>>(
  //     apiPaths.topLanguagesBySpeakerContributions
  //   );

  //   if (topLanguagesByHoursData && topLanguagesByHoursData.length) {
  //     console.log(topLanguagesByHoursData, 'topLanguagesByHoursData');
  //     setChartData({
  //       ...chartData,
  //       data: topLanguagesByHoursData,
  //     });
  //   }

  //   console.log(topLanguagesByHoursData, topLanguagesBySpeakerData, error, error1, chartData);

  return (
    <div className="" data-testid="ContributionTracker">
      {/* <BarChart id="bar_chart" data={chartData} /> */}
    </div>
  );
};

export default ContributionTracker;
