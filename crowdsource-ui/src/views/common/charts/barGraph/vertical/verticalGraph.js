const { calculateTime, formatTime } = require('./utils');
const chartReg = {};

const drawTopLanguageChart = (chartData, type, dataType) => {
  const chartColors = ['#F7CC56', '#F7CC56', '#F7CC56', '#EF8537'];
  am4core.ready(function () {
    const chart = am4core.create('top-language-chart', am4charts.XYChart);

    if (dataType != "speaker") {
      chartData.forEach(item => {
        const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime((Number(item.total_contributions) * 60 * 60), true);
        item.contributedHours = type == "suno" || type == "bolo" ? formatTime(cHours, cMinutes, cSeconds) : type == "dekho" ? ((item.total_contribution_count).toString() + " images") : ((item.total_contribution_count).toString() + " translations");
      });
    } else {
      chartData.forEach(item => {
        item.contributedHours = ((item.total_speakers).toString() + " speakers");
      });
    }
    chart.data = chartData ? chartData.reverse() : [];
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'language';
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.fill = '#000';
    categoryAxis.renderer.grid.template.strokeWidth = 0;
    // categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.grid.template.location = 0;
    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.labels.template.fill = '#000';
    valueAxis.renderer.grid.template.strokeDasharray = "3,3";
    valueAxis.renderer.labels.template.fontSize = 12;
    if (dataType != "speaker") {
      valueAxis.title.text = type == "suno" || type == "bolo" ? "Contribution (in hours)" : type == "dekho" ? "Contribution (no. of images)" : 'Contribution (no. of translations)';
    } else {
      valueAxis.title.text = type == "bolo" ? "Contribution (no. of speakers)" : "";
    }

    valueAxis.title.fontSize = 12;
    valueAxis.renderer.grid.template.strokeWidth = 0;
    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    if (dataType != "speaker") {
    series.dataFields.valueY = type == "suno" || type == "bolo" ? 'total_contributions' : 'contributedHours';
    } else {
      series.dataFields.valueY ='contributedHours';
    }
    series.dataFields.categoryX = 'language';
    const columnTemplate = series.columns.template;
    columnTemplate.tooltipHTML = `<div> {contributedHours}</div>`;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color("#333333");
    columnTemplate.tooltipX = am4core.percent(50);
    columnTemplate.tooltipY = am4core.percent(0);

    columnTemplate.adapter.add('fill', function (fill, target) {
      return chartColors[chartColors.length - 1 - target.dataItem.index];
    });
    columnTemplate.adapter.add('stroke', function (stroke, target) {
      return chartColors[chartColors.length - 1 - target.dataItem.index];
    });

    chartReg['top-language-chart'] = chart;
    categoryAxis.events.on("sizechanged", function (ev) {
      var axis = ev.target;
      var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      if (cellWidth < axis.renderer.labels.template.maxWidth) {
        axis.renderer.labels.template.rotation = -45;
        axis.renderer.labels.template.horizontalCenter = "right";
        axis.renderer.labels.template.verticalCenter = "middle";
      }
      else {
        axis.renderer.labels.template.rotation = 0;
        axis.renderer.labels.template.horizontalCenter = "middle";
        axis.renderer.labels.template.verticalCenter = "top";
      }
    });

  });
};

module.exports = {
  drawTopLanguageChart,
};