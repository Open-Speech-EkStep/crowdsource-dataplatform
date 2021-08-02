const fetch = require('./fetch')
const { calculateTime, formatTime, getJson } = require('./utils');
const { CURRENT_MODULE, MODULE } = require('./constants');

const $timelineLoader = $('#timeline-loader');
const $timelineChart = $('#timeline');

const chartReg = {};

const getTimelineUrl = (language, timeframe = "weekly") => {
  let url = "/aggregated-json/" + timeframe + "Timeline";
  if (!language) {
      url += "Cumulative"
  }
  url += ".json";
  return url;
}
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
    const chart = am4core.create("timeline-chart", am4charts.XYChart);
    
    const chartData = timelineData;
   
    const currentModule = localStorage.getItem(CURRENT_MODULE);
    for (let i = 0; i < chartData.length; i++) {
      if (!chartData[i].month) {
        chartData[i].month = chartData[i].quarter * 3;
      }
      chartData[i].duration = new Date(chartData[i].year, chartData[i].month - 1, 1);
      chartData[i].year = String(chartData[i].year);
      const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime((Number(chartData[i].cumulative_contributions) * 60 * 60), true);
      const { hours: vHours, minutes: vMinutes, seconds: vSeconds } = calculateTime((Number(chartData[i].cumulative_validations) * 60 * 60), true);
      chartData[i].contributedHours = currentModule == "dekho" || currentModule == "likho" ? chartData[i].total_contribution_count :  formatTime(cHours, cMinutes, cSeconds);
      chartData[i].validatedHours = currentModule == "dekho" || currentModule == "likho" ? chartData[i].total_validation_count : formatTime(vHours, vMinutes, vSeconds);
    }

    let tooltipContent
    if(currentModule == MODULE.suno.value){
    tooltipContent = `<div style="padding: 10px;">
                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
                <div>Transcribed: <label>{contributedHours}</label></div>
                <div style="text-align: left;">Validated: <label>{validatedHours}</label></div>
            </div>`;
    }
    if(currentModule == MODULE.likho.value){
      tooltipContent = `<div style="padding: 10px;">
                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
                <div style="text-align: left;">Translated: <label>{contributedHours}</label></div>
                <div style="text-align: left;">Validated: <label>{validatedHours}</label></div>
            </div>`;
    }

    if(currentModule == MODULE.dekho.value){
      tooltipContent = `<div style="padding: 10px;">
                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
                <div style="text-align: left;">Labelled: <label>{contributedHours}</label></div>
                <div style="text-align: left;">Validated: <label>{validatedHours}</label></div>
            </div>`;
    }


    chart.data = chartData;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 10;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.baseGrid.disabled = false;
    dateAxis.renderer.labels.template.fill = '#000';
    dateAxis.title.text = 'Month';
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.title.fontSize = 12;

    const hourAxis = chart.yAxes.push(new am4charts.ValueAxis());
    hourAxis.min = 0;
    hourAxis.renderer.minGridDistance = 50;
    hourAxis.renderer.grid.template.strokeDasharray = "3,3";
    hourAxis.renderer.labels.template.fill = '#000';
    hourAxis.title.text = currentModule == "dekho" ? "Images" : currentModule == MODULE.likho.value ? "Sentences" : 'Contribution (in hours)';
    hourAxis.renderer.labels.template.fontSize = 12;
    hourAxis.title.fontSize = 12;

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "duration";
    series.dataFields.valueY = currentModule == "dekho" || currentModule == MODULE.likho.value ? "total_contribution_count" : "cumulative_contributions";
    series.strokeWidth = 3;
    series.tensionX = 0.8;
    series.tooltipHTML = tooltipContent;
    series.tooltip.getFillFromObject = false;
    series.tooltip.autoTextColor = false;
    series.tooltip.background.fill = am4core.color("#F1F1F2");
    series.tooltip.label.fill = am4core.color("#000000");
    series.sequencedInterpolation = true;
    series.stroke = am4core.color("#FCC232");
    series.name = series1Name;

    // Create series
    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = "duration";
    series2.dataFields.valueY = currentModule == "dekho" || currentModule == "likho" ? "total_validation_count" : "cumulative_validations";
    series2.sequencedInterpolation = true;
    series2.tensionX = 0.8;
    series2.strokeWidth = 3;
    series2.stroke = am4core.color("#83E661");
    series2.name = series2Name;

    if (chartData.length === 1) {
      const circleBullet = series.bullets.push(new am4charts.CircleBullet());
      circleBullet.circle.fill = am4core.color("#FCC232");
      // circleBullet.circle.strokeWidth = 3;

      const circleBullet2 = series2.bullets.push(new am4charts.CircleBullet());
      circleBullet2.circle.fill = am4core.color("#83E661");
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

const disposeLineChart = (chartDiv) => {
  if (chartReg[chartDiv]) {
      chartReg[chartDiv].dispose();
      delete chartReg[chartDiv];
  }
}

function updateLineGraph(language, timeframe, module,series1Name, series2Name) {
    disposeLineChart('timeline-chart');
    $timelineLoader.show().addClass('d-flex');
    $timelineChart.addClass('d-none');
    buildLineGraphs(language, timeframe, module,series1Name, series2Name);
}

function buildLineGraphs(language, timeframe, module, series1Name, series2Name) {
  const url = getTimelineUrl(language, timeframe);
  
  getJson(url)
  .then((data) => {
    try {
      data = data.filter(d => d.type == module["api-type"]) || [];
      data = language !== "" ? getLanguageSpecificData(data, language) : data;
      $timelineLoader.hide().removeClass('d-flex');
      $timelineChart.removeClass('d-none');
      drawTimelineChart(data,series1Name, series2Name);

      //lazy load other css
      setTimeout(() => {
        fetch(
          'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css'
        );
        fetch('https://fonts.googleapis.com/icon?family=Material+Icons');
        fetch('https://cdn.jsdelivr.net/npm/notyf@3.7.0/notyf.min.css');
        fetch('/css/record.css');
      }, 2000);
    } catch (error) {
      console.log(error);
      $timelineLoader.show().addClass('d-flex');
      $timelineChart.addClass('d-none');
    }
  }).catch((err) => {
    console.log(err);
  });
}

module.exports = {
  buildLineGraphs,
  disposeLineChart,
  updateLineGraph
};