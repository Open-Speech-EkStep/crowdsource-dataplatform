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

const LineChart = (props: ChartProps) => {
  const chart = useRef({});
  console.log(props);

  useLayoutEffect(() => {
    let x = am4core.create(props.id, am4charts.XYChart);

    x.paddingRight = 20;
    console.log(props.data.data);
    var data = [];
    var price1 = 1000,
      price2 = 1200;
    var quantity = 30000;
    for (var i = 0; i < 10; i++) {
      price1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
      data.push({ date1: new Date(2015, 0, i), price1: price1 });
    }
    for (var i = 0; i < 10; i++) {
      price2 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
      data.push({ date2: new Date(2015, 0, i), price2: price2 });
    }
    x.data = data;

    const dateAxis = x.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 10;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.baseGrid.disabled = false;
    dateAxis.renderer.labels.template.fill = am4core.color('#000');
    dateAxis.title.text = props.data.xAxisLabel;
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.title.fontSize = 12;

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

    // Create series
    var lineSeries: any = x.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.dateX = 'date1';
    lineSeries.dataFields.valueY = 'price1';
    lineSeries.strokeWidth = 3;
    lineSeries.tensionX = 0.8;
    // lineSeries.tooltipHTML = contributeTooltip;
    lineSeries.tooltip.getFillFromObject = false;
    lineSeries.tooltip.autoTextColor = false;
    lineSeries.tooltip.background.fill = am4core.color('rgba(252,194,50,0.2)');
    lineSeries.tooltip.label.fill = am4core.color('#000000');
    lineSeries.sequencedInterpolation = true;
    lineSeries.stroke = am4core.color('#FCC232');
    lineSeries.name = 'Contribution';

    // Create seriesc
    var lineSeries2: any = x.series.push(new am4charts.LineSeries());
    lineSeries2.dataFields.dateX = 'date2';
    lineSeries2.dataFields.valueY = 'price2';
    lineSeries2.sequencedInterpolation = true;
    lineSeries2.tensionX = 0.8;
    // lineSeries2.tooltipHTML = validateTooltip;
    lineSeries2.tooltip.getFillFromObject = false;
    lineSeries2.tooltip.autoTextColor = false;
    lineSeries2.tooltip.background.fill = am4core.color('rgba(131,230,97,0.2)');
    lineSeries2.tooltip.label.fill = am4core.color('#000000');
    lineSeries2.strokeWidth = 3;
    lineSeries2.stroke = am4core.color('#83E661');
    lineSeries2.name = 'Validation';

    if (props.data.data.length === 1) {
      const circleBullet = lineSeries.bullets.push(new am4charts.CircleBullet());
      circleBullet.circle.fill = am4core.color('#FCC232');

      const circleBullet2 = lineSeries2.bullets.push(new am4charts.CircleBullet());
      circleBullet2.circle.fill = am4core.color('#83E661');
    }

    x.legend = new am4charts.Legend();
    x.legend.labels.template.fontSize = 12;

    // Add cursor
    x.cursor = new am4charts.XYCursor();
    x.cursor.xAxis = dateAxis;

    chart.current = x;

    return () => {
      x.dispose();
    };
  }, []);

  return <div id={props.id} style={{ width: '100%', height: '500px' }}></div>;
};

export default LineChart;
