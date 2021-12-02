const fetch = require('./fetch');
const { calculateTime, formatTime, getJson, translate } = require('./utils');
const { CURRENT_MODULE, INITIATIVES } = require('./constants');
import origFetch from 'node-fetch';
const { context_root } = require('./env-api');
const { isMobileDevice } = require('./common');

const $timelineLoader = $('#timeline-loader');
const $timelineChart = $('#timeline');

const chartReg = {};

const getTimelineUrl = (language, timeframe = 'weekly') => {
  let url = '/aggregated-json/' + timeframe + 'Timeline';
  if (!language) {
    url += 'Cumulative';
  }
  url += '.json';
  return url;
};
function getLanguageSpecificData(data, lang) {
  const returnData = [];
  data.forEach(item => {
    if (item.language.toLowerCase() === lang.toLowerCase()) {
      returnData.push(item);
    }
  });
  return returnData;
}
const drawTimelineChart = (timelineData, series1Name, series2Name) => {
  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    const chart = am4core.create('timeline-chart', am4charts.XYChart);

    const chartData = timelineData;

    const currentModule = localStorage.getItem(CURRENT_MODULE);
    for (let i = 0; i < chartData.length; i++) {
      if (!chartData[i].month) {
        chartData[i].month = chartData[i].quarter * 3 - 2;
      }
      chartData[i].duration = new Date(chartData[i].year, chartData[i].month - 1, 1);
      chartData[i].year = String(chartData[i].year);
      const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime(
        Number(chartData[i].cumulative_contributions) * 60 * 60,
        true
      );
      const { hours: vHours, minutes: vMinutes, seconds: vSeconds } = calculateTime(
        Number(chartData[i].cumulative_validations) * 60 * 60,
        true
      );
      chartData[i].contributedHours =
        currentModule == INITIATIVES.ocr.value || currentModule == INITIATIVES.parallel.value
          ? chartData[i].total_contribution_count
          : formatTime(cHours, cMinutes, cSeconds);
      chartData[i].validatedHours =
        currentModule == INITIATIVES.ocr.value || currentModule == INITIATIVES.parallel.value
          ? chartData[i].total_validation_count
          : formatTime(vHours, vMinutes, vSeconds);
    }

    let contributeTooltip;
    let validateTooltip;
    if (currentModule == INITIATIVES.asr.value) {
      contributeTooltip = `<div style="padding: 10px;">
                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
                <div>${translate('Transcribed')}: <label>{contributedHours}</label></div>
            </div>`;
      validateTooltip = `<div style="padding: 10px;">
            <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
            <div style="text-align: left;">${translate('Validated')}: <label>{validatedHours}</label></div>
        </div>`;
    }
    if (currentModule == INITIATIVES.parallel.value) {
      contributeTooltip = `<div style="padding: 10px;">
                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
                <div style="text-align: left;">${translate(
                  'Translated'
                )}: <label>{contributedHours}</label></div>
            </div>`;
      validateTooltip = `<div style="padding: 10px;">
            <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
            <div style="text-align: left;">${translate('Validated')}: <label>{validatedHours}</label></div>
        </div>`;
    }

    if (currentModule == INITIATIVES.ocr.value) {
      contributeTooltip = `<div style="padding: 10px;">
                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
                <div style="text-align: left;">${translate(
                  'Labelled'
                )}: <label>{contributedHours}</label></div>
            </div>`;
      validateTooltip = `<div style="padding: 10px;">
            <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
            <div style="text-align: left;">${translate('Validated')}: <label>{validatedHours}</label></div>
        </div>`;
    }

    chart.data = chartData;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 10;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.baseGrid.disabled = false;
    dateAxis.renderer.labels.template.fill = '#000';
    dateAxis.title.text = translate('Month');
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.title.fontSize = 12;

    dateAxis.events.on('sizechanged', function (ev) {
      const axis = ev.target;
      const cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    chart.paddingRight = 50;
    chart.paddingLeft = 50;
    dateAxis.renderer.labels.template.location = 0.5;

    const hourAxis = chart.yAxes.push(new am4charts.ValueAxis());
    hourAxis.min = 0;
    hourAxis.renderer.minGridDistance = 50;
    hourAxis.renderer.grid.template.strokeDasharray = '3,3';
    hourAxis.tooltip.disabled = true;
    hourAxis.renderer.labels.template.fill = '#000';
    hourAxis.title.text =
      currentModule == INITIATIVES.ocr.value
        ? translate('Images')
        : currentModule == INITIATIVES.parallel.value
        ? translate('Sentences')
        : translate('Contribution (in hours)');
    hourAxis.renderer.labels.template.fontSize = 12;
    hourAxis.title.fontSize = 12;

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'duration';
    series.dataFields.valueY =
      currentModule == INITIATIVES.ocr.value || currentModule == INITIATIVES.parallel.value
        ? 'total_contribution_count'
        : 'cumulative_contributions';
    series.strokeWidth = 3;
    series.tensionX = 0.8;
    series.tooltipHTML = contributeTooltip;
    series.tooltip.getFillFromObject = false;
    series.tooltip.autoTextColor = false;
    series.tooltip.background.fill = am4core.color('rgba(252,194,50,1)');
    series.tooltip.label.fill = am4core.color('#000000');
    series.sequencedInterpolation = true;
    if (isMobileDevice()) {
      series.tooltip.label.maxWidth = 150;
      series.tooltip.label.wrap = true;
    }
    series.stroke = am4core.color('#FCC232');
    series.name = translate(series1Name);

    // Create series
    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = 'duration';
    series2.dataFields.valueY =
      currentModule == INITIATIVES.ocr.value || currentModule == INITIATIVES.parallel.value
        ? 'total_validation_count'
        : 'cumulative_validations';
    series2.sequencedInterpolation = true;
    series2.tensionX = 0.8;
    series2.tooltipHTML = validateTooltip;
    series2.tooltip.getFillFromObject = false;
    series2.tooltip.autoTextColor = false;
    series2.tooltip.background.fill = am4core.color('rgba(131,230,97,1)');
    series2.tooltip.label.fill = am4core.color('#000000');
    if (isMobileDevice()) {
      series2.tooltip.label.maxWidth = 150;
      series2.tooltip.label.wrap = true;
    }
    series2.strokeWidth = 3;
    series2.stroke = am4core.color('#83E661');
    series2.name = translate(series2Name);

    if (chartData.length === 1) {
      const circleBullet = series.bullets.push(new am4charts.CircleBullet());
      circleBullet.circle.fill = am4core.color('#FCC232');
      // circleBullet.circle.strokeWidth = 3;

      const circleBullet2 = series2.bullets.push(new am4charts.CircleBullet());
      circleBullet2.circle.fill = am4core.color('#83E661');
      // circleBullet2.circle.strokeWidth = 3;
    }

    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.fontSize = 12;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    chartReg['timeline-chart'] = chart;
  });
};

const disposeLineChart = chartDiv => {
  if (chartReg[chartDiv]) {
    chartReg[chartDiv].dispose();
    delete chartReg[chartDiv];
  }
};

function updateLineGraph(language, timeframe, module, series1Name, series2Name) {
  disposeLineChart('timeline-chart');
  $timelineLoader.show().addClass('d-flex');
  $timelineChart.addClass('d-none');
  buildLineGraphs(language, timeframe, module, series1Name, series2Name);
}

function buildLineGraphs(language, timeframe, module, series1Name, series2Name) {
  const url = getTimelineUrl(language, timeframe);

  getJson(url)
    .then(data => {
      try {
        data = data.filter(d => d.type == module.type) || [];
        data = language !== '' ? getLanguageSpecificData(data, language) : data;
        $timelineLoader.hide().removeClass('d-flex');
        $timelineChart.removeClass('d-none');
        drawTimelineChart(data, series1Name, series2Name);

        //lazy load other css
        setTimeout(() => {
          fetch('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css');
          fetch('https://fonts.googleapis.com/icon?family=Material+Icons');
          fetch('https://cdn.jsdelivr.net/npm/notyf@3.7.0/notyf.min.css');
          origFetch(`${context_root}/css/record.css`);
        }, 2000);
      } catch (error) {
        console.log(error);
        $timelineLoader.show().addClass('d-flex');
        $timelineChart.addClass('d-none');
      }
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  buildLineGraphs,
  disposeLineChart,
  updateLineGraph,
};
