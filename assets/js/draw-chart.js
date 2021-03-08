const $chartRow = $('.chart-row');
const $chartLoaders = $chartRow.find('.loader');
const $charts = $chartRow.find('.chart');
const $popovers = $chartRow.find('[data-toggle="popover"]');
const $body = $('body');
const $timelineLoader = $('#timeline-loader');
const $timelineChart = $('#timeline-chart');

const chartReg = {};

const statesInformation = [
    {id: 'IN-TG',state: 'Telangana',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-AN',state: 'Andaman and Nicobar Islands',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-AP',state: 'Andhra Pradesh',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-AR',state: 'Arunanchal Pradesh',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-AS',state: 'Assam',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-BR',state: 'Bihar',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-CT',state: 'Chhattisgarh',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-GA',state: 'Goa',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-GJ',state: 'Gujarat',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-HR',state: 'Haryana',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-HP',state: 'Himachal Pradesh',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-JK',state: 'Jammu & Kashmir',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-JH',state: 'Jharkhand',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-KA',state: 'Karnataka',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-KL',state: 'Kerala',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-LD',state: 'Lakshadweep',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-MP',state: 'Madhya Pradesh',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-MH',state: 'Maharashtra',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-MN',state: 'Manipur',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-CH',state: 'Chandigarh',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-PY',state: 'Puducherry',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-PB',state: 'Punjab',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-RJ',state: 'Rajasthan',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-SK',state: 'Sikkim',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-TN',state: 'Tamil Nadu',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-TR',state: 'Tripura',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-UP',state: 'Uttar Pradesh',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-UT',state: 'Uttarakhand',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-WB',state: 'West Bengal',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-OR',state: 'Odisha',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-DNDD',state: 'Dadra and Nagar Haveli and Daman and Diu',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-ML',state: 'Meghalaya',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-MZ',state: 'Mizoram',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-NL',state: 'Nagaland',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-DL',state: 'National Capital Territory of Delhi',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0},
  {id: 'IN-LK',state: 'Ladakh',contributed_time: "0 hrs",validated_time: "0 hrs", total_speakers: 0}
]

function formatTime(hours, minutes=0, seconds=0) {
    let result = '';
    if(hours > 0) {
        result += `${hours} hrs `;
    }
    if(minutes > 0) {
        result += `${minutes} min `;
    }
    if(hours === 0 && minutes === 0 && seconds > 0) {
        result += `${seconds} sec `;
    }
    return result.substr(0, result.length-1);
}

function calculateTime(contributions, isSeconds=true) {
    const totalSeconds = contributions * 3600;
    const hours = Math.floor(totalSeconds / 3600);
    const remainingAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingAfterHours / 60);
    const seconds = parseInt(remainingAfterHours % 60);
    if(isSeconds) {
        return {hours, minutes, seconds};
    } else {
        return {hours, minutes};
    }
}

function getOrderedGenderData(formattedGenderData) {
    const orderedGenderData = [];
    const order = ['Female', 'Male', 'Others', 'Anonymous'];
    order.forEach((gender) => {
        formattedGenderData.forEach((data) => {
            if (gender.toLowerCase() === data.gender.toLowerCase()) {

                const index = orderedGenderData.findIndex(e => gender.toLowerCase() === e.gender.toLowerCase());
                if (index === -1) {
                    orderedGenderData.push(data);
                } else {
                    orderedGenderData[index].count += data.count;
                }
            }

        });
    });
    return orderedGenderData;
}

function getAgeGroupData(data, key) {
    let formattedData = [];
    data.forEach((item) => {
        const element = item[key] ? item : {...item, [key]: 'Anonymous'};
        const index = formattedData.findIndex(e => element[key].toLowerCase() === e[key].toLowerCase());
        if (index >= 0) {
            formattedData[index].contributions += element.contributions;
            formattedData[index].speakers += element.speakers;
        } else {
            formattedData.push(element);
        }
    });
    return formattedData;
}

const getGenderData = (genderData) => {
    const genderOrder = ['male', 'female', 'anonymous', 'others'];
    const formattedGenderData = [];
    genderOrder.forEach(gender => {
        genderData.data.forEach(item => {
            if (!item.gender) item.gender = 'anonymous';
            if (gender === item.gender) {
                formattedGenderData.push({
                    ...item,
                    gender: item.gender.charAt(0).toUpperCase() + item.gender.slice(1)
                });
            }
        });
    });
    return formattedGenderData;
}

function updateGraph(language, timeframe, onlyTimeline) {
    if (onlyTimeline) {
        disposeChart('timeline-chart');

        $timelineLoader.show().addClass('d-flex');
        $timelineChart.addClass('d-none');
        buildTimelineGraph(language, timeframe);
    } else {
        am4core.disposeAllCharts();

        $chartLoaders.show().addClass('d-flex');
        $charts.addClass('d-none');
        $timelineLoader.addClass('d-none');
        buildGraphs(language, timeframe);
    }
}

const disposeChart = (chartDiv) => {
    if (chartReg[chartDiv]) {
        chartReg[chartDiv].dispose();
        delete chartReg[chartDiv];
    }
}

const buildTimelineGraph = (language, timeframe) => {
    fetch(`/timeline?language=${language}&timeframe=${timeframe}`)
    .then((data) => {
        if (!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return data.json();
        }
    }).then((data) => {
        $timelineLoader.hide().removeClass('d-flex');
        $timelineChart.removeClass('d-none');

        drawTimelineChart(data);
    }).catch((err) => {
        console.log(err);
    });
}

const performAPIRequest = (url) => {
    return fetch(url).then((data) => {
        if(!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
}

function buildGraphs(language, timeframe) {
    // $.fn.popover.Constructor.Default.whiteList.table = [];
    // $.fn.popover.Constructor.Default.whiteList.tbody = [];
    // $.fn.popover.Constructor.Default.whiteList.tr = [];
    // $.fn.popover.Constructor.Default.whiteList.td = [];

    Promise.all([
        fetch(`/timeline?language=${language}&timeframe=${timeframe}`),
        fetch(`/contributions/gender?language=${language}`),
        fetch(`/contributions/age?language=${language}`)
    ]).then(function (responses) {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then((data) => {
        try {
            $chartLoaders.hide().removeClass('d-flex');
            $charts.removeClass('d-none');

            const genderData = getGenderData(data[1]);
            const ageGroupData = getAgeGroupData(data[2].data, 'age_group').sort((a, b) => Number(a.speakers) - Number(b.speakers));

            // Draw timeline chart
            drawTimelineChart(data[0]);

            // Draw gender chart
            drawGenderChart(genderData);

            // Draw state chart
            generateIndiaMap(language);

            // Draw age group chart
            drawAgeGroupChart(ageGroupData);

            //lazy load other css
            setTimeout(() => {
                fetch(
                    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css'
                );
                fetch('https://fonts.googleapis.com/icon?family=Material+Icons');
                fetch('css/notyf.min.css');
                fetch('css/record.css');
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

const chartColors = ['#85A8F9', '#B7D0FE', '#316AFF', '#294691'];
const drawAgeGroupChart = (chartData) => {
    const chart = am4core.create('age-group-chart', am4charts.PieChart3D);
    chart.data = chartData.slice(0, 3).concat({
        age_group: 'Others',
        speakers: chartData
            .slice(3)
            .reduce((acc, curr) => acc + Number(curr.speakers), 0),
    });
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

    const activeLegend = chart.legend.labels.template.states.getKey('active');
    activeLegend.properties.textDecoration = 'line-through';

    const activeLegendLabel = chart.legend.valueLabels.template.states.getKey(
        'active'
    );
    activeLegendLabel.properties.textDecoration = 'line-through';

    chart.legend.valueLabels.template.align = 'right';
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

const drawGenderChart = (chartData) => {
    am4core.ready(function () {
        const chart = am4core.create('gender-chart', am4charts.XYChart);
        chartData.forEach(item => {
            const {hours:cHours, minutes: cMinutes, seconds: cSeconds} = calculateTime((Number(item.hours_contributed)), true);
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
        columnTemplate.tooltipHTML = `
            <div>
                <h6 style="text-align: left; font-weight: bold">{gender}</h6>
                <div>Contributed: <label>{contributedHours}</label></div>
                <div style="text-align: left;">Speakers: <label>{speakers}</label></div>
            </div>`;

        columnTemplate.adapter.add('fill', function (fill, target) {
            return chartColors[chartColors.length - 1 - target.dataItem.index];
        });
        columnTemplate.adapter.add('stroke', function (stroke, target) {
            return chartColors[chartColors.length - 1 - target.dataItem.index];
        });

        chartReg['gender-chart'] = chart;
    });
};

const drawTimelineChart = (timelineData) => {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        // Create chart instance
        const chart = am4core.create("timeline-chart", am4charts.XYChart);

        const chartData = timelineData.data;
        for (let i = 0; i < chartData.length; i++) {
            if (!chartData[i].month) {
                chartData[i].month = chartData[i].quarter * 3;
            }
            chartData[i].duration = new Date(chartData[i].year, chartData[i].month-1, 1);
            chartData[i].year = String(chartData[i].year);
            const {hours:cHours, minutes: cMinutes, seconds: cSeconds} = calculateTime((Number(chartData[i].cumulative_contributions)), true);
            const {hours:vHours, minutes:vMinutes, seconds: vSeconds} = calculateTime((Number(chartData[i].cumulative_validations)), true);
            chartData[i].contributedHours = `${cHours}hrs ${cMinutes}mins ${cSeconds}secs`;
            chartData[i].validatedHours = `${vHours}hrs ${vMinutes}mins ${vSeconds}secs`;
        }

        chart.data = chartData;

        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 10;
        dateAxis.renderer.grid.template.disabled = true;
        dateAxis.renderer.baseGrid.disabled = false;
        dateAxis.renderer.labels.template.fill = '#000';
        dateAxis.title.text = 'Time';
        dateAxis.renderer.labels.template.fontSize = 12;
        dateAxis.title.fontSize = 12;

        const hourAxis = chart.yAxes.push(new am4charts.ValueAxis());
        hourAxis.min = 0;
        hourAxis.renderer.minGridDistance = 50;
        hourAxis.renderer.grid.template.strokeDasharray = "3,3";
        hourAxis.renderer.labels.template.fill = '#000';
        hourAxis.title.text = 'Number of hours';
        hourAxis.renderer.labels.template.fontSize = 12;
        hourAxis.title.fontSize = 12;

        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "duration";
        series.dataFields.valueY = "cumulative_contributions";
        series.strokeWidth = 3;
        series.tensionX = 0.8;
        series.tooltipHTML = `
            <div>
                <h6 style="text-align: left; font-weight: bold">{month}/{year}</h6>
                <div>Contributed: <label>{contributedHours}</label></div>
                <div style="text-align: left; font-style: italic;">Validated: <label>{validatedHours}</label></div>
            </div>`;
        series.tooltip.getFillFromObject = false;
        series.tooltip.autoTextColor = false;
        series.tooltip.background.fill = am4core.color("#F1F1F2");
        series.tooltip.label.fill = am4core.color("#000000");
        series.sequencedInterpolation = true;
        series.stroke = am4core.color("#FCC232");
        series.name = "Recorded";

        // Create series
        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.dataFields.dateX = "duration";
        series2.dataFields.valueY = "cumulative_validations";
        series2.sequencedInterpolation = true;
        series2.tensionX = 0.8;
        series2.strokeWidth = 3;
        series2.stroke = am4core.color("#83E661");
        series2.name = "Validated";

        if (chartData.length === 1) {
            const circleBullet = series.bullets.push(new am4charts.CircleBullet());
            circleBullet.circle.fill = am4core.color("#FCC232");
            // circleBullet.circle.strokeWidth = 3;

            const circleBullet2 = series2.bullets.push(new am4charts.CircleBullet());
            circleBullet2.circle.fill = am4core.color("#83E661");
            // circleBullet2.circle.strokeWidth = 3;
        }

        chart.legend = new am4charts.Legend();
        chart.legend.labels.template.fontSize = 12;

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;

        chartReg['timeline-chart'] = chart;
    });
};

function drawMap(response) {
    const $legendDiv = $("#legendDiv");
    const maxContribution = Math.max.apply(Math, response.data.map(function(ele) { return Number(ele.total_contributions); }))
        let quarterVal;
        if (maxContribution > 1) {
        quarterVal = maxContribution / 4;
        } else {
        quarterVal = 0.25;
        }
        statesInformation.forEach(st => {
            const ele = response.data.find(s => st.state === s.state);
            if(ele) {
              const {
                hours: cHours,
                minutes: cMinutes,
                seconds: cSeconds,
              } = calculateTime(Number(ele.total_contributions), true);
              const {
                hours: vHours,
                minutes: vMinutes,
                seconds: vSeconds,
              } = calculateTime(Number(ele.total_validations), true);
              st.contributed_time = `${cHours}hrs ${cMinutes}mins ${cSeconds}sec`;
              st.validated_time = `${vHours}hrs ${vMinutes}mins ${vSeconds}sec`;
              st.value = Number(ele.total_contributions);
              st.total_speakers = ele.total_speakers;
              st.id = st.id;
            } else {
              st.id = st.id;
            }
          });
        var chart = am4core.create("indiaMapChart", am4maps.MapChart);
        chart.geodataSource.url = "https://cdn.amcharts.com/lib/4/geodata/json/india2020Low.json";
        chart.projection = new am4maps.projections.Miller();
        var polygonSeries = new am4maps.MapPolygonSeries();
        chart.seriesContainer.draggable = false;
        chart.seriesContainer.resizable = false;
        chart.chartContainer.wheelable = false;
        chart.maxZoomLevel = 1;
        polygonSeries.useGeodata = true;
        polygonSeries.data = statesInformation;
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipHTML = `<div><h6>{state}</h6> <div>{total_speakers} Speakers  <label style="margin-left: 32px">Contributed: <label style="margin-left: 8px">{contributed_time}</label></label></div> <div>Validated:  <label style="margin-left: 8px">{validated_time}</label></div></div>`;
        polygonTemplate.nonScalingStroke = true;
        polygonTemplate.strokeWidth = 0.5;
        polygonTemplate.fill = am4core.color("#fff");

        // Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);

        polygonSeries.mapPolygons.template.adapter.add("fill", function(fill, target) {
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
        });
        chart.series.push(polygonSeries);

        const $quarter = $("#quarter .legend-val");
        const $half = $("#half .legend-val");
        const $threeQuarter = $("#threeQuarter .legend-val");
        const $full = $("#full .legend-val");
        const {hours: qHours, minutes: qMinuts, seconds: qSeconds} = calculateTime(quarterVal, true);
        const {hours: hHours, minutes: hMinuts, seconds: hSeconds} = calculateTime(quarterVal*2, true);
        const {hours: tQHours, minutes: tQMinuts, seconds: tQSeconds} = calculateTime(quarterVal*3, true);
        $quarter.text(`0 - ${formatTime(qHours, qMinuts, qSeconds)}`);
        $half.text(`${formatTime(qHours, qMinuts, qSeconds)} - ${formatTime(hHours, hMinuts, hSeconds)}`);
        $threeQuarter.text(`${formatTime(hHours, hMinuts, hSeconds)} - ${formatTime(tQHours, tQMinuts, tQSeconds)}`);
        $full.text(`> ${formatTime(tQHours, tQMinuts, tQSeconds)}`);
        $legendDiv.removeClass('d-none').addClass("d-flex");
}

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

function generateIndiaMap(language) {
    const url = language ? '/aggregate-data-count?byState=true&byLanguage=true' : '/aggregate-data-count?byState=true';
    const byLanguage = language ? true : false;
    performAPIRequest(url)
    .then((data) => {
        const response = byLanguage? getLanguageSpecificData(data, language) : data;
        drawMap(response);
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = {
    updateGraph,
    buildGraphs,
    getOrderedGenderData,
    getGenderData,
    getAgeGroupData,
    calculateTime,
    generateIndiaMap,
};
