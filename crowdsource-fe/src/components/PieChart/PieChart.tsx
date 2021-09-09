import React, { useRef, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

interface ChartProps {
  id: string;
  data: {
    data: Array<any>;
    colors?: Array<string>;
    isScrollbar?: boolean;
    tooltipTemplate?: string;
    xAxisLabel?: string | any;
    yAxisLabel?: string | any;
  };
}

const PieChart = (props: ChartProps | any) => {
  const chart = useRef({});
  console.log(props);

  useLayoutEffect(() => {
    var x = am4core.create(props.id, am4charts.PieChart3D);
    x.hiddenState.properties.opacity = 0;

    x.data = props.data.data;

    x.innerRadius = am4core.percent(40);
    x.depth = 120;

    x.legend = new am4charts.Legend();

    var series = x.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = 'value';
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;
    series.dataFields.depthValue = 'value';
    series.dataFields.category = 'category';
    series.slices.template.cornerRadius = 5;
    series.colors.step = 3;
    series.slices.template.adapter.add('fill', (value, target: any, key) => {
      return am4core.color(props.data.colors[target.dataItem.index]);
    });

    chart.current = x;

    return () => {
      x.dispose();
    };
  }, []);

  return <div id={props.id} style={{ width: '100%', height: '500px' }}></div>;
};

export default PieChart;
