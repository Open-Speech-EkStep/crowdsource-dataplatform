const { calculateTime, formatTime, performAPIRequest, formatTimeForLegends, formatTransAndImages } = require('./utils');

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

let polygonSeries = undefined;
// var chartReg = {};
const $mapLoader = $('#map-loader');
const $mapChart = $('#map');
const drawMap = function (response, moduleType) {
  let statesData = [...statesInformation];
  const $legendDiv = $("#legendDiv");
  const maxContribution = Math.max.apply(
    Math,
    response.data.map(function (ele) {
      return moduleType === "parallel" || moduleType === "ocr" ? Number(ele.total_contribution_count) : Number(ele.total_contributions);
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
      st.contributed_time = moduleType == "parallel" || moduleType == "ocr" ? Number(ele.total_contribution_count) : formatTime(cHours, cMinutes, cSeconds);
      st.validated_time = moduleType == "parallel" || moduleType == "ocr" ? Number(ele.total_validation_count) : formatTime(vHours, vMinutes, vSeconds);
      st.value = moduleType == "parallel" || moduleType == "ocr" ? Number(ele.total_contribution_count) : Number(ele.total_contributions);
      st.total_speakers = ele.total_speakers;
    } else {
      st.contributed_time = moduleType == "parallel" || moduleType == "ocr" ? '0' : formatTime(0, 0, 0);
      st.validated_time = moduleType == "parallel" || moduleType == "ocr" ? '0' : formatTime(0, 0, 0);
      st.value = 0;
      st.total_speakers = 0;
    }
  });
  const sunoTooltip = `<div style="text-align: left;">
                          <h6>{state}</h6> 
                          <div style="text-align: left;">{total_speakers} People</div>
                          <div style="text-align: left;">
                            <label>Transcribed: </label>
                            <label style="margin-left: 8px">{contributed_time}</label>
                          </div>
                          <div style="text-align: left;">
                            Validated:  <label style="margin-left: 8px">{validated_time}</label>
                          </div>
                        </div>`
  const likhoTooltip = `<div style="text-align: left;">
                          <h6>{state}</h6> 
                          <div style="text-align: left;">{total_speakers} People</div>
                          <div style="text-align: left;">
                            <label>Translations done: </label>
                            <label style="margin-left: 8px">{contributed_time}</label>
                          </div> 
                          <div style="text-align: left;">Translations validated:  
                            <label style="margin-left: 8px">{validated_time}</label>
                          </div>
                        </div>`
  const dekhoTooltip = `<div style="text-align: left;">
                          <h6>{state}</h6> 
                          <div style="text-align: left;">{total_speakers} People</div>
                          <div style="text-align: left;">
                            <label>Images labelled: </label> 
                            <label style="margin-left: 8px">{contributed_time}</label>
                          </div> 
                          <div style="text-align: left;">Images validated:
                            <label style="margin-left: 8px">{validated_time}</label>
                          </div>
                        </div>`
  let toolTipContent = sunoTooltip;
  if (moduleType === "parallel") {
    toolTipContent = likhoTooltip;
  }
  if (moduleType === "ocr") {
    toolTipContent = dekhoTooltip;
  }
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
  polygonTemplate.tooltipHTML = toolTipContent;
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
        if (moduleType == "bolo" || moduleType == "suno") {
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
        } else {
          if (target.dataItem.value >= 500) {
            return am4core.color("#4061BF");
          } else if (target.dataItem.value >= 200) {
            return am4core.color("#6B85CE");
          } else if (target.dataItem.value >= 100) {
            return am4core.color("#92A8E8");
          } else if (target.dataItem.value > 0) {
            return am4core.color("#CDD8F6");
          } else {
            return am4core.color("#E9E9E9");
          }
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
  $quarter.text(moduleType == "parallel" ? formatTransAndImages('0', 100, 'translations') : moduleType == "ocr" ? formatTransAndImages('0', 100, 'images') : `0 - ${formatTimeForLegends(qHours, qMinuts, 0, true)}`);
  $half.text(moduleType == "parallel" ? formatTransAndImages('100', 200, 'translations') : moduleType == "ocr" ? formatTransAndImages('100', 200, 'images')  : `${formatTimeForLegends(qHours, qMinuts, 0, false)} - ${formatTimeForLegends(hHours, hMinuts, 0, true)}`);
  $threeQuarter.text(moduleType == "parallel" ? formatTransAndImages('200', 500, 'translations') : moduleType == "ocr" ? formatTransAndImages('200', 500, 'images'):
    `${formatTimeForLegends(hHours, hMinuts, 0, false)} - ${formatTimeForLegends(tQHours, tQMinuts, 0, true)}`
  );
  $full.text(moduleType == "parallel" ? formatTransAndImages('', '> 500', 'translations') :  moduleType == "ocr"  ? formatTransAndImages('', '> 500', 'images'):  `> ${formatTimeForLegends(tQHours, tQMinuts, 0, true)}`);
  $legendDiv.removeClass("d-none").addClass("d-flex");
};

function getLanguageSpecificData(data, lang) {
  const stateData = {
    data: [],
  };
  data.data.forEach(item => {
    if (item.language) {
      if (item.language.toLowerCase() === lang.toLowerCase()
        && item.state !== ''
        && item.state.toLowerCase() !== 'anonymous') {
        stateData.data.push(item);
      }
    }
  });
  return stateData;
}

// const disposeLineChart = (chartDiv) => {
//   if (chartReg[chartDiv]) {
//       chartReg[chartDiv].dispose();
//       delete chartReg[chartDiv];
//   }
// }

const generateIndiaMap = function (language = "", moduleType) {
  $mapLoader.show().addClass('d-flex');
  $mapChart.addClass('d-none');
  const url = language !== "" ? `/aggregate-data-count/${moduleType}?byState=true&byLanguage=true` : `/aggregate-data-count/${moduleType}?byState=true`;
  performAPIRequest(url)
    .then((data) => {
      const result = language !== "" ? getLanguageSpecificData(data, language) : data;
      // disposeLineChart('indiaMapChart')
      drawMap(result, moduleType);
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
  $speakersDataHoursValue.text(formatTime(hours, minutes, seconds));
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
