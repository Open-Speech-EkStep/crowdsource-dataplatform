const $chartRow = $('#chart-row');
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

function getFormattedData(data, key) {
    let formattedData = [];
    data.forEach((item) => {
        const element = item[key] ? item : {[key]: 'Anonymous', count: item.count};
        const index = formattedData.findIndex(e => element[key].toLowerCase() === e[key].toLowerCase());
        if (index >= 0) {
            formattedData[index].count += element.count;
        } else {
            formattedData.push(element);
        }
    })
return formattedData;
}

function updateGraph(language) {
    am4core.disposeAllCharts();

    $chartLoaders.show().addClass('d-flex');
    $charts.addClass('d-none');
    buildGraphs(language);
}

function buildGraphs(language) {
    $.fn.popover.Constructor.Default.whiteList.table = [];
    $.fn.popover.Constructor.Default.whiteList.tbody = [];
    $.fn.popover.Constructor.Default.whiteList.tr = [];
    $.fn.popover.Constructor.Default.whiteList.td = [];

    fetch(`/getAllInfo/${language}`)
        .then((data) => {
            if (!data.ok) {
                throw Error(data.statusText || 'HTTP error');
            } else {
                return data.json();
            }
        })
        .then((data) => {
            try {
                $chartLoaders.hide().removeClass('d-flex');
                $charts.removeClass('d-none');
                const formattedAgeGroupData = getFormattedData(data.ageGroups, 'age_group').sort((a, b) => Number(a.count) - Number(b.count));
                drawAgeGroupChart( formattedAgeGroupData);
                const motherTongueTotal = data.motherTongues.reduce(
                    (acc, curr) => acc + Number(curr.count),
                    0
                );
                const formattedMotherTongueData = getFormattedData(data.motherTongues, 'mother_tongue').sort((a, b) => Number(b.count) - Number(a.count));
                drawMotherTongueChart(
                    formattedMotherTongueData.slice(0, 4),
                    motherTongueTotal,
                    'mother-tongue-chart',
                    true
                );
                drawMotherTongueChart(
                    formattedMotherTongueData,
                    motherTongueTotal,
                    'modal-chart'
                );
                const formattedGenderData = data.genderData.map((item) => {
                    return item.gender
                        ? {
                            ...item,
                            gender:
                                item.gender.charAt(0).toUpperCase() + item.gender.slice(1),
                        }
                        : {gender: 'Anonymous', count: item.count}
                });
                let orderedGenderData = getOrderedGenderData(formattedGenderData);
                const table = new Table()
                drawGenderChart(orderedGenderData);
                setPopOverContent(
                    $popovers.eq(0),
                    table.createTableWithTwoColumns(formattedMotherTongueData, 'mother_tongue')
                );
                setPopOverContent(
                    $popovers.eq(1),
                    table.createTableWithTwoColumns(formattedAgeGroupData, 'age_group')
                );
                setPopOverContent(
                    $popovers.eq(2),
                    table.createTableWithOneColumn(formattedGenderData, 'gender')
                );
                // for small screen increase width of mother tongue chart modal
                if (innerWidth < 992) {
                    $('#modal-chart-wrapper').find('.modal-dialog').addClass('w-90');
                }
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
        })
        .catch((err) => {
            console.log(err);
        });
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

const chartColors = ['#3f80ff', '#4D55A5', '#735dc6', '#68b7dc'];
const drawAgeGroupChart = (chartData) => {
    const chart = am4core.create('age-group-chart', am4charts.PieChart3D);
    chart.data = chartData.slice(0, 3).concat({
        age_group: 'Others',
        count: chartData
            .slice(3)
            .reduce((acc, curr) => acc + Number(curr.count), 0),
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
    series.dataFields.value = 'count';
    series.dataFields.depthValue = 'count';
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
        const chart = am4core.create('gender-chart', am4charts.XYChart3D);
        chart.paddingBottom = 30;
        chart.paddingTop = 5;
        chart.data = chartData;
        // Create axes
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'gender';
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.inside = false;
        categoryAxis.renderer.labels.template.fill = '#74798c';
        categoryAxis.renderer.grid.template.disabled = true;

        const labelTemplate = categoryAxis.renderer.labels.template;
        labelTemplate.rotation = -90;
        labelTemplate.horizontalCenter = 'left';
        labelTemplate.verticalCenter = 'middle';
        labelTemplate.dy = 10; // moves it a bit down;
        labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = false;
        valueAxis.renderer.labels.template.fill = '#74798c';
        valueAxis.renderer.baseGrid.disabled = true;
        // Create series
        const series = chart.series.push(new am4charts.ConeSeries());
        series.calculatePercent = true;
        series.dataFields.valueY = 'count';
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

module.exports = {
    Table,
    updateGraph,
    buildGraphs,
    getOrderedGenderData,
    getFormattedData
};
