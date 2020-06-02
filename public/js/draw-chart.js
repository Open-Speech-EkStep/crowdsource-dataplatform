const $chartRow = $('#chart-row');
const $chartLoaders = $chartRow.find('.loader');
const $charts = $chartRow.find('.chart');
const $popovers = $chartRow.find('[data-toggle="popover"]');
fetch('/getAllInfo')
    .then(data => {
        if (!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        }
        else {
            return data.json();
        }
    })
    .then(data => {
        try {
            console.log(data)
            $chartLoaders.hide().removeClass('d-flex');
            $charts.removeClass('d-none');
            const formattedAgeGroupData = data.ageGroups.map(item => item.ageGroup ? { ...item, ageGroup: item.ageGroup.padEnd(7, ' ') } : { ageGroup: 'Unknown', count: item.count })
                .sort((a, b) => Number(b.count) - Number(a.count));
            drawAgeGroupChart(formattedAgeGroupData);
            const formattedMotherTongueData = data.motherTongues.map(item => item.motherTongue ?
                item : { motherTongue: 'Unknown', count: item.count })
                .sort((a, b) => Number(b.count) - Number(a.count));
            drawMotherTongueChart(formattedMotherTongueData);
            const formattedGenderData = data.genderData.map(item => item.gender ? { ...item, gender: item.gender.charAt(0).toUpperCase() + item.gender.slice(1) } : { gender: 'Unknown', count: item.count }).sort((a, b) => Number(a.count) - Number(b.count))
            drawGenderChart(formattedGenderData);
            setPopOverContent($popovers.eq(0), formattedMotherTongueData, 'motherTongue');
            setPopOverContent($popovers.eq(1), formattedAgeGroupData, 'ageGroup');
            setPopOverContent($popovers.eq(2), formattedGenderData, 'gender');
        } catch (error) {
            console.log(error);
            $chartLoaders.show().addClass('d-flex');
            $charts.addClass('d-none');
        }
    })
    .catch(err => {
        console.log(err);
    })
$.fn.popover.Constructor.Default.whiteList.table = [];
$.fn.popover.Constructor.Default.whiteList.tbody = [];
$.fn.popover.Constructor.Default.whiteList.tr = [];
$.fn.popover.Constructor.Default.whiteList.td = [];
const setPopOverContent = ($popover, data, dataKey) => {
    const dataHtml = data.map(datum => `<tr><td>${datum[dataKey]}</td><td>${datum.count}</td></tr>`);
    console.log(dataHtml);
    const tableHtml = `<table class="table table-sm table-borderless mb-0"><tbody>${dataHtml.join('')}</tbody></table>`;
    console.log(tableHtml);
    $popover.popover({
        content: tableHtml
    });
}

const drawAgeGroupChart = (chartData) => {
    const chart = am4core.create("age-group-chart", am4charts.PieChart3D);
    chart.data = chartData.slice(0, 4);
    chart.paddingBottom = 50;
    chart.innerRadius = am4core.percent(40);
    chart.depth = 10;
    chart.legend = new am4charts.Legend();
    //break point for large screen
    if (screen.availWidth < 992) {
        chart.legend.position = "right"
    }
    const series = chart.series.push(new am4charts.PieSeries3D());
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;
    series.slices.template.tooltipText = "{category}: {value.value}";
    series.labels.template.text = "{category}: {value.value}";
    series.dataFields.value = "count";
    series.dataFields.depthValue = "count";
    series.dataFields.category = "ageGroup";
    series.slices.template.cornerRadius = 5;
    series.colors.step = 3;
}

const drawMotherTongueChart = (chartData) => {

    // am4core.ready(function () {
    //     const chart = am4core.create("mother-tongue-chart", am4charts.XYChart3D);
    //     chart.data = chartData.map(item => item.motherTongue ? { ...item, "color": chart.colors.next() } : { motherTongue: 'Unknown', count: item.count, "color": chart.colors.next() }).sort((a,b) => Number(a.count) - Number(b.count));
    //     const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    //     categoryAxis.dataFields.category = "motherTongue";
    //     categoryAxis.renderer.minGridDistance = 10;
    //     categoryAxis.numberFormatter.numberFormat = "#";
    //     categoryAxis.renderer.inversed = true;

    //     const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());

    //     const series = chart.series.push(new am4charts.ColumnSeries3D());
    //     series.dataFields.valueX = "count";
    //     series.dataFields.categoryY = "motherTongue";
    //     series.name = "count";
    //     series.columns.template.propertyFields.fill = "color";
    //     series.columns.template.tooltipText = "{categoryY} : {valueX}";
    //     series.columns.template.column3D.stroke = am4core.color("#fff");
    //     series.columns.template.column3D.strokeOpacity = 0.2;

    // });

    const chart = am4core.create("mother-tongue-chart", am4charts.XYChart3D);
    chart.data = chartData.slice(0, 4);
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "motherTongue";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "motherTongue";
    series.columns.template.tooltipText = "{categoryX} : {valueY}";
    // series.columns.template.fillOpacity = .8;

    var columnTemplate = series.columns.template;
    // columnTemplate.strokeWidth = 2;
    // columnTemplate.strokeOpacity = 1;
    // columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", function (stroke, target) {
        return chart.colors.getIndex(target.dataItem.index);
    })

}

const drawGenderChart = (chartData) => {
    am4core.ready(function () {
        const chart = am4core.create("gender-chart", am4charts.XYChart3D);
        chart.paddingBottom = 50;
        chart.data = chartData;

        // Create axes
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "gender";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.inside = true;
        categoryAxis.renderer.grid.template.disabled = false;
        categoryAxis.renderer.minGridDistance = 10;

        let labelTemplate = categoryAxis.renderer.labels.template;
        labelTemplate.rotation = -90;
        labelTemplate.horizontalCenter = "left";
        labelTemplate.verticalCenter = "middle";
        labelTemplate.dy = 10; // moves it a bit down;
        labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = false;

        // Create series
        const series = chart.series.push(new am4charts.ConeSeries());
        series.dataFields.valueY = "count";
        series.dataFields.categoryX = "gender";
        series.columns.template.tooltipText = "{categoryX} : {valueY}";

        const columnTemplate = series.columns.template;
        columnTemplate.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        })
        columnTemplate.adapter.add("stroke", function (stroke, target) {
            return chart.colors.getIndex(target.dataItem.index);
        })

    });
}
