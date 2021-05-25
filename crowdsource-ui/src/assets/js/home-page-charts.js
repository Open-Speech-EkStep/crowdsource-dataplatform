const TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
const TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";
const { calculateTime, formatTime, getJson, performAPIRequest } = require('./utils');

const statesInformation = [
  { id: 'IN-TG', state: 'Telangana', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AN', state: 'Andaman and Nicobar Islands', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AP', state: 'Andhra Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AR', state: 'Arunachal Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AS', state: 'Assam', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-BR', state: 'Bihar', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-CT', state: 'Chhattisgarh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-GA', state: 'Goa', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-GJ', state: 'Gujarat', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-HR', state: 'Haryana', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-HP', state: 'Himachal Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-JK', state: 'Jammu & Kashmir', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-JH', state: 'Jharkhand', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-KA', state: 'Karnataka', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-KL', state: 'Kerala', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-LD', state: 'Lakshadweep', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-MP', state: 'Madhya Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-MH', state: 'Maharashtra', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-MN', state: 'Manipur', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-CH', state: 'Chandigarh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-PY', state: 'Puducherry', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-PB', state: 'Punjab', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-RJ', state: 'Rajasthan', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-SK', state: 'Sikkim', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-TN', state: 'Tamil Nadu', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-TR', state: 'Tripura', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-UP', state: 'Uttar Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-UT', state: 'Uttarakhand', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-WB', state: 'West Bengal', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-OR', state: 'Odisha', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-DNDD', state: 'Dadra and Nagar Haveli and Daman and Diu', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-ML', state: 'Meghalaya', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-MZ', state: 'Mizoram', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-NL', state: 'Nagaland', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-DL', state: 'National Capital Territory of Delhi', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-LK', state: 'Ladakh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 }
]

var polygonSeries = undefined;
const drawMap = function (response) {
  let statesData = [...statesInformation];
  const $legendDiv = $("#legendDiv");
  const maxContribution = Math.max.apply(
    Math,
    response.data.map(function (ele) {
      return Number(ele.total_contributions);
    })
  );
  let quarterVal;
  if (maxContribution > 1) {
    quarterVal = maxContribution / 4;
  } else {
    quarterVal = 0.25;
  }

  statesData.forEach(st => {
    const ele = response.data.find(s => st.state === s.state);
    if (ele) {
      const {
        hours: cHours,
        minutes: cMinutes,
        seconds: cSeconds,
      } = calculateTime(Number(ele.total_contributions) * 60 * 60, true);
      const {
        hours: vHours,
        minutes: vMinutes,
        seconds: vSeconds,
      } = calculateTime(Number(ele.total_validations) * 60 * 60, true);
      st.contributed_time = `${cHours}hrs ${cMinutes}mins ${cSeconds}sec`;
      st.validated_time = `${vHours}hrs ${vMinutes}mins ${vSeconds}sec`;
      st.value = Number(ele.total_contributions);
      st.total_speakers = ele.total_speakers;
      st.id = st.id;
    } else {
      st.id = st.id;
      st.contributed_time = "0 hrs";
      st.validated_time = "0 hrs";
      st.value = 0;
      st.total_speakers = 0;
    }
  });

  var chart = am4core.create("indiaMapChart", am4maps.MapChart);
  const index = chart.series.indexOf(polygonSeries);
  if (index > -1) {
    chart.series.removeIndex(index);
  }
  chart.geodataSource.url = "https://vakyansh-json-data.s3.ap-south-1.amazonaws.com/india2020Low.json";
  chart.projection = new am4maps.projections.Miller();
  polygonSeries = new am4maps.MapPolygonSeries();
  chart.seriesContainer.draggable = false;
  chart.seriesContainer.resizable = false;
  chart.chartContainer.wheelable = false;
  chart.maxZoomLevel = 1;
  polygonSeries.useGeodata = true;
  polygonSeries.data = statesData;
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipHTML = `<div style="text-align: left;"><h6>{state}</h6> <div style="text-align: left;">{total_speakers} Speakers  <label style="margin-left: 32px">Contributed: <label style="margin-left: 8px">{contributed_time}</label></label></div> <div style="text-align: left;">Validated:  <label style="margin-left: 8px">{validated_time}</label></div></div>`;
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.strokeWidth = 0.5;
  polygonTemplate.stroke = am4core.color("#929292")
  polygonTemplate.fill = am4core.color("#fff");

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);

  polygonSeries.mapPolygons.template.adapter.add(
    "fill",
    function (fill, target) {
      if (target.dataItem) {
        if (target.dataItem.value >= quarterVal * 3) {
          return am4core.color("#4061BF");
        } else if (target.dataItem.value >= quarterVal * 2) {
          return am4core.color("#6B85CE");
        } else if (target.dataItem.value >= quarterVal) {
          return am4core.color("#92A8E8");
        } else if (target.dataItem.value > 0) {
          return am4core.color("#CDD8F6");
        } else {
          return am4core.color("#E9E9E9");
        }
      }
      return fill;
    }
  );
  chart.series.push(polygonSeries);
  const $quarter = $("#quarter .legend-val");
  const $half = $("#half .legend-val");
  const $threeQuarter = $("#threeQuarter .legend-val");
  const $full = $("#full .legend-val");
  const { hours: qHours, minutes: qMinuts } = calculateTime(
    quarterVal * 60 * 60,
    false
  );
  const {hours: hHours, minutes: hMinuts} = calculateTime(
    quarterVal * 2 * 60 * 60,
    false
  );
  const {hours: tQHours, minutes: tQMinuts} = calculateTime(
    quarterVal * 3 * 60 * 60,
    false
  );
  $quarter.text(`0 - ${formatTime(qHours, qMinuts)}`);
  $half.text(`${formatTime(qHours, qMinuts)} - ${formatTime(hHours, hMinuts)}`);
  $threeQuarter.text(
    `${formatTime(hHours, hMinuts)} - ${formatTime(tQHours, tQMinuts)}`
  );
  $full.text(`> ${formatTime(tQHours, tQMinuts)}`);
  $legendDiv.removeClass("d-none").addClass("d-flex");
};

function getLanguageSpecificData(data, lang) {
  const stateData = {
    data: [],
  };
  data.data.forEach(item => {
    if (item.language.toLowerCase() === lang.toLowerCase()
      && item.state !== ''
      && item.state.toLowerCase() !== 'anonymous') {
      stateData.data.push(item);
    }
  });
  return stateData;
}

const generateIndiaMap = function (language = "") {
  const url = language !== "" ? '/aggregate-data-count/text?byState=true&byLanguage=true' : '/aggregate-data-count/text?byState=true';
  performAPIRequest(url)
    .then((data) => {
      const response = language !== "" ? getLanguageSpecificData(data, language) : data;
      drawMap(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

function getStatistics(response) {
  const $speakersData = $("#speaker-data");
  const $speakersDataLoader = $speakersData.find(
    "#loader1"
  );
  const $speakersDataSpeakerValue = $("#speaker-value");
  const $speakersDataHoursValue = $("#contributed-value");
  const $speakersDataLanguagesWrapper = $("#languages-wrapper");
  const $speakersDataLanguagesValue = $("#languages-value");
  const $speakerContributionData = $speakersData.find('.contribution-data');
  const $validatedValue = $("#validated-value");
  $speakersDataLoader.removeClass("d-none");

  const {hours, minutes, seconds} = calculateTime(
    Number(response.total_contributions) * 60 * 60
  );

  const {hours: validate_hrs, minutes: validate_min, seconds: validate_sec} = calculateTime(
    Number(response.total_validations) * 60 * 60
  );
  $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
  $validatedValue.text(`${validate_hrs}h ${validate_min}m ${validate_sec}s`);
  $speakersDataSpeakerValue.text(response.total_speakers);
  $speakersDataLanguagesValue.text(response.total_languages);
  $speakersDataLoader.addClass("d-none");
    $speakerContributionData.removeClass('col-12 col-md-4 col-lg-4 col-xl-4 col-xs-6')
    $speakerContributionData.addClass('col-12 col-md-3 col-lg-3 col-xs-6 col-xl-3')
}

function constructChart(responseData, xAxisLabel, yAxisLabel) {
  var chart = am4core.create("speakers_hours_chart", am4charts.XYChart);
  chartReg["chart"] = chart;

  let response = [...responseData];
 
  if (xAxisLabel !== "total_speakers") {
    response.forEach((ele) => {
      const { hours, minutes, seconds } = calculateTime(
        Number(ele.total_contributions) * 60 * 60,
        true
      );
      ele.total_contributions_text = formatTime(hours, minutes, seconds);
    });
  }
  chart.data = response.reverse();
  var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = yAxisLabel;
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.cellStartLocation = 0.2;
  categoryAxis.renderer.cellEndLocation = 0.8;
  categoryAxis.renderer.grid.template.strokeWidth = 0;
  var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.grid.template.strokeWidth = 0;
  valueAxis.renderer.labels.template.disabled = true;

  categoryAxis.renderer.minGridDistance = 25;
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueX = xAxisLabel;
  series.dataFields.categoryY = yAxisLabel;

  var valueLabel = series.bullets.push(new am4charts.LabelBullet());
  valueLabel.label.text =
    xAxisLabel === "total_speakers"
      ? "{total_speakers}"
      : "{total_contributions_text}";
  valueLabel.label.fontSize = 14;
  valueLabel.label.horizontalCenter = "left";
  valueLabel.label.dx = 10;
  valueLabel.label.truncate = false;
  valueLabel.label.hideOversized = false;

  var cellSize = 35;
  chart.events.on("datavalidated", function (ev) {
    var chart = ev.target;
    var categoryAxis = chart.yAxes.getIndex(0);
    var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
    var targetHeight = chart.pixelHeight + adjustHeight;
    chart.svgContainer.htmlElement.style.height = targetHeight + "px";
  });
}

var chartReg = {};
function showByHoursChart() {
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  constructChart(
    JSON.parse(topLanguagesByHoursData),
    "total_contributions",
    "language"
  );
}

function showBySpeakersChart() {
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesBySpeakers = localStorage.getItem(
    TOP_LANGUAGES_BY_SPEAKERS
  );
  constructChart(
    JSON.parse(topLanguagesBySpeakers),
    "total_speakers",
    "language"
  );
}

module.exports = {
  generateIndiaMap,
  showByHoursChart,
  showBySpeakersChart,
  getStatistics,
  drawMap,
};
