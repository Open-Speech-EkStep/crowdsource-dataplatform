import { useRef, useEffect, useState } from 'react';

import * as am4core from '@amcharts/amcharts4/core';
import * as maps from '@amcharts/amcharts4/maps';
import { useTranslation } from 'next-i18next';

import type { UnSpecifiedDataByState } from 'types/CumulativeDataByLanguageAndState';

import styles from './MapChart.module.scss';

interface ChartProps {
  sourceUrl: string;
  data: Array<Object>;
  quarterUnit: number;
  colors?: Array<string>;
  isScrollbar?: boolean;
  tooltipTemplate?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  anonymousStateData: UnSpecifiedDataByState;
}

const getStateBg = function (value: number, quarterUnit: number): string {
  if (value >= quarterUnit * 3) {
    return 'stateBgDarker';
  } else if (value >= quarterUnit * 2) {
    return 'stateBgDark';
  } else if (value >= quarterUnit) {
    return 'stateBgLight';
  } else if (value > 0) {
    return 'stateBgLighter';
  } else {
    return 'stateBgDefault';
  }
};

const MapChart = ({
  sourceUrl,
  data,
  colors,
  tooltipTemplate,
  quarterUnit,
  anonymousStateData,
}: ChartProps) => {
  const chart = useRef({});
  const { t } = useTranslation();

  const [isUnspecifiedPopUp, setUnspecifiedPopUp] = useState(false);

  useEffect(() => {
    let polygonSeries: any;
    var x = am4core.create('indiaMapChart', maps.MapChart);
    const index = x.series.indexOf(polygonSeries);
    /* istanbul ignore next */
    if (index > -1) {
      x.series.removeIndex(index);
    }

    let toolTipContent = tooltipTemplate;
    x.geodataSource.url = sourceUrl;
    x.projection = new maps.projections.Miller();
    polygonSeries = new maps.MapPolygonSeries();
    x.seriesContainer.draggable = false;
    x.seriesContainer.resizable = false;
    x.chartContainer.wheelable = false;
    x.maxZoomLevel = 1;
    polygonSeries.useGeodata = true;
    polygonSeries.data = data;
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipHTML = toolTipContent;
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;
    polygonTemplate.stroke = am4core.color('#929292');
    polygonTemplate.fill = am4core.color('#fff');

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create('hover');
    hs.properties.fill = x.colors.getIndex(1).brighten(-0.5);
    /* istanbul ignore next */
    polygonSeries.mapPolygons.template.adapter.add('fill', function (fill: any, target: any) {
      if (target.dataItem) {
        if (target.dataItem.value >= quarterUnit * 3) {
          return am4core.color(colors ? colors[0] : '#4061BF');
        } else if (target.dataItem.value >= quarterUnit * 2) {
          return am4core.color(colors ? colors[1] : '#6B85CE');
        } else if (target.dataItem.value >= quarterUnit) {
          return am4core.color(colors ? colors[2] : '#92A8E8');
        } else if (target.dataItem.value > 0) {
          return am4core.color(colors ? colors[3] : '#CDD8F6');
        } else {
          return am4core.color(colors ? colors[4] : '#E9E9E9');
        }
      } else {
        if (target.dataItem.value >= 500) {
          return am4core.color('#4061BF');
        } else if (target.dataItem.value >= 200) {
          return am4core.color('#6B85CE');
        } else if (target.dataItem.value >= 100) {
          return am4core.color('#92A8E8');
        } else if (target.dataItem.value > 0) {
          return am4core.color(colors ? colors[3] : '#CDD8F6');
        } else {
          return am4core.color(colors ? colors[4] : '#E9E9E9');
        }
      }
    });

    x.series.push(polygonSeries);
    /* istanbul ignore next */
    x.events.on('sizechanged', () => {
      x.projection = new maps.projections.Miller();
    });

    chart.current = x;

    return () => {
      x.dispose();
    };
  }, [colors, data, quarterUnit, sourceUrl, tooltipTemplate]);

  const stateBg: string = getStateBg(anonymousStateData.value, quarterUnit);

  return (
    <>
      <div id="indiaMapChart" className="h-100" />
      <div
        className={`${styles.statePopover} ${styles[stateBg]} ${
          isUnspecifiedPopUp ? styles.show : styles.hide
        }`}
        id="state-popover"
        data-testid="statePopover"
      >
        <div>
          <h6>{t('UnspecifiedLocation')}</h6>
          <div>
            {anonymousStateData.speakers} {t('people')}
          </div>
          <div>
            {anonymousStateData.contributionText}: {anonymousStateData.contribution}
          </div>
          <div>
            {anonymousStateData.validationText}: {anonymousStateData.validation}
          </div>
        </div>
        <span className={styles.bottomTip}></span>
      </div>
      <div className="text-left mb-1">
        <span
          id="unspecifiedLocation"
          className={styles.unspecifiedLocation}
          role="button"
          tabIndex={0}
          onMouseEnter={() => setUnspecifiedPopUp(true)}
          onMouseLeave={() => setUnspecifiedPopUp(false)}
        >
          *{t('UnspecifiedLocation')}
        </span>
      </div>
    </>
  );
};

export default MapChart;
