const { calculateTime, formatTime, translate } = require('./utils');
const { LOCALE_STRINGS ,INITIATIVES} = require('./constants');
const chartReg = {};

const drawTopLanguageChart = (chartData, type, dataType, page) => {
  if (chartReg["top-language-chart"]) {
    chartReg["top-language-chart"].dispose();
  }
  const chartColors = ['#F7CC56', '#F7CC56', '#F7CC56', '#EF8537'];
  const localStrings = JSON.parse(
    localStorage.getItem(LOCALE_STRINGS)
  ) || {};
  const images = 'Images', translations = 'Translations', sentences = 'Sentences', speakers = 'Speakers';
  const ocrToolTipStr = (localStrings[images] || images).toLowerCase();
  const parallelToolTipStr = (localStrings[translations] || translations).toLowerCase();
  const asrToolTipStr = (localStrings[sentences] || sentences).toLowerCase();
  const textSpeakerToolTipStr = (localStrings[speakers] || speakers).toLowerCase();
  am4core.ready(function () {
    const chart = am4core.create('top-language-chart', am4charts.XYChart);

    if (page === 'thankyou') {
      const currentFunctionalPage = localStorage.getItem("selectedType");
      if (currentFunctionalPage == "validate") {
        chartData.forEach(item => {
          item.total_validation_count = item.total_validation_count ? item.total_validation_count : 0;
          item.contributedHours = type == INITIATIVES.asr.value || type == INITIATIVES.text.value ? ((item.total_validation_count).toString() + " " + asrToolTipStr) : type == INITIATIVES.ocr.value ? ((item.total_validation_count).toString() + " " + ocrToolTipStr) : ((item.total_validation_count).toString() + " " + parallelToolTipStr);
        });
      } else {
        chartData.forEach(item => {
          item.total_contributions = item.total_contributions ? item.total_contributions : 0.000;
          item.total_contribution_count = item.total_contribution_count ? item.total_contribution_count : 0;
          const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime((Number(item.total_contributions) * 60 * 60), true);
          if (type == INITIATIVES.text.value) {
            item.contributedHours = formatTime(cHours, cMinutes, cSeconds);
          } else {
            item.contributedHours = type == INITIATIVES.asr.value ? ((item.total_contribution_count).toString() + " " + asrToolTipStr) : type == INITIATIVES.ocr.value ? ((item.total_contribution_count).toString() + " " + ocrToolTipStr) : ((item.total_contribution_count).toString() + " " + parallelToolTipStr);
          }
        });
      }

    } else {
      if (dataType !== "speaker") {
        chartData.forEach(item => {
          item.total_contributions = item.total_contributions ? item.total_contributions : 0.000;
          item.total_contribution_count = item.total_contribution_count ? item.total_contribution_count : 0;
          const { hours: cHours, minutes: cMinutes, seconds: cSeconds } = calculateTime((Number(item.total_contributions) * 60 * 60), true);
          item.contributedHours = type == INITIATIVES.asr.value || type == INITIATIVES.text.value ? (dataType === "sentences" ? ((item.total_contribution_count || 0).toString() + " " + asrToolTipStr) : formatTime(cHours, cMinutes, cSeconds)) : type == INITIATIVES.ocr.value ? ((item.total_contribution_count).toString() + " " + ocrToolTipStr) : ((item.total_contribution_count).toString() + " " + parallelToolTipStr);
        });
      } else {
        chartData.forEach(item => {
          item.contributedHours = ((item.total_speakers).toString() + " " + textSpeakerToolTipStr);
        });
      }
    }

    chartData.forEach(data => {
      if (type === INITIATIVES.parallel.value) {
        let languages = data.language.split("-")
        let fromLanguage = translate(languages[0]);
        let toLanguage = translate(languages[1]);
        data.language = `${fromLanguage}-${toLanguage}`;
      } else {
        data.language = translate(data.language);
      }
    });
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
    valueAxis.renderer.labels.template.fill = '#142745';
    valueAxis.renderer.grid.template.strokeDasharray = "3,3";
    valueAxis.renderer.labels.template.fontSize = 14;
    if (page === 'thankyou') {
      const currentFunctionalPage = localStorage.getItem("selectedType");
      if (currentFunctionalPage == "validate") {
        valueAxis.title.text = type == INITIATIVES.asr.value || type == INITIATIVES.text.value || type == INITIATIVES.parallel.value ? localStrings["Validation (in sentences)"] : localStrings['Validation (in image labels)'];
      } else {
        if (type == INITIATIVES.asr.value) {
          valueAxis.title.text = localStrings['Transcription (in sentences)'];
        } else if (type == INITIATIVES.text.value) {
          valueAxis.title.text = localStrings['Recordings (in hours)'];
        } else if (type == INITIATIVES.parallel.value) {
          valueAxis.title.text = localStrings['Translation (in sentences)'];
        } else {
          valueAxis.title.text = localStrings['Labelled (in images)'];
        }
      }
    } else {
      if (dataType !== "speaker") {
        valueAxis.title.text = type == INITIATIVES.asr.value || type == INITIATIVES.text.value ? (dataType == "sentences" ? localStrings["Contribution (total sentences)"] : localStrings["Contribution (in hours)"]) : type == INITIATIVES.ocr.value ? localStrings["Contribution (total images)"] : localStrings['Contribution (total translations)'];
      } else {
        valueAxis.title.text = type == INITIATIVES.text.value ? localStrings["Contribution (total speakers)"] : "";
      }
    }

    valueAxis.title.fill = '#142745';
    valueAxis.title.fontSize = 14;
    valueAxis.title.lineHeight = 17;
    valueAxis.title.opacity = 0.6;
    valueAxis.renderer.grid.template.strokeWidth = 0;
    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());

    if (page === 'thankyou') {
      const currentFunctionalPage = localStorage.getItem("selectedType");
      if (currentFunctionalPage == "validate") {
        series.dataFields.valueY = 'total_validation_count';
      } else {
        series.dataFields.valueY = type == INITIATIVES.text.value ? 'total_contributions' : 'total_contribution_count';
      }
    } else {
      if (dataType != "speaker") {
        series.dataFields.valueY = type == INITIATIVES.asr.value || type == INITIATIVES.text.value ? (dataType === "sentences" ? 'total_contribution_count' : 'total_contributions') : 'contributedHours';
      } else {
        series.dataFields.valueY = 'contributedHours';
      }
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