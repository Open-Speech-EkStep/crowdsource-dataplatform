import { useRef, useEffect } from 'react';

import { PieChart3D, PieSeries3D, Legend } from '@amcharts/amcharts4/charts';
import { create, color, percent } from '@amcharts/amcharts4/core';

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

  useEffect(() => {
    var x = create(props.id, PieChart3D);
    x.hiddenState.properties.opacity = 0;

    x.data = props.data.data;

    x.innerRadius = percent(40);
    x.depth = 20;

    x.legend = new Legend();

    var series = x.series.push(new PieSeries3D());
    series.dataFields.value = 'value';
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;
    series.dataFields.depthValue = 'value';
    series.dataFields.category = 'category';
    series.slices.template.cornerRadius = 5;
    /* istanbul ignore next */
    series.slices.template.adapter.add('fill', (value, target: any) => {
      return color(props.data.colors[target.dataItem.index]);
    });

    chart.current = x;

    return () => {
      x.dispose();
    };
  }, [props.data.colors, props.data.data, props.id]);

  return <div id={props.id} className="h-100"></div>;
};

export default PieChart;
