const {updateGraph, buildGraphs} = require('./draw-chart');
const {toggleFooterPosition} = require('./utils')
const {validateUserName, testUserName,setSpeakerDetails, resetSpeakerDetails,setUserNameTooltip,setStartRecordBtnToolTipContent} = require('./speakerDetails');

// function updateLanguageInButton(lang) {
//     document.getElementById(
//         'start-record'
//     ).innerText = `START RECORDING IN ${lang.toUpperCase()}`;
// }

function calculateTime(totalSentence) {
    const totalSeconds = totalSentence * 6;
    const hours = Math.floor(totalSeconds / 3600);
    const remainingAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingAfterHours / 60);
    const seconds = remainingAfterHours % 60;
    return {hours, minutes, seconds};
}

const fetchDetail = (language) => {
    return fetch(`/getDetails/${language}`).then((data) => {
        if (!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
};

const performAPIRequest = (url) => {
    return fetch(url).then((data) => {
        if(!data.ok) {
            throw Error(data.statusText || 'HTTP error');
        } else {
            return Promise.resolve(data.json());
        }
    });
}

function updateLanguage(language) {
    const $speakersData = $('#speaker-data');
    const $speakersDataLoader = $speakersData.find('#loader1,#loader2');
    const $speakersDataSpeakerWrapper = $('#speakers-wrapper');
    const $speakersDataSpeakerValue = $('#speaker-value');
    const $speakersDataHoursWrapper = $('#hours-wrapper');
    const $speakersDataHoursValue = $('#hour-value');
    $speakersDataLoader.removeClass('d-none');
    $speakersDataHoursWrapper.addClass('d-none');
    $speakersDataSpeakerWrapper.addClass('d-none');

    fetchDetail(language)
        .then((data) => {
            try {
                const totalSentence = data.find((t) => t.index === 1).count;
                const {hours, minutes, seconds} = calculateTime(totalSentence);
                $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
                $speakersDataSpeakerValue.text(data.find((t) => t.index === 0).count);

                $speakersDataLoader.addClass('d-none');
                $speakersDataHoursWrapper.removeClass('d-none');
                $speakersDataSpeakerWrapper.removeClass('d-none');
                localStorage.setItem('speakersData', JSON.stringify(data));
            } catch (error) {
                console.log(error);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function showStatistics() {
    performAPIRequest('/aggregate-data-count').then((response) => {
        console.log('aggregate-data-count: ', response);
    });
}

function constructChart(response, xAxisLabel, yAxisLabel) {
    var chart = am4core.create("speakers_hours_chart", am4charts.XYChart);
    chart.data = response;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = yAxisLabel;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;
    categoryAxis.renderer.grid.template.strokeWidth = 0;
    categoryAxis.labelsEnabled = false;
    
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeWidth = 0;
    valueAxis.labelsEnabled = false;

    categoryAxis.renderer.minGridDistance = 25;
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = xAxisLabel;
    series.dataFields.categoryY = yAxisLabel;

    var valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = 'yAxisLabel';
    valueLabel.label.fontSize = 20;
    valueLabel.label.horizontalCenter = "right";
    valueLabel.label.dx = 10;

    var cellSize = 35;
    chart.events.on("datavalidated", function(ev) {
        var chart = ev.target;
        var categoryAxis = chart.yAxes.getIndex(0);
        var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
        var targetHeight = chart.pixelHeight + adjustHeight;
        chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });
}

function showByHoursChart() {
    const $topLanguageSpinner = $('#topLanguageSpinner');
    $topLanguageSpinner.show().addClass('d-flex');
    performAPIRequest('/top-languages-by-hours').then((response) => {
        constructChart(response.data, 'total_contributions', 'language');
        $topLanguageSpinner.hide().removeClass('d-flex');
    });
}

function showBySpeakersChart() {
    const $topLanguageSpinner = $('#topLanguageSpinner');
    const $speakersHoursChart = $('#speakers_hours_chart_container');
    $topLanguageSpinner.show().addClass('d-flex');
    $speakersHoursChart.addClass('d-none');
    performAPIRequest('/top-languages-by-speakers').then((response) => {
        constructChart(response.data, 'total_speakers', 'language');
        $topLanguageSpinner.hide().removeClass('d-flex');
        $speakersHoursChart.removeClass('d-none');
    });
}

function generateIndiaMap() {
    performAPIRequest('/aggregate-data-count?byState=true')
    .then((response) => {
        response.data.forEach(ele => {
            ele.id = ele.state;
            ele.value = Number(ele.total_contributions) + Number(ele.total_validations);
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
        polygonTemplate.tooltipHTML = `<div><h6>{state}</h6> <div>{total_speakers} Speakers  <label style="margin-left: 32px">{total_contributions}</label></div> <div>Validated:  <label style="margin-left: 16px">{total_validations}</label></div></div>`;
        polygonTemplate.nonScalingStroke = true;
        polygonTemplate.strokeWidth = 0.5;
        polygonTemplate.fill = am4core.color("#fff");
    
        // Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);

        polygonSeries.mapPolygons.template.adapter.add("fill", function(fill, target) {
            if (target.dataItem) {
                if (target.dataItem.value > 5) {
                    return am4core.color("#98C52B");
                } else if (target.dataItem.value > 2) {
                    return am4core.color("#E4953D");
                } else if (target.dataItem.value > 1) {
                    return am4core.color("#CFA238");
                } else if (target.dataItem.value > 0) {
                    return am4core.color("#F6D350");
                } else {
                    return am4core.color("#DDD8A5");
                }
            }
            return fill;
        });

        chart.series.push(polygonSeries);

        // Set up heat legend
        let heatLegend = chart.createChild(am4maps.HeatLegend);
        heatLegend.series = polygonSeries;
        heatLegend.align = "right";
        heatLegend.valign = "bottom";
        heatLegend.width = am4core.percent(100);
        heatLegend.marginRight = am4core.percent(4);
        heatLegend.minValue = 0;
        heatLegend.maxValue = 5;

        var legendContainer = am4core.create("legendDiv", am4core.Container);
        legendContainer.width = am4core.percent(100);
        legendContainer.height = am4core.percent(100);
        heatLegend.parent = legendContainer;

        // Set up custom heat map legend labels using axis ranges
        var minRange = heatLegend.valueAxis.axisRanges.create();
        minRange.value = heatLegend.minValue;
        var maxRange = heatLegend.valueAxis.axisRanges.create();
        maxRange.value = heatLegend.maxValue;
        
        // Blank out internal heat legend value axis labels
        heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
            return `${labelText} hr`;
        });
    }).catch((err) => {
        console.log(err);
    });
}

$(document).ready(function () {
    const speakerDetailsKey = 'speakerDetails';
    const defaultLang = 'Odia';
    const $startRecordBtn = $('#proceed-box');
    const $startRecordBtnTooltip = $startRecordBtn.parent();
    const genderRadios = document.querySelectorAll('input[name = "gender"]');
    const age = document.getElementById('age');
    const motherTongue = document.getElementById('mother-tongue');
    const $userName = $('#username');
    const $userNameError = $userName.next();
    const $tncCheckbox = $('#tnc');
    let sentenceLanguage = defaultLang;

    $tncCheckbox.prop('checked', false);

    toggleFooterPosition();

    $startRecordBtnTooltip.tooltip({
        container: 'body',
        placement: screen.availWidth > 500 ? 'right' : 'auto',
    });

    setSpeakerDetails(speakerDetailsKey, age, motherTongue, $userName);

    genderRadios.forEach((element) => {
        element.addEventListener('click', (e) => {
            if (e.target.previous) {
                e.target.checked = false;
            }
            e.target.previous = e.target.checked;
        });
    });

    let top_lang;
    $('#say-listen-language').on('click',(e)=>{
        top_lang  = e.target.getAttribute("value");
    })

    $('#start_recording').on('click', () => {
        sentenceLanguage = top_lang || "Hindi";
    });

    $('[name="topLanguageChart"]').on('change', (event) => {
        console.log(event.target.value);
        if(event.target.value === 'hours') {
            showByHoursChart();
        } else {
            showBySpeakersChart();
        }
    });

    // let languageBottom = defaultLang;
    // $('#language').on('change', (e) => {
    //     languageBottom = e.target.value;
    //     updateLanguage(languageBottom);
    //     updateLanguageInButton(languageBottom);
    //     updateGraph(languageBottom);
    // });

    // $('#start-record').on('click', () => {
    //     sentenceLanguage = languageBottom;
    // });

    setStartRecordBtnToolTipContent($userName.val().trim(), $startRecordBtnTooltip);
    $tncCheckbox.change(function () {
        const userNameValue = $userName.val().trim();
        if (this.checked && !testUserName(userNameValue)) {
            $startRecordBtn.removeAttr('disabled').removeClass('point-none');
            $startRecordBtnTooltip.tooltip('disable');
        } else {
            setStartRecordBtnToolTipContent(userNameValue, $startRecordBtnTooltip);
            $startRecordBtn.prop('disabled', 'true').addClass('point-none');
            $startRecordBtnTooltip.tooltip('enable');
        }
    });

    $userName.on('input focus', () => {
        validateUserName($userName, $userNameError, $tncCheckbox);
        setUserNameTooltip($userName);
    });

    $startRecordBtn.on('click', () => {
        if ($tncCheckbox.prop('checked')) {
            const checkedGender = Array.from(genderRadios).filter((el) => el.checked);
            const genderValue = checkedGender.length ? checkedGender[0].value : '';
            const userNameValue = $userName.val().trim().substring(0, 12);
            if (testUserName(userNameValue)) {
                return;
            }
            const speakerDetails = {
                gender: genderValue,
                age: age.value,
                motherTongue: motherTongue.value,
                userName: userNameValue,
                language: sentenceLanguage,
            };
            localStorage.setItem(speakerDetailsKey, JSON.stringify(speakerDetails));
            location.href = '/record';
        }
    });

    $('#userModal').on('shown.bs.modal', function () {
        $('#resetBtn').on('click', resetSpeakerDetails);
        $userName.tooltip({
            container: 'body',
            placement: screen.availWidth > 500 ? 'right' : 'auto',
            trigger: 'focus',
        });
        setUserNameTooltip($userName);
    });
    const $say = $('#say');
    const $listen = $('#listen');
    const $listen_p_2 = $('#listen-p-2');
    const $say_p_2 = $('#say-p-2');

    $say.hover(()=>{
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $say.addClass('col-lg-7');
        $listen.addClass('col-lg-3');
        $say_p_2.removeClass('d-none');
    }, ()=>{
        $say.removeClass('col-lg-7');
        $listen.removeClass('col-lg-3');
        $say.addClass('col-lg-5');
        $listen.addClass('col-lg-5');
        $say_p_2.addClass('d-none');
    })

    $listen.hover(()=>{
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $listen.addClass('col-lg-7');
        $say.addClass('col-lg-3');
        $listen_p_2.removeClass('d-none');
    }, ()=>{
        $say.removeClass('col-lg-3');
        $listen.removeClass('col-lg-7');
        $say.addClass('col-lg-5');
        $listen.addClass('col-lg-5');
        $listen_p_2.addClass('d-none');
    })

    //updateLanguageInButton(defaultLang);
    updateLanguage(defaultLang);
    buildGraphs(defaultLang);
    generateIndiaMap();
    showByHoursChart();
    showStatistics();
});

module.exports = {
    //updateLanguageInButton,
    updateLanguage,
    calculateTime,
    fetchDetail,
};
