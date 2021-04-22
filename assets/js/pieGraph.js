const fetch = require('./fetch')
const $chartRow = $('.chart-row');
const $chartLoaders = $chartRow.find('.loader');
const $charts = $chartRow.find('.chart');

const chartReg = {};

function buildGraphs(language, timeframe) {
  Promise.all([
    fetch(`/stats/contributions/age?language=${language}`)
  ]).then((data) => {
    try {
      $chartLoaders.hide().removeClass('d-flex');
      $charts.removeClass('d-none');

      const ageGroupData = getAgeGroupData(data[2].data, 'age_group').sort((a, b) => Number(a.speakers) - Number(b.speakers));
      drawAgeGroupChart(ageGroupData);

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

const drawAgeGroupChart = (chartData) => {
  const chartColors = ['#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691'];
  const chart = am4core.create('age-group-chart', am4charts.PieChart3D);
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

  const activeLegendLabel = chart.legend.valueLabels.template.states.getKey(
    'active'
  );
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

module.exports = {
  buildGraphs
};