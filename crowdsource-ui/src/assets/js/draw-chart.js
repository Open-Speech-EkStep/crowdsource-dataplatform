const fetch = require('./fetch');
const { generateIndiaMap } = require('./home-page-charts');
const { AGE_GROUP, INITIATIVES } = require('./constants');
const { calculateTime, formatTime, getJson, translate } = require('./utils');
const { isMobileDevice } = require('./common');
const $chartRow = $('.chart-row');
const $chartLoaders = $chartRow.find('.loader');
const $charts = $chartRow.find('.chart');
const $timelineLoader = $('#timeline-loader');
const $timelineChart = $('#timeline-chart');
const { context_root } = require('./env-api');
import origFetch from 'node-fetch';

const chartReg = {};

function getOrderedGenderData(formattedGenderData) {
  const orderedGenderData = [];
  const order = ['Female', 'Male', 'Others', 'Not Specified'];
  order.forEach(gender => {
    formattedGenderData.forEach(data => {
      if (gender.toLowerCase() === data.gender.toLowerCase()) {
        const index = orderedGenderData.findIndex(e => gender.toLowerCase() === e.gender.toLowerCase());
        if (index === -1) {
          orderedGenderData.push(data);
        } else {
          orderedGenderData[index].count += data.count;
        }
      }
    });
  });
  return orderedGenderData;
}

function getAgeGroupData(data, key) {
  const years = 'years';
  let formattedData = [];
  data.forEach(item => {
    if (AGE_GROUP.includes(item[key])) {
      item[key] === '' ? (item[key] = 'Not Specified') : (item[key] = `${item[key]} ${years}`);
      formattedData.push(item);
    }
  });
  return formattedData;
}

const getGenderData = genderData => {
  const genderOrder = ['male', 'female', 'not Specified', 'transgender'];
  const formattedGenderData = [];
  genderOrder.forEach(gender => {
    genderData.forEach(item => {
      let gType = item.gender;
      if (item.gender === '') item.gender = 'not Specified';
      if (
        item.gender.toLowerCase().indexOf('transgender') > -1 ||
        item.gender.toLowerCase().indexOf('rather') > -1
      )
        gType = 'transgender';
      if (gender === gType) {
        const genderType = gType.charAt(0).toUpperCase() + gType.slice(1);
        const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime(
          Number(item.hours_contributed) * 60 * 60,
          true
        );
        const contributedHours = formatTime(cHours, cMinutes, cSeconds);
        if (gType === 'transgender') {
          formattedGenderData.push({
            ...item,
            gender: translate('Others'),
            tooltipText: `
                                <div>
                                    <h6 class="text-sm-center text-lg-left text-md-left" style="font-weight: bold">${translate(
                                      item.gender
                                    )}</h6>
                                    <div>${translate('Contributed')}: <label>${contributedHours}</label></div>
                                    <div class="text-sm-center text-lg-left text-md-left">${translate(
                                      'Speakers'
                                    )}: <label>${item.speakers}</label></div>
                                </div>`,
          });
        } else {
          formattedGenderData.push({
            ...item,
            gender: translate(genderType),
            tooltipText: `
                                <div>
                                    <h6 class="text-sm-center text-lg-left text-md-left" style="font-weight: bold">${translate(
                                      genderType
                                    )}</h6>
                                    <div>${translate('Contributed')}: <label>${contributedHours}</label></div>
                                    <div class="text-sm-center text-lg-left text-md-left">${translate(
                                      'Speakers'
                                    )}: <label>${item.speakers}</label></div>
                                </div>`,
          });
        }
      }
    });
  });
  return formattedGenderData;
};

function updateGraph(language, timeframe, onlyTimeline) {
  if (onlyTimeline) {
    disposeChart('timeline-chart');

    $timelineLoader.show().addClass('d-flex');
    $timelineChart.addClass('d-none');
    buildTimelineGraph(language, timeframe);
  } else {
    am4core.disposeAllCharts();

    $chartLoaders.show().addClass('d-flex');
    $charts.addClass('d-none');
    $timelineLoader.addClass('d-none');
    buildGraphs(language, timeframe);
  }
}

const disposeChart = chartDiv => {
  if (chartReg[chartDiv]) {
    chartReg[chartDiv].dispose();
    delete chartReg[chartDiv];
  }
};

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

const buildTimelineGraph = (language, timeframe) => {
  const url = getTimelineUrl(language, timeframe);
  getJson(url)
    .then(data => {
      $timelineLoader.hide().removeClass('d-flex');
      $timelineChart.removeClass('d-none');
      data = data.filter(d => d.type == 'text') || [];
      data = language !== '' ? getLanguageSpecificData(data, language) : data;
      drawTimelineChart(data);
    })
    .catch(err => {
      console.log(err);
    });
};

function buildGraphs(language, timeframe) {
  const url = getTimelineUrl(language, timeframe);
  getJson(url)
    .then(timelineData => {
      timelineData = timelineData.filter(d => d.type == 'text') || [];
      timelineData = language !== '' ? getLanguageSpecificData(timelineData, language) : timelineData;
      drawTimelineChart(timelineData);
    })
    .catch(err => {
      console.log(err);
      $chartLoaders.show().addClass('d-flex');
      $charts.addClass('d-none');
    });

  var genderStatsUrl = '/aggregated-json/genderGroupContributions.json';
  var ageStatsUrl = '/aggregated-json/ageGroupContributions.json';
  if (language) {
    genderStatsUrl = '/aggregated-json/genderGroupAndLanguageContributions.json';
    ageStatsUrl = '/aggregated-json/ageGroupAndLanguageContributions.json';
  }

  Promise.all([getJson(genderStatsUrl), getJson(ageStatsUrl)])
    .then(function (responses) {
      return Promise.all(
        responses.map(function (response) {
          return response;
        })
      );
    })
    .then(data => {
      try {
        $chartLoaders.hide().removeClass('d-flex');
        $charts.removeClass('d-none');

        if (language) {
          data[0] = data[0].filter(d => d.language == language);
          data[1] = data[1].filter(d => d.language == language);
        }
        const genderData = getGenderData(data[0]);
        const ageGroupData = getAgeGroupData(data[1], 'age_group').sort(
          (a, b) => Number(a.speakers) - Number(b.speakers)
        );

        // Draw gender chart
        drawGenderChart(genderData);

        // Draw state chart
        generateIndiaMap(language, INITIATIVES.text);

        // Draw age group chart
        drawAgeGroupChart(ageGroupData);

        //lazy load other css
        setTimeout(() => {
          fetch('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css');
          fetch('https://fonts.googleapis.com/icon?family=Material+Icons');
          fetch('https://cdn.jsdelivr.net/npm/notyf@3.7.0/notyf.min.css');
          origFetch(`${context_root}/css/record.css`);
        }, 2000);
      } catch (error) {
        console.log(error);
        $chartLoaders.show().addClass('d-flex');
        $charts.addClass('d-none');
      }
    })
    .catch(err => {
      console.log(err);
    });
}

const drawAgeGroupChart = chartData => {
  const chartColors = ['#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691'];
  const chart = am4core.create('age-group-chart', am4charts.PieChart3D);
  chartData.forEach(data => (data.age_group = translate(data.age_group)));
  chart.data = chartData;
  chart.paddingBottom = 50;
  chart.innerRadius = am4core.percent(40);
  chart.depth = 50;
  chart.legend = new am4charts.Legend();
  chart.legend.labels.template.fill = am4core.color('#000');
  chart.legend.valueLabels.template.fill = am4core.color('#000');

  chart.legend.labels.template.textDecoration = 'none';
  chart.legend.valueLabels.template.textDecoration = 'none';
  chart.legend.itemContainers.template.paddingTop = 5;
  chart.legend.itemContainers.template.paddingBottom = 5;
  chart.legend.labels.template.fontSize = 12;

  const markerTemplate = chart.legend.markers.template;
  markerTemplate.width = 20;
  markerTemplate.height = 20;

  const activeLegend = chart.legend.labels.template.states.getKey('active');
  activeLegend.properties.textDecoration = 'line-through';

  const activeLegendLabel = chart.legend.valueLabels.template.states.getKey('active');
  activeLegendLabel.properties.textDecoration = 'line-through';

  chart.legend.valueLabels.template.align = 'right';
  chart.legend.valueLabels.template.fontSize = 12;
  chart.legend.valueLabels.template.textAlign = 'start';
  chart.legend.itemContainers.template.paddingLeft = 20;
  chart.legend.itemContainers.template.paddingRight = 20;

  const series = chart.series.push(new am4charts.PieSeries3D());
  series.labels.template.disabled = true;
  series.ticks.template.disabled = true;
  series.calculatePercent = true;
  series.slices.template.tooltipText =
    "{category}: [bold]{value.percent.formatNumber('#.0')}% ({value.value})[/]";
  series.dataFields.value = 'speakers';
  series.dataFields.depthValue = 'speakers';
  series.dataFields.category = 'age_group';
  series.slices.template.adapter.add('fill', function (fill, target) {
    return chartColors[target.dataItem.index];
  });
  chartReg['age-group-chart'] = chart;
};

const drawGenderChart = chartData => {
  const chartColors = ['#5d6d9a', '#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691'];
  am4core.ready(function () {
    const chart = am4core.create('gender-chart', am4charts.XYChart);
    chartData.forEach(item => {
      const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime(
        Number(item.hours_contributed) * 60 * 60,
        true
      );
      item.contributedHours = formatTime(cHours, cMinutes, cSeconds);
    });
    chart.data = chartData;
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'gender';
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.fill = '#000';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.grid.template.location = 0;
    let label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 120;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.labels.template.fill = '#000';
    valueAxis.renderer.grid.template.strokeDasharray = '3,3';
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.title.text = translate('Contribution (in hours)');
    valueAxis.title.fontSize = 12;
    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'hours_contributed';
    series.dataFields.categoryX = 'gender';
    const columnTemplate = series.columns.template;
    columnTemplate.tooltipHTML = `<div> {tooltipText}</div>`;
    columnTemplate.tooltipX = am4core.percent(50);
    columnTemplate.tooltipY = am4core.percent(0);
    if (isMobileDevice()) {
      series.tooltip.label.maxWidth = 160;
      series.tooltip.label.wrap = true;
    }

    columnTemplate.adapter.add('fill', function (fill, target) {
      return chartColors[chartColors.length - 1 - target.dataItem.index];
    });
    columnTemplate.adapter.add('stroke', function (stroke, target) {
      return chartColors[chartColors.length - 1 - target.dataItem.index];
    });

    chartReg['gender-chart'] = chart;

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
  });
};

const drawTimelineChart = timelineData => {
  am4core.ready(function () {
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    const chart = am4core.create('timeline-chart', am4charts.XYChart);

    const chartData = timelineData;
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
      chartData[i].contributedHours = formatTime(cHours, cMinutes, cSeconds);
      chartData[i].validatedHours = formatTime(vHours, vMinutes, vSeconds);
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
    hourAxis.title.text = translate('Contribution (in hours)');
    hourAxis.renderer.labels.template.fontSize = 12;
    hourAxis.title.fontSize = 12;

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'duration';
    series.dataFields.valueY = 'cumulative_contributions';
    series.strokeWidth = 3;
    series.tensionX = 0.8;
    series.tooltipHTML = `
            <div>
                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
                <div>${translate('Contributed')}: <label>{contributedHours}</label></div>
            </div>`;
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
    series.name = translate('Contributed');

    // Create series
    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = 'duration';
    series2.dataFields.valueY = 'cumulative_validations';
    series2.sequencedInterpolation = true;
    series2.tensionX = 0.8;
    series2.strokeWidth = 3;
    series2.tooltipHTML = `
        <div>
            <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
            <div style="text-align: left;">${translate('Validated')}: <label>{validatedHours}</label></div>
        </div>`;
    series2.tooltip.getFillFromObject = false;
    series2.tooltip.autoTextColor = false;
    series2.tooltip.background.fill = am4core.color('rgba(131,230,97,1)');
    series2.tooltip.label.fill = am4core.color('#000000');
    series2.stroke = am4core.color('#83E661');
    series2.name = translate('Validated');
    if (isMobileDevice()) {
      series2.tooltip.label.maxWidth = 150;
      series2.tooltip.label.wrap = true;
    }

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

module.exports = {
  updateGraph,
  buildGraphs,
  getOrderedGenderData,
  getGenderData,
  getAgeGroupData,
};
