const { calculateTime, formatTime, performAPIRequest } = require('./utils');

const statesInformation = [
  { id: 'IN-TG', state: 'Telangana', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AN', state: 'Andaman and Nicobar Islands', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AP', state: 'Andhra Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AR', state: 'Arunanchal Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
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

let polygonSeries = undefined;
const $mapLoader = $('#map-loader');
const $mapChart = $('#map');
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
  const { hours: hHours, minutes: hMinuts } = calculateTime(
    quarterVal * 2 * 60 * 60,
    false
  );
  const { hours: tQHours, minutes: tQMinuts } = calculateTime(
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
    if(item.language) {
      if (item.language.toLowerCase() === lang.toLowerCase()
      && item.state !== ''
      && item.state.toLowerCase() !== 'anonymous') {
      stateData.data.push(item);
    }
    }
  });
  return stateData;
}

const generateIndiaMap = function (language="", type) {
  $mapLoader.show().addClass('d-flex');
  $mapChart.addClass('d-none');
  const url = language !== "" ? `/aggregate-data-count/${type}?byState=true&byLanguage=true` : `/aggregate-data-count/${type}?byState=true`;
  performAPIRequest(url)
    .then((data) => {
      const result = language !== "" ? getLanguageSpecificData(data, language) : data;
      drawMap(result);
      $mapLoader.hide().removeClass('d-flex');
      $mapChart.removeClass('d-none');
    })
    .catch((err) => {
      $mapLoader.hide().removeClass('d-flex');
      $mapChart.removeClass('d-none');
      console.log(err);
    });
};

function getStatistics(response) {
  const $speakersData = $("#speaker-data");
  const $speakersDataLoader = $speakersData.find(
    "#loader1, #loader2, #loader3"
  );
  const $speakersDataSpeakerWrapper = $("#speakers-wrapper");
  const $speakersDataSpeakerValue = $("#speaker-value");
  const $speakersDataHoursWrapper = $("#hours-wrapper");
  const $speakersDataHoursValue = $("#hour-value");
  const $speakersDataLanguagesWrapper = $("#languages-wrapper");
  const $speakersDataLanguagesValue = $("#languages-value");
  $speakersDataLoader.removeClass("d-none");
  $speakersDataHoursWrapper.addClass("d-none");
  $speakersDataSpeakerWrapper.addClass("d-none");
  $speakersDataLanguagesWrapper.addClass("d-none");

  const { hours, minutes, seconds } = calculateTime(
    Number(response.total_contributions) * 60 * 60
  );
  $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
  $speakersDataSpeakerValue.text(response.total_speakers);
  $speakersDataLanguagesValue.text(response.total_languages);
  $speakersDataLoader.addClass("d-none");
  $speakersDataHoursWrapper.removeClass("d-none");
  $speakersDataSpeakerWrapper.removeClass("d-none");
  $speakersDataLanguagesWrapper.removeClass("d-none");
}

module.exports = {
  generateIndiaMap,
  getStatistics,
  drawMap,
};
