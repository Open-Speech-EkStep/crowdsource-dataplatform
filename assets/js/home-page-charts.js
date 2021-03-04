const TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
const TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";

const formatTime = function (hours, minutes = 0, seconds = 0) {
  let result = "";
  if (hours > 0) {
    result += `${hours} hrs `;
  }
  if (minutes > 0) {
    result += `${minutes} min `;
  }
  if (hours === 0 && minutes === 0 && seconds > 0) {
    result += `${seconds} sec `;
  }
  return result.substr(0, result.length - 1);
};

const calculateTime = function (totalSeconds, isSeconds = true) {
  const hours = Math.floor(totalSeconds / 3600);
  const remainingAfterHours = totalSeconds % 3600;
  const minutes = Math.floor(remainingAfterHours / 60);
  const seconds = Math.round(remainingAfterHours % 60);
  if (isSeconds) {
    return { hours, minutes, seconds };
  } else {
    return { hours, minutes };
  }
};

const performAPIRequest = (url) => {
  return fetch(url).then((data) => {
    if (!data.ok) {
      throw Error(data.statusText || "HTTP error");
    } else {
      return Promise.resolve(data.json());
    }
  });
};

const drawMap = function (response) {
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
  response.data.forEach((ele) => {
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
    ele.contributed_time = `${cHours}hrs ${cMinutes}mins ${cSeconds}sec`;
    ele.validated_time = `${vHours}hrs ${vMinutes}mins ${vSeconds}sec`;
    ele.value = Number(ele.total_contributions);
    ele.id = ele.state;
  });
  var chart = am4core.create("indiaMapChart", am4maps.MapChart);
  chart.geodataSource.url = "./js/states_india_geo.json";
  chart.projection = new am4maps.projections.Miller();
  var polygonSeries = new am4maps.MapPolygonSeries();
  chart.seriesContainer.draggable = false;
  chart.seriesContainer.resizable = false;
  chart.maxZoomLevel = 1;
  polygonSeries.useGeodata = true;
  polygonSeries.data = response.data;
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipHTML = `<div><h6>{state}</h6> <div>{total_speakers} Speakers  <label style="margin-left: 32px">{contributed_time}</label></div> <div>Validated:  <label style="margin-left: 16px">{validated_time}</label></div></div>`;
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.strokeWidth = 0.5;
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
        } else if (target.dataItem.value >= 0) {
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

const generateIndiaMap = function () {
  performAPIRequest("/aggregate-data-count?byState=true")
    .then((response) => {
      drawMap(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

function getStatistics() {
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

  performAPIRequest("/aggregate-data-count")
    .then((response) => {
      try {
        const { hours, minutes, seconds } = calculateTime(
          Number(response.data[0].total_contributions) * 60 * 60
        );
        $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
        $speakersDataSpeakerValue.text(response.data[0].total_speakers);
        $speakersDataLanguagesValue.text(response.data[0].total_languages);
        $speakersDataLoader.addClass("d-none");
        $speakersDataHoursWrapper.removeClass("d-none");
        $speakersDataSpeakerWrapper.removeClass("d-none");
        $speakersDataLanguagesWrapper.removeClass("d-none");
        //localStorage.setItem('speakersData', JSON.stringify(data));
      } catch (error) {
        console.log(error);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function constructChart(response, xAxisLabel, yAxisLabel) {
  var chart = am4core.create("speakers_hours_chart", am4charts.XYChart);
  chartReg["chart"] = chart;
  if (xAxisLabel !== "total_speakers") {
    response.forEach((ele) => {
      const { hours, minutes, seconds } = calculateTime(
        Number(ele.total_contributions) * 60 * 60,
        true
      );
      ele.total_contributions_text = formatTime(hours, minutes, seconds);
    });
  }
  chart.data = response;
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
  valueLabel.label.horizontalCenter = "right";
  valueLabel.label.dx = 0;

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
  if (topLanguagesByHoursData) {
    constructChart(
      JSON.parse(topLanguagesByHoursData).data,
      "total_contributions",
      "language"
    );
  } else {
    performAPIRequest("/top-languages-by-hours").then((response) => {
      localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(response));
      constructChart(response.data, "total_contributions", "language");
    });
  }
}

function showBySpeakersChart() {
  if (chartReg["chart"]) {
    chartReg["chart"].dispose();
  }
  const topLanguagesBySpeakers = localStorage.getItem(
    TOP_LANGUAGES_BY_SPEAKERS
  );
  if (topLanguagesBySpeakers) {
    constructChart(
      JSON.parse(topLanguagesBySpeakers).data,
      "total_speakers",
      "language"
    );
  } else {
    performAPIRequest("/top-languages-by-speakers").then((response) => {
      localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(response));
      constructChart(response.data, "total_speakers", "language");
    });
  }
}

module.exports = {
  generateIndiaMap,
  showByHoursChart,
  showBySpeakersChart,
  getStatistics,
  calculateTime,
  formatTime,
};
