import { useRef, useEffect } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

interface ChartProps {
  data: Array<
    | {
        month: number;
        category: number;
        year: number;
        value1: number;
        contributionText: string;
        value2: number;
        validationText: string;
      }
    | {}
  >;
  xAxisLabel?: string;
  yAxisLabel?: string;
  line1Text?: string;
  line2Text?: string;
  line1Tooltip: string;
  line2Tooltip: string;
}

const LineChart = (props: ChartProps) => {
  const chart = useRef({});

  useEffect(() => {
    let x = am4core.create('LineChart', am4charts.XYChart);

    x.paddingRight = 20;
    x.data = props.data;

    const dateAxis = x.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 10;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.baseGrid.disabled = false;
    dateAxis.renderer.labels.template.fill = am4core.color('#000');
    dateAxis.title.text = props.xAxisLabel || '';
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.title.fontSize = 12;
    // dateAxis.dateFormats.setKey("month", "MMMM");
    // dateAxis.periodChangeDateFormats.setKey("month", "MMM");
    // dateAxis.periodChangeDateFormats.setKey("day", "MMMM");

    /* istanbul ignore next */
    dateAxis.events.on('sizechanged', function (ev) {
      var axis = ev.target;
      var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    x.paddingRight = 50;
    x.paddingLeft = 50;
    dateAxis.renderer.minLabelPosition = 0.05;
    dateAxis.renderer.maxLabelPosition = 0.95;
    dateAxis.renderer.labels.template.location = 0.5;

    let valueAxis: any = x.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.labels.template.fill = '#142745';
    valueAxis.renderer.grid.template.strokeDasharray = '3,3';
    valueAxis.renderer.labels.template.fontSize = 14;
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.title.text = props.yAxisLabel || '';
    valueAxis.title.fill = '#142745';
    valueAxis.title.fontSize = 14;
    valueAxis.title.lineHeight = 17;
    valueAxis.title.opacity = 0.6;

    // Create series 1
    var lineSeries1: any = x.series.push(new am4charts.LineSeries());
    lineSeries1.dataFields.dateX = 'category';
    lineSeries1.dataFields.valueY = 'value1';
    lineSeries1.strokeWidth = 3;
    lineSeries1.tensionX = 0.8;
    lineSeries1.tooltipHTML = props.line1Tooltip;
    lineSeries1.tooltip.getFillFromObject = false;
    lineSeries1.tooltip.autoTextColor = false;
    lineSeries1.tooltip.background.fill = am4core.color('rgba(252,194,50,0.2)');
    lineSeries1.tooltip.label.fill = am4core.color('#000000');
    lineSeries1.sequencedInterpolation = true;
    lineSeries1.stroke = am4core.color('#FCC232');
    lineSeries1.name = props.line1Text || '';

    // Create series 2
    var lineSeries2: any = x.series.push(new am4charts.LineSeries());
    lineSeries2.dataFields.dateX = 'category';
    lineSeries2.dataFields.valueY = 'value2';
    lineSeries2.sequencedInterpolation = true;
    lineSeries2.tensionX = 0.8;
    lineSeries2.tooltipHTML = props.line2Tooltip;
    lineSeries2.tooltip.getFillFromObject = false;
    lineSeries2.tooltip.autoTextColor = false;
    lineSeries2.tooltip.background.fill = am4core.color('rgba(131,230,97,0.2)');
    lineSeries2.tooltip.label.fill = am4core.color('#000000');
    lineSeries2.strokeWidth = 3;
    lineSeries2.stroke = am4core.color('#83E661');
    lineSeries2.name = props.line2Text || '';

    /* istanbul ignore next */
    if (props.data.length === 1) {
      const circleBullet = lineSeries1.bullets.push(new am4charts.CircleBullet());
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
  }, [
    props.data,
    props.line1Text,
    props.line1Tooltip,
    props.line2Text,
    props.line2Tooltip,
    props.xAxisLabel,
    props.yAxisLabel,
  ]);

  return <div id="LineChart" className="h-100" />;
};

export default LineChart;
