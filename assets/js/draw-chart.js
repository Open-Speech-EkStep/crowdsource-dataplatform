const $chartRow = $('.chart-row');
const $chartLoaders = $chartRow.find('.loader');
const $charts = $chartRow.find('.chart');
const $popovers = $chartRow.find('[data-toggle="popover"]');
const $body = $('body');

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

function updateGraph(language, timeframe) {
    am4core.disposeAllCharts();

    $chartLoaders.show().addClass('d-flex');
    $charts.addClass('d-none');
    buildGraphs(language, timeframe);
}

function buildGraphs(language, timeframe) {
    $.fn.popover.Constructor.Default.whiteList.table = [];
    $.fn.popover.Constructor.Default.whiteList.tbody = [];
    $.fn.popover.Constructor.Default.whiteList.tr = [];
    $.fn.popover.Constructor.Default.whiteList.td = [];

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

    // fetch(`/getAllInfo/${language}`)
    //     .then((data) => {
    //         if (!data.ok) {
    //             throw Error(data.statusText || 'HTTP error');
    //         } else {
    //             return data.json();
    //         }
    //     })
    //     .then((data) => {
    //         try {
    //             $chartLoaders.hide().removeClass('d-flex');
    //             $charts.removeClass('d-none');
    //             const formattedAgeGroupData = getFormattedData(data.ageGroups, 'age_group').sort((a, b) => Number(a.count) - Number(b.count));
    //             drawAgeGroupChart( formattedAgeGroupData);
    //             const formattedGenderData = data.genderData.map((item) => {
    //                 return item.gender
    //                     ? {
    //                         ...item,
    //                         gender:
    //                             item.gender.charAt(0).toUpperCase() + item.gender.slice(1),
    //                     }
    //                     : {gender: 'Anonymous', count: item.count}
    //             });
    //             let orderedGenderData = getOrderedGenderData(formattedGenderData);
    //             const table = new Table()
    //             drawGenderChart(orderedGenderData);
    //             drawTimelineChart();
    //             setPopOverContent(
    //                 $popovers.eq(1),
    //                 table.createTableWithTwoColumns(formattedAgeGroupData, 'age_group')
    //             );
    //             setPopOverContent(
    //                 $popovers.eq(2),
    //                 table.createTableWithOneColumn(formattedGenderData, 'gender')
    //             );
    //             //lazy load other css
    //             setTimeout(() => {
    //                 fetch(
    //                     'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css'
    //                 );
    //                 fetch('https://fonts.googleapis.com/icon?family=Material+Icons');
    //                 fetch('css/notyf.min.css');
    //                 fetch('css/record.css');
    //             }, 2000);
    //         } catch (error) {
    //             console.log(error);
    //             $chartLoaders.show().addClass('d-flex');
    //             $charts.addClass('d-none');
    //         }
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
}

class Table {

    createColumn(dataHtml, columnSize) {
        return `<div class="${columnSize}">` + '<table class="table table-sm table-borderless mb-0">' +
            '<tbody>' + dataHtml.join('') + '</tbody></table></div>';
    }

    createTableWithTwoColumns(data, dataKey) {
        let dataLength = data.length;
        const half = Math.ceil(dataLength / 2);
        const firstHalfDataHtml = this.createTableRows(data.slice(0, half), dataKey);
        const secondHalfDataHtml = this.createTableRows(data.slice(half, dataLength), dataKey);

        return '<div class="row">' +
            this.createColumn(firstHalfDataHtml, "col-6") +
            this.createColumn(secondHalfDataHtml, "col-6") +
            '</div>';
    }

    createTableRows(data, dataKey) {
        return data.map(
            (datum) => `<tr><td>${datum[dataKey]}</td><td>${datum.count}</td></tr>`
        );
    }

    createTableWithOneColumn(data, dataKey) {
        const dataHtml = this.createTableRows(data, dataKey);
        return `<div class="row">${this.createColumn(dataHtml, "col")}</div>`;
    }
}

const setPopOverContent = ($popover, tableHtml = `<div></div>`) => {

    $popover
        .on('mouseenter focus', function () {
            $popover.attr('data-content', tableHtml);
            $popover.popover('show');
            $body.children('.popover').on('mouseleave blur', function () {
                setTimeout(function () {
                    if (
                        !$body.children('.popover').find(':hover').length &&
                        !$popover.is(':hover')
                    ) {
                        $popover.popover('hide');
                    }
                }, 300);
            });
        })
        .on('mouseleave blur', function () {
            setTimeout(function () {
                if (
                    !$body.children('.popover').find(':hover').length &&
                    !$popover.is(':hover')
                ) {
                    $popover.popover('hide');
                }
            }, 300);
        });
    $popover.on('shown.bs.popover', function () {
        const popoverBody = $body.children('.popover')[0];
        //hack : to explore alternatives
        setTimeout(() => {
            const boundary = popoverBody.getBoundingClientRect();
            if (boundary.height + boundary.y > innerHeight) {
                popoverBody.scrollIntoView(false);
            }
        }, 0);
    });
};

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
    chart.legend.labels.template.fill = am4core.color('#74798c');
    chart.legend.valueLabels.template.fill = am4core.color('#74798c');

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

    const series = chart.series.push(new am4charts.PieSeries3D());
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;
    series.calculatePercent = true;
    series.slices.template.tooltipText =
        "{category}: [bold]{value.percent.formatNumber('#.0')}% ({value.value})[/]";
    // series.labels.template.text = "{category}: {value.percent.formatNumber('#.0')}%";
    series.dataFields.value = 'speakers';
    series.dataFields.depthValue = 'speakers';
    series.dataFields.category = 'age_group';
    series.slices.template.adapter.add('fill', function (fill, target) {
        return chartColors[target.dataItem.index];
    });
};

const drawMotherTongueChart = (chartData, totalData, element, staticColor) => {
    const chart = am4core.create(element, am4charts.XYChart3D);
    chart.data = chartData;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'mother_tongue';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.fill = '#74798c';
    categoryAxis.renderer.grid.template.disabled = true;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fill = '#74798c';
    valueAxis.renderer.grid.template.disabled = false;
    valueAxis.renderer.baseGrid.disabled = true;

    const series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = 'count';
    series.dataFields.categoryX = 'mother_tongue';
    series.calculatePercent = true;
    const columnTemplate = series.columns.template;
    columnTemplate.tooltipText = '{categoryX} : [bold]@@@% ({valueY.value})[/]';
    series.tooltip.label.adapter.add('text', function (text, target) {
        if (target.dataItem && text) {
            return text.replace(
                '@@@',
                ((target.dataItem.valueY * 100) / totalData).toFixed(1)
            );
        } else {
            return '';
        }
    });
    columnTemplate.adapter.add('fill', function (fill, target) {
        if (staticColor) {
            return chartColors[target.dataItem.index];
        }
        return chart.colors.getIndex(target.dataItem.index);
    });
};

const drawGenderChart = (chartData) => {
    am4core.ready(function () {
        const chart = am4core.create('gender-chart', am4charts.XYChart);
        chart.data = chartData;
        // Create axes
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'gender';
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.fill = '#000';
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.baseGrid.disabled = false;
        categoryAxis.renderer.labels.template.fontSize = 12;

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = false;
        valueAxis.renderer.labels.template.fill = '#000';
        valueAxis.renderer.grid.template.strokeDasharray = "3,3";
        valueAxis.renderer.labels.template.fontSize = 12;
        valueAxis.title.text = 'Number of hours';
        valueAxis.title.fontSize = 12;
        // Create series
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.calculatePercent = true;
        series.dataFields.valueY = 'speakers';
        series.dataFields.categoryX = 'gender';
        series.columns.template.tooltipText =
            "{categoryX} : [bold]{valueY.percent.formatNumber('#.0')}% ({valueY.value})[/]";

        const columnTemplate = series.columns.template;
        columnTemplate.adapter.add('fill', function (fill, target) {
            return chartColors[chartColors.length - 1 - target.dataItem.index];
        });
        columnTemplate.adapter.add('stroke', function (stroke, target) {
            return chartColors[chartColors.length - 1 - target.dataItem.index];
        });
    });
};

const drawTimelineChart = (timelineData) => {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        // Create chart instance
        var chart = am4core.create("timeline-chart", am4charts.XYChart);

        const chartData = timelineData.data;
        for (let i = 0; i < chartData.length; i++) {
            chartData[i].duration = new Date(chartData[i].year, chartData[i].month-1, 1);
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
        chart.numberFormatter.numberFormat = "#a";

        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "duration";
        series.dataFields.valueY = "cumulative_contributions";
        series.strokeWidth = 3;
        series.tensionX = 0.8;
        series.tooltipText = "Contributions: {cumulative_contributions} Validations: {cumulative_validations}";
        series.sequencedInterpolation = true;
        series.stroke = am4core.color("#FCC232")
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

        chart.legend = new am4charts.Legend();
        chart.legend.labels.template.fontSize = 12;

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
    });
};

module.exports = {
    Table,
    updateGraph,
    buildGraphs,
    getOrderedGenderData,
    getGenderData,
    getAgeGroupData
};
