import React, { useRef, useLayoutEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';

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

const MapChart = (props: ChartProps | any) => {
  const chart = useRef({});
  console.log(props);

  useLayoutEffect(() => {
    let polygonSeries: any;
    let quarterVal = 0.25;
    var x = am4core.create(props.id, am4maps.MapChart);
    const index = x.series.indexOf(polygonSeries);
    if (index > -1) {
      x.series.removeIndex(index);
    }

    let toolTipContent = props.data.tooltipTemplate;
    x.geodataSource.url = 'https://crowdsource1.blob.core.windows.net/vakyansh-json-data/india2020Low.json';
    x.projection = new am4maps.projections.Miller();
    polygonSeries = new am4maps.MapPolygonSeries();
    x.seriesContainer.draggable = false;
    x.seriesContainer.resizable = false;
    x.chartContainer.wheelable = false;
    x.maxZoomLevel = 1;
    polygonSeries.useGeodata = true;
    polygonSeries.data = props.data.data;
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipHTML = toolTipContent;
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;
    polygonTemplate.stroke = am4core.color('#929292');
    polygonTemplate.fill = am4core.color('#fff');

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create('hover');
    hs.properties.fill = x.colors.getIndex(1).brighten(-0.5);
    polygonSeries.mapPolygons.template.adapter.add('fill', function (fill: any, target: any) {
      if (target.dataItem) {
        if (true) {
          console.log(target.dataItem.value);
          if (target.dataItem.value >= quarterVal * 3) {
            return am4core.color(props.data.colors[0]);
          } else if (target.dataItem.value >= quarterVal * 2) {
            return am4core.color(props.data.colors[1]);
          } else if (target.dataItem.value >= quarterVal) {
            return am4core.color(props.data.colors[2]);
          } else if (target.dataItem.value > 0) {
            return am4core.color(props.data.colors[3]);
          } else {
            return am4core.color(props.data.colors[4]);
          }
        } else {
          if (target.dataItem.value >= 500) {
            return am4core.color('#4061BF');
          } else if (target.dataItem.value >= 200) {
            return am4core.color('#6B85CE');
          } else if (target.dataItem.value >= 100) {
            return am4core.color('#92A8E8');
          } else if (target.dataItem.value > 0) {
            return am4core.color(props.data.colors[3]);
          } else {
            return am4core.color(props.data.colors[4]);
          }
        }
      }
      return fill;
    });

    x.series.push(polygonSeries);
    x.events.on('sizechanged', () => {
      x.projection = new am4maps.projections.Miller();
    });

    chart.current = x;

    return () => {
      x.dispose();
    };
  }, []);

  return <div id={props.id} style={{ width: '100%', height: '500px' }}></div>;
};

export default MapChart;
