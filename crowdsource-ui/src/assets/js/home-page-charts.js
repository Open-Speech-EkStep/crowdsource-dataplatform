const TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
const TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";
const { calculateTime, formatTime, formatTimeForLegends, getJson, translate } = require('./utils');
const { drawTopLanguageChart } = require('../../../build/js/common/verticalGraph');

const getTotalParticipation = (data) => {
  let validation_count = 0;
  let contribution_count = 0;
  if(data.total_validations){
    validation_count = Number(data.total_validations);
  }
  if(data.total_contributions){
    contribution_count = Number(data.total_contributions);
  }
  return validation_count + contribution_count;
}

const statesInformation = [
  { id: 'IN-TG', state: 'Telangana', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-AN', state: 'Andaman and Nicobar Islands', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-AP', state: 'Andhra Pradesh', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-AR', state: 'Arunachal Pradesh', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-AS', state: 'Assam', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-BR', state: 'Bihar', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-CT', state: 'Chhattisgarh', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-GA', state: 'Goa', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-GJ', state: 'Gujarat', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-HR', state: 'Haryana', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-HP', state: 'Himachal Pradesh', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-JK', state: 'Jammu & Kashmir', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-JH', state: 'Jharkhand', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-KA', state: 'Karnataka', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-KL', state: 'Kerala', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-LD', state: 'Lakshadweep', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-MP', state: 'Madhya Pradesh', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-MH', state: 'Maharashtra', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-MN', state: 'Manipur', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-CH', state: 'Chandigarh', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-PY', state: 'Puducherry', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-PB', state: 'Punjab', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-RJ', state: 'Rajasthan', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-SK', state: 'Sikkim', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-TN', state: 'Tamil Nadu', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-TR', state: 'Tripura', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-UP', state: 'Uttar Pradesh', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-UT', state: 'Uttarakhand', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-WB', state: 'West Bengal', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-OR', state: 'Odisha', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-DNDD', state: 'Dadra and Nagar Haveli and Daman and Diu', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-ML', state: 'Meghalaya', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-MZ', state: 'Mizoram', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-NL', state: 'Nagaland', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-DL', state: 'National Capital Territory of Delhi', contributed_time: "0s", validated_time: "0s", total_speakers: 0 },
  { id: 'IN-LK', state: 'Ladakh', contributed_time: "0s", validated_time: "0s", total_speakers: 0 }
]

var polygonSeries = undefined;
const drawMap = function (response) {
  let statesData = [...statesInformation];
  const $legendDiv = $("#legendDiv");
  const maxContribution = Math.max.apply(
    Math,
    response.map(function (ele) {
      return getTotalParticipation(ele);
    })
  );
  let quarterVal;
  if (maxContribution > 1) {
    quarterVal = maxContribution / 4;
  } else {
    quarterVal = 0.25;
  }

  statesData.forEach(st => {
    const ele = response.find(s => st.state === s.state);
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
      st.contributed_time = formatTime(cHours, cMinutes, cSeconds);
      st.validated_time = formatTime(vHours, vMinutes, vSeconds);
      st.value = getTotalParticipation(ele);
      st.total_speakers = ele.total_speakers;
    } else {
      st.contributed_time = formatTime(0,0,0);
      st.validated_time = formatTime(0,0,0);
      st.value = 0;
      st.total_speakers = 0;
    }
    st.state = translate(st.state)
  });

  var chart = am4core.create("indiaMapChart", am4maps.MapChart);
  const index = chart.series.indexOf(polygonSeries);
  if (index > -1) {
    chart.series.removeIndex(index);
  }
  chart.geodataSource.url = "https://crowdsource1.blob.core.windows.net/vakyansh-json-data/india2020Low.json";
  chart.projection = new am4maps.projections.Miller();
  polygonSeries = new am4maps.MapPolygonSeries();
  chart.seriesContainer.draggable = false;
  chart.seriesContainer.resizable = false;
  chart.chartContainer.wheelable = false;
  chart.maxZoomLevel = 1;
  polygonSeries.useGeodata = true;
  polygonSeries.data = statesData;
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipHTML = `<div style="text-align: left;">
                                      <h6>{state}</h6>
                                      <div style="text-align: left;">{total_speakers} ${translate('Speakers')} </div>
                                      <div style="text-align: left;">
                                        <label>${translate('Contributed')}: </label>
                                        <label style="margin-left: 8px">{contributed_time}</label>
                                      </div>
                                      <div style="text-align: left;">${translate('Validated')}:
                                        <label style="margin-left: 8px">{validated_time}</label>
                                      </div>
                                  </div>`;
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.strokeWidth = 0.5;
  polygonTemplate.stroke = am4core.color("#929292")
  polygonTemplate.fill = am4core.color("#fff");
  polygonTemplate.maxWidth=50;
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
  const { hours: hHours, minutes: hMinuts } = calculateTime(
    quarterVal * 2 * 60 * 60,
    false
  );
  const { hours: tQHours, minutes: tQMinuts } = calculateTime(
    quarterVal * 3 * 60 * 60,
    false
  );
  $quarter.text(`0 - ${formatTimeForLegends(qHours, qMinuts, 0, true)}`);
  $half.text(`${formatTimeForLegends(qHours, qMinuts, 0 , false)} - ${formatTimeForLegends(hHours, hMinuts, 0, true)}`);
  $threeQuarter.text(
    `${formatTimeForLegends(hHours, hMinuts, 0, false)} - ${formatTimeForLegends(tQHours, tQMinuts, 0 , true)}`
  );
  $full.text(`> ${formatTimeForLegends(tQHours, tQMinuts, 0, true)}`);
  $legendDiv.removeClass("d-none").addClass("d-flex");
};

function getLanguageSpecificData(data, lang) {
  const stateData = [];
  data.forEach(item => {
    if (item.language.toLowerCase() === lang.toLowerCase()
      && item.state !== ''
      && item.state.toLowerCase() !== 'anonymous') {
      stateData.push(item);
    }
  });
  return stateData;
}

const generateIndiaMap = function (language = "") {
  const url = language !== "" ? '/aggregated-json/cumulativeDataByLanguageAndState.json' : '/aggregated-json/cumulativeDataByState.json';
  getJson(url)
    .then((data) => {
      data = data.filter(d => d.type == "text") || [];
      const response = language !== "" ? getLanguageSpecificData(data, language) : data;
      drawMap(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

function getStatistics(response) {
  const $speakersData = $("#speaker-data");
  const $speakersDataSpeakerValue = $("#speaker-value");
  const $speakersDataHoursValue = $("#contributed-value");
  const $speakersDataLanguagesValue = $("#languages-value");
  const $speakerContributionData = $speakersData.find('.contribution-data');
  const $validatedValue = $("#validated-value");

  const {hours, minutes, seconds} = calculateTime(
    Number(response && response.total_contributions || 0) * 60 * 60
  );

  const { hours: validate_hrs, minutes: validate_min, seconds: validate_sec } = calculateTime(
    Number(response && response.total_validations || 0) * 60 * 60
  );
  $speakersDataHoursValue.text(formatTime(hours, minutes,seconds));
  $validatedValue.text(formatTime(validate_hrs,validate_min,validate_sec));
  $speakersDataSpeakerValue.text(response && response.total_speakers || 0);
  $speakersDataLanguagesValue.text(response && response.total_languages || 0);
  $speakerContributionData.removeClass('col-12 col-md-4 col-lg-4 col-xl-4 col-xs-6');
  $speakerContributionData.addClass('col-12 col-md-3 col-lg-3 col-xs-6 col-xl-3')
}

let chartReg = {};
function showByHoursChart() {
  const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
  const chartData = topLanguagesByHoursData ? JSON.parse(topLanguagesByHoursData).reverse() : [];
  if (chartReg["chart"] && chartData && chartData.length) {
    chartReg["chart"].dispose();
  }
  drawTopLanguageChart(chartData, "bolo")
}

function showBySpeakersChart() {
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesBySpeakers = localStorage.getItem(
    TOP_LANGUAGES_BY_SPEAKERS
  );
  const chartData = topLanguagesBySpeakers ? JSON.parse(topLanguagesBySpeakers).reverse() : [];
  drawTopLanguageChart(chartData, "bolo","speaker")
}

module.exports = {
  generateIndiaMap,
  showByHoursChart,
  showBySpeakersChart,
  getStatistics,
  drawMap,
};
