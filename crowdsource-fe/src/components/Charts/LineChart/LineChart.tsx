import { useRef, useEffect } from 'react';

import {
  XYChart,
  ValueAxis,
  DateAxis,
  Legend,
  LineSeries,
  CircleBullet,
  XYCursor,
} from '@amcharts/amcharts4/charts';
import { create, color } from '@amcharts/amcharts4/core';

import { isMobileDevice } from 'utils/utils';

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
    let x = create('LineChart', XYChart);

    x.paddingRight = 20;
    x.data = props.data;

    const dateAxis = x.xAxes.push(new DateAxis());
    dateAxis.renderer.minGridDistance = 10;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.baseGrid.disabled = false;
    dateAxis.renderer.labels.template.fill = color('#000');
    dateAxis.title.text = props.xAxisLabel || '';
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.title.fontSize = 12;

    const label = dateAxis.renderer.labels.template;
    label.maxWidth = 120;

    /* istanbul ignore next */
    if (isMobileDevice()) {
      label.maxWidth = 80;
    }
    label.truncate = true;
    label.tooltipText = '{category}';

    /* istanbul ignore next */
    dateAxis.events.on('sizechanged', function (ev) {
      var axis = ev.target;
      var cellWidth;
      if (isMobileDevice()) {
        cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      } else {
        cellWidth = axis.pixelWidth;
      }
      if (cellWidth < axis.renderer.labels.template.maxWidth) {
        axis.renderer.labels.template.rotation = -45;
        axis.renderer.labels.template.horizontalCenter = 'right';
        axis.renderer.labels.template.verticalCenter = 'middle';
      } else {
        axis.renderer.labels.template.rotation = 0;
        axis.renderer.labels.template.horizontalCenter = 'middle';
        axis.renderer.labels.template.verticalCenter = 'top';
      }
    });
    dateAxis.renderer.minLabelPosition = 0.05;
    dateAxis.renderer.maxLabelPosition = 0.95;
    dateAxis.renderer.labels.template.location = 0.5;

    let valueAxis: any = x.yAxes.push(new ValueAxis());
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
    var lineSeries1: any = x.series.push(new LineSeries());
    lineSeries1.dataFields.dateX = 'category';
    lineSeries1.dataFields.valueY = 'value1';
    lineSeries1.strokeWidth = 3;
    lineSeries1.tensionX = 0.8;
    lineSeries1.tooltipHTML = props.line1Tooltip;
    lineSeries1.tooltip.getFillFromObject = false;
    lineSeries1.tooltip.autoTextColor = false;
    lineSeries1.tooltip.background.fill = color('rgba(252,194,50,1)');
    lineSeries1.tooltip.label.fill = color('#000000');

    /* istanbul ignore next */
    if (isMobileDevice()) {
      lineSeries1.tooltip.label.maxWidth = 150;
      lineSeries1.tooltip.label.wrap = true;
    }
    lineSeries1.sequencedInterpolation = true;
    lineSeries1.stroke = color('#FCC232');
    lineSeries1.name = props.line1Text || '';

    // Create series 2
    var lineSeries2: any = x.series.push(new LineSeries());
    lineSeries2.dataFields.dateX = 'category';
    lineSeries2.dataFields.valueY = 'value2';
    lineSeries2.sequencedInterpolation = true;
    lineSeries2.tensionX = 0.8;
    lineSeries2.tooltipHTML = props.line2Tooltip;
    lineSeries2.tooltip.getFillFromObject = false;
    lineSeries2.tooltip.autoTextColor = false;
    lineSeries2.tooltip.background.fill = color('rgba(131,230,97,1)');
    lineSeries2.tooltip.label.fill = color('#000000');

    /* istanbul ignore next */
    if (isMobileDevice()) {
      lineSeries2.tooltip.label.maxWidth = 150;
      lineSeries2.tooltip.label.wrap = true;
    }
    lineSeries2.strokeWidth = 3;
    lineSeries2.stroke = color('#83E661');
    lineSeries2.name = props.line2Text || '';

    /* istanbul ignore next */
    if (props.data.length === 1) {
      const circleBullet = lineSeries1.bullets.push(new CircleBullet());
      circleBullet.circle.fill = color('#FCC232');

      const circleBullet2 = lineSeries2.bullets.push(new CircleBullet());
      circleBullet2.circle.fill = color('#83E661');
    }

    x.legend = new Legend();
    x.legend.labels.template.fontSize = 12;

    // Add cursor
    x.cursor = new XYCursor();
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
