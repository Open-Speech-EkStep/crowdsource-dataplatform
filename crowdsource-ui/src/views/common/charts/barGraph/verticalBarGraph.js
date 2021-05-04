const fetch = require('./fetch')
const { calculateTime, formatTime } = require('./utils');
const $chartRow = $('.chart-row');
const $chartLoaders = $chartRow.find('.loader');
const $charts = $chartRow.find('.chart');

const chartReg = {};

function updateBarGraph(language, timeframe) {
  am4core.disposeAllCharts();
  $chartLoaders.show().addClass('d-flex');
  $charts.addClass('d-none');
  $chartLoaders.addClass('d-none');
  buildGraphs(language, timeframe);
}

const drawGenderChart = (chartData) => {
  const chartColors = ['#5d6d9a', '#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691'];
  am4core.ready(function () {
    const chart = am4core.create('gender-chart', am4charts.XYChart);
    chartData.forEach(item => {
      const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime((Number(item.hours_contributed) * 60 * 60), true);
      item.contributedHours = formatTime(cHours, cMinutes, cSeconds);
    })
    chart.data = chartData;
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'gender';
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.fill = '#000';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.labels.template.fill = '#000';
    valueAxis.renderer.grid.template.strokeDasharray = "3,3";
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.title.text = 'Number of hours';
    valueAxis.title.fontSize = 12;
    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'hours_contributed';
    series.dataFields.categoryX = 'gender';
    const columnTemplate = series.columns.template;
    columnTemplate.tooltipHTML = `<div> {tooltipText}</div>`;
    columnTemplate.tooltipX = am4core.percent(50);
    columnTemplate.tooltipY = am4core.percent(0);

    columnTemplate.adapter.add('fill', function (fill, target) {
      return chartColors[chartColors.length - 1 - target.dataItem.index];
    });
    columnTemplate.adapter.add('stroke', function (stroke, target) {
      return chartColors[chartColors.length - 1 - target.dataItem.index];
    });

    chartReg['gender-chart'] = chart;
  });
};


function buildGraphs(language, timeframe) {
  // $.fn.popover.Constructor.Default.whiteList.table = [];
  // $.fn.popover.Constructor.Default.whiteList.tbody = [];
  // $.fn.popover.Constructor.Default.whiteList.tr = [];
  // $.fn.popover.Constructor.Default.whiteList.td = [];
  console.log("bar graph", language, timeframe);
  Promise.all([
    fetch(`/stats/contributions/gender/text?language=${language}`),
  ]).then(function (responses) {
    return Promise.all(responses.map(function (response) {
        return response.json();
    }));
}).then((data) => {
    try {
      $chartLoaders.hide().removeClass('d-flex');
      $charts.removeClass('d-none');
      console.log(data);

      const genderData = getGenderData(data[0]);
      // Draw gender chart
      drawGenderChart(genderData);
      //lazy load other css
      setTimeout(() => {
        fetch(
          'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css'
        );
        fetch('https://fonts.googleapis.com/icon?family=Material+Icons');
        fetch('../css/notyf.min.css');
        fetch('../css/record.css');
      }, 2000);
    } catch (error) {
      console.log(error);
      $chartLoaders.show().addClass('d-flex');
      $charts.addClass('d-none');
    }
  }).catch((err) => {
    console.log(err);
  });
}

const getGenderData = (genderData) => {
  const genderOrder = ['male', 'female', 'anonymous', 'transgender'];
  const formattedGenderData = [];
  genderOrder.forEach(gender => {
      genderData.data.forEach(item => {
          let gType = item.gender;
          if (item.gender === "") item.gender = 'anonymous';
          if (item.gender.toLowerCase().indexOf('transgender') > -1 || item.gender.toLowerCase().indexOf('rather') > -1) gType = "transgender";
          if (gender === gType) {
              const genderType = gType.charAt(0).toUpperCase() + gType.slice(1);
              const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime((Number(item.hours_contributed) * 60 * 60), true);
              const contributedHours = formatTime(cHours, cMinutes, cSeconds);
              if (gType === "transgender") {
                  formattedGenderData.push({
                      ...item,
                      gender: "Others",
                      tooltipText: `
                              <div>
                                  <h6 style="text-align: left; font-weight: bold">${item.gender}</h6>
                                  <div>Contributed: <label>${contributedHours}</label></div>
                                  <div style="text-align: left;">Speakers: <label>${item.speakers}</label></div>
                              </div>`
                  });
              } else {
                  formattedGenderData.push({
                      ...item,
                      gender: genderType,
                      tooltipText: `
                              <div>
                                  <h6 style="text-align: left; font-weight: bold">${genderType}</h6>
                                  <div>Contributed: <label>${contributedHours}</label></div>
                                  <div style="text-align: left;">Speakers: <label>${item.speakers}</label></div>
                              </div>`
                  });
              }
          }
      });
  });
  return formattedGenderData;
}

module.exports = {
  buildGraphs,
  updateBarGraph
};