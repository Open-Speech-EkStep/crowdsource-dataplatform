import React, { useState } from 'react';
import LineChart from 'components/LineChart';
import { DEFAULT_LOCALE } from 'constants/localesConstants';
import { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PieChart from 'components/PieChart';
import BarChart from 'components/BarChart';
import MapChart from 'components/MapChart';

const ChartPage: NextPage = () => {
  const barChartColors1 = ['#F7CC56', '#F7CC56', '#F7CC56', '#EF8537'];
  const barChartColors2 = ['#5d6d9a', '#85A8F9', '#B7D0FE', '#6C85CE'];
  const [data] = useState<any>({
    id: 'line_chart',
    data: [
      {
        category: 'Male',
        value: 2025,
      },
      {
        category: 'Female',
        value: 1882,
      },
      {
        category: 'Specified',
        value: 1809,
      },
      {
        category: 'Others',
        value: 1322,
      },
    ],
    isScrollbar: false,
    colors: ['#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691', '#6C85CE'],
    tooltipTemplate: `<div>
            <h6 style="text-align: left; font-weight: bold">Not Specified</h6>
            <div>Contributed: <label>57  minute(s)</label></div>
            <div style="text-align: left;">Speakers: <label>8</label></div>
        </div>`,
    xAxisLabel: 'Month',
    yAxisLabel: 'Contribution (in hours)',
  });
  const [pieData] = useState<any>({
    id: 'pie_chart',
    data: [
      {
        category: 'Lithuania',
        value: 100.9,
      },
      {
        category: 'Czech Republic',
        value: 301.9,
      },
      {
        category: 'Ireland',
        value: 201.1,
      },
      {
        category: 'Germany',
        value: 165.8,
      },
      {
        category: 'Australia',
        value: 139.9,
      },
      {
        category: 'Austria',
        value: 128.3,
      },
    ],
    isScrollbar: false,
    colors: ['#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691', '#6C85CE'],
    tooltipTemplate: '',
  });

  const [mapData] = useState<any>({
    id: 'map_chart',
    data: [
      {
        id: 1,
        state: 'Uttar Pradesh',
        value1: '2.3',
        value2: '4.3',
        value3: '6.4',
        value4: '6.7',
      },
      {
        id: 2,
        state: 'Madhya Pradesh',
        value1: '2.3',
        value2: '4.3',
        value3: '6.4',
        value4: '6.7',
      },
    ],
    isScrollbar: false,
    colors: ['#4061BF', '#6B85CE', '#92A8E8', '#CDD8F6', '#E9E9E9'],
    tooltipTemplate: `<div style="text-align: left;">
            <h6>{state}</h6>
            <div style="text-align: left;">{value1} People</div>
            <div style="text-align: left;">
              <label>Transcribed: </label>
              <label style="margin-left: 8px">{value2}</label>
            </div>
            <div style="text-align: left;">
              Validated:  <label style="margin-left: 8px">{value3}</label>
            </div>
          </div>`,
  });

  return (
    <div className="row m-0">
      <div className="col-6">
        <PieChart id={pieData.id} data={pieData} />
      </div>
      <div className="col-6">
        <BarChart
          id="bar_chart"
          colors={barChartColors1}
          isScrollbar={true}
          data={data}
          yAxisLabel="Translations (in sentences)"
        />
      </div>
      <div className="col-6">
        <LineChart id="line_chart" data={data} />
      </div>
      <div className="col-6">
        <BarChart id="bar_chart2" colors={barChartColors2} data={data} yAxisLabel="Translations (in hours)" />
      </div>
      <div className="col-6">
        <MapChart id={mapData.id} data={mapData} />
      </div>
    </div>
  );
};

/* istanbul ignore next */
export const getStaticProps: GetStaticProps = async ({ locale = DEFAULT_LOCALE }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default ChartPage;
