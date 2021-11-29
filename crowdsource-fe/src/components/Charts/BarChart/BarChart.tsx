import { useRef, useLayoutEffect } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

import type { ChartDetails } from 'types/Chart';
import { isMobileDevice } from 'utils/utils';

interface ChartProps {
  id: string;
  data: ChartDetails;
  labelClass?: string;
}

const BarChart = ({ id, data, labelClass = 'amXAxisLabel' }: ChartProps) => {
  const chart = useRef({});

  useLayoutEffect(() => {
    const x = am4core.create(id, am4charts.XYChart);

    x.paddingRight = 20;
    x.data = data.data;
    // Create axes
    const categoryAxis = x.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.grid.template.strokeWidth = 0;
    // categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fontSize = 14;
    // categoryAxis.renderer.labels.template.html = `<span class=${labelClass}>{category}</span>`;
    categoryAxis.renderer.grid.template.location = 0;
    const label = categoryAxis.renderer.labels.template;
    label.maxWidth = 120;

    /* istanbul ignore next */
    if (isMobileDevice()) {
      label.maxWidth = 80;
    }
    label.truncate = true;
    label.tooltipText = '{category}';

    /* istanbul ignore next */
    categoryAxis.events.on('sizechanged', function (ev) {
      var axis = ev.target;
      var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
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

    const valueAxis: any = x.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.labels.template.fill = '#142745';
    valueAxis.renderer.grid.template.strokeDasharray = '3,3';
    valueAxis.renderer.labels.template.fontSize = 14;
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.title.text = data.yAxisLabel;
    valueAxis.title.fill = '#142745';
    valueAxis.title.fontSize = 14;
    valueAxis.title.lineHeight = 17;
    valueAxis.title.opacity = 0.6;
    valueAxis.renderer.grid.template.strokeWidth = data.strokeWidth || 0;

    const series: any = x.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';

    series.dataFields.categoryX = 'category';
    const columnTemplate = series.columns.template;
    columnTemplate.tooltipHTML = `<div>{tooltipText}</div>`;
    columnTemplate.tooltipX = am4core.percent(50);
    columnTemplate.tooltipY = am4core.percent(0);

    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color('#fff');
    /* istanbul ignore next */
    if (data.bgColor) {
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color(data.bgColor);
    }

    if (isMobileDevice()) {
      series.tooltip.label.maxWidth = 160;
      series.tooltip.label.wrap = true;
    }

    /* istanbul ignore next */
    columnTemplate.adapter.add('fill', (value: any, target: any) => {
      return am4core.color(data.colors?.[data.colors.length - 1 - target.dataItem.index]);
    });
    /* istanbul ignore next */
    columnTemplate.adapter.add('stroke', (value: any, target: any) => {
      return am4core.color(data.colors?.[data.colors.length - 1 - target.dataItem.index]);
    });
    chart.current = x;

    return () => {
      x.dispose();
    };
  }, [id, data, labelClass]);

  return <div id={id} className="h-100"></div>;
};

export default BarChart;
