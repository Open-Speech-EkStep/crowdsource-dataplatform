const { calculateTime, formatTime } = require('./utils');
const { LOCALE_STRINGS } = require('./constants');
const chartReg = {};

const drawTopLanguageChart = (chartData, type, dataType, page) => {
  const chartColors = ['#F7CC56', '#F7CC56', '#F7CC56', '#EF8537'];
  const localStrings = JSON.parse(
    localStorage.getItem(LOCALE_STRINGS)
  );
  const dekhoToolTipStr = localStrings["Images"].toLowerCase();
  const likhoToolTipStr = localStrings["translations"];
  const boloSpeakerToolTipStr = localStrings["speakers"];
  am4core.ready(function () {
    const chart = am4core.create('top-language-chart', am4charts.XYChart);


    if(page === 'thankyou'){
      const currentFunctionalPage = localStorage.getItem("selectedType");
      if(currentFunctionalPage == "validate"){
        chartData.forEach(item => {
          item.total_validation_count = item.total_validation_count ? item.total_validation_count : 0;
          item.total_validations = item.total_validations ? item.total_validations : 0.000;
          const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime((Number(item.total_validations) * 60 * 60), true);
          item.contributedHours = type == "suno" || type == "bolo" ? formatTime(cHours, cMinutes, cSeconds) : type == "dekho" ? ((item.total_validation_count).toString() + " "+ dekhoToolTipStr) : ((item.total_validation_count).toString() + " " + likhoToolTipStr);
        });
      } else {
        chartData.forEach(item => {
          item.total_contributions = item.total_contributions ? item.total_contributions : 0.000;
          item.total_contribution_count = item.total_contribution_count ? item.total_contribution_count : 0;
          const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime((Number(item.total_contributions)  * 60 * 60), true);
          item.contributedHours = type == "suno" || type == "bolo" ? formatTime(cHours, cMinutes, cSeconds) : type == "dekho" ? ((item.total_contribution_count ).toString() + " "+ dekhoToolTipStr) : ((item.total_contribution_count ).toString() + " " + likhoToolTipStr);
        });
      }

    } else {
      if (dataType !== "speaker") {
        chartData.forEach(item => {
          item.total_contributions = item.total_contributions ? item.total_contributions : 0.000;
          item.total_contribution_count = item.total_contribution_count ? item.total_contribution_count : 0;
          const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime((Number(item.total_contributions ) * 60 * 60), true);
          item.contributedHours = type == "suno" || type == "bolo" ? formatTime(cHours, cMinutes, cSeconds) : type == "dekho" ? ((item.total_contribution_count ).toString() + " "+ dekhoToolTipStr) : ((item.total_contribution_count).toString() + " " + likhoToolTipStr);
        });
      } else {
        chartData.forEach(item => {
          item.contributedHours = ((item.total_speakers).toString() + " " + boloSpeakerToolTipStr);
        });
      }
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
    if(page === 'thankyou'){
      const currentFunctionalPage = localStorage.getItem("selectedType");
      if(currentFunctionalPage == "validate"){
        valueAxis.title.text = type == "suno" || type == "bolo" || type == "likho" ? localStrings["Validation (in sentences)"] : localStrings['Validation (in image labels)'];
      }else {
        if(type == "suno"){
          valueAxis.title.text = localStrings['Transcription (in sentences)'];
        } else if(type == "bolo"){
          valueAxis.title.text = localStrings['Recordings (in hours)'];
        } else if(type == "likho"){
          valueAxis.title.text = localStrings['Translation (in sentences)'];
        } else {
          valueAxis.title.text = localStrings['Labelled (in images)'];
        }
      }
    } else {
      if (dataType !== "speaker") {
        valueAxis.title.text = type == "suno" || type == "bolo" ? localStrings["Contribution (in hours)"] : type == "dekho" ? localStrings["Contribution (no. of images)"] : localStrings['Contribution (no. of translations)'];
      } else {
        valueAxis.title.text = type == "bolo" ? localStrings["Contribution (no. of speakers)"] : "";
      }
    }

    valueAxis.title.fontSize = 12;
    valueAxis.title.opacity = 0.6;
    valueAxis.title.color = '#142745';
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