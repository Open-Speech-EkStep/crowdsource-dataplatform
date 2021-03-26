const fetch = require('./fetch')
const {generateIndiaMap} = require('./home-page-charts');
const {calculateTime, formatTime} = require('./utils')
const $chartRow = $('.chart-row');
const $chartLoaders = $chartRow.find('.loader');
const $charts = $chartRow.find('.chart');
const $timelineLoader = $('#timeline-loader');
const $timelineChart = $('#timeline-chart');

const chartReg = {};

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
    const genderOrder = ['male', 'female', 'anonymous', 'transgender'];
    const formattedGenderData = [];
    genderOrder.forEach(gender => {
        genderData.data.forEach(item => {
            let gType = item.gender;
            if (item.gender === "") item.gender = 'anonymous';
            if(item.gender.toLowerCase().indexOf('transgender') > -1 || item.gender.toLowerCase().indexOf('rather') > -1) gType = "transgender";
            if (gender === gType) {
                const genderType = gType.charAt(0).toUpperCase() + gType.slice(1);
                const {hours:cHours, minutes: cMinutes, seconds: cSeconds} = calculateTime((Number(item.hours_contributed)*60*60), true);
                const contributedHours = formatTime(cHours, cMinutes, cSeconds);
                if (gType === "transgender") {
                    formattedGenderData.push({
                        ...item,
                        gender: "Others",
                        tooltipText: `
                                <div>
                                    <h6 style="text-align: left; font-weight: bold">${item.gender}</h6>
                                    <div>Contributed: <label>${contributedHours}</label></div>
                                    <div style="text-align: left;">Speakers: <label>${item.speakers}</label></div>
                                </div>`
                    });
                } else {
                    formattedGenderData.push({
                        ...item,
                        gender: genderType,
                        tooltipText: `
                                <div>
                                    <h6 style="text-align: left; font-weight: bold">${genderType}</h6>
                                    <div>Contributed: <label>${contributedHours}</label></div>
                                    <div style="text-align: left;">Speakers: <label>${item.speakers}</label></div>
                                </div>`
                    });
                }
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
    const chartColors = ['#5d6d9a', '#85A8F9', '#B7D0FE', '#6C85CE', '#316AFF', '#294691'];
    am4core.ready(function () {
        const chart = am4core.create('gender-chart', am4charts.XYChart);
        chartData.forEach(item => {
            const {hours:cHours, minutes: cMinutes, seconds: cSeconds} = calculateTime((Number(item.hours_contributed)*60*60), true);
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
        columnTemplate.tooltipHTML = `<div> {tooltipText}</div>`;
        columnTemplate.tooltipX = am4core.percent(50);
        columnTemplate.tooltipY = am4core.percent(0);

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
            const {hours:cHours, minutes: cMinutes, seconds: cSeconds} = calculateTime((Number(chartData[i].cumulative_contributions)*60*60), true);
            const {hours:vHours, minutes:vMinutes, seconds: vSeconds} = calculateTime((Number(chartData[i].cumulative_validations)*60*60), true);
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

module.exports = {
    updateGraph,
    buildGraphs,
    getOrderedGenderData,
    getGenderData,
    getAgeGroupData,
};
