/* eslint-disable import/no-internal-modules */
import React, { useRef, useLayoutEffect } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

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

const BarChart = (props: ChartProps | any) => {
  const chart = useRef({});

  useLayoutEffect(() => {
    let x = am4core.create(props.id, am4charts.XYChart);

    x.paddingRight = 20;
    x.data = props.data.data;
    // Create axes
    const categoryAxis = x.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.minGridDistance = 20;
    // categoryAxis.renderer.labels.template.fill = rgb(0,0,0);
    categoryAxis.renderer.grid.template.strokeWidth = 0;
    // categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.grid.template.location = 0;
    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;

    let valueAxis: any = x.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.labels.template.fill = '#142745';
    valueAxis.renderer.grid.template.strokeDasharray = '3,3';
    valueAxis.renderer.labels.template.fontSize = 14;
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.title.text = props.data.yAxisLabel;
    valueAxis.title.fill = '#142745';
    valueAxis.title.fontSize = 14;
    valueAxis.title.lineHeight = 17;
    valueAxis.title.opacity = 0.6;
    valueAxis.renderer.grid.template.strokeWidth = 0;

    const series: any = x.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';

    series.dataFields.categoryX = 'category';
    const columnTemplate = series.columns.template;
    columnTemplate.tooltipHTML = props.data.tooltipTemplate;
    columnTemplate.tooltipX = am4core.percent(50);
    columnTemplate.tooltipY = am4core.percent(0);
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color('#333333');
    columnTemplate.tooltipX = am4core.percent(50);
    columnTemplate.tooltipY = am4core.percent(0);
    columnTemplate.adapter.add('fill', (value: any, target: any) => {
      return am4core.color(props.data.colors[props.data.colors.length - 1 - target.dataItem.index]);
    });
    columnTemplate.adapter.add('stroke', (value: any, target: any) => {
      console.log(props.data.colors, target.dataItem.index);
      return am4core.color(props.data.colors[props.data.colors.length - 1 - target.dataItem.index]);
    });
    if (props.data.isScrollbar) {
      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      x.scrollbarX = scrollbarX;
    }

    chart.current = x;

    return () => {
      x.dispose();
    };
  }, [props]);

  return <div id={props.id} style={{ width: '100%', height: '500px' }}></div>;
};

export default BarChart;
