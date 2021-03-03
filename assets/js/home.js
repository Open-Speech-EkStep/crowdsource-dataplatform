const {buildGraphs} = require('./draw-chart');
const {toggleFooterPosition} = require('./utils')
const {
    validateUserName,
    testUserName,
    setSpeakerDetails,
    resetSpeakerDetails,
    setUserNameTooltip,
    setStartRecordBtnToolTipContent
} = require('./speakerDetails');

const TOP_LANGUAGES_BY_HOURS = "topLanguagesByHours";
const TOP_LANGUAGES_BY_SPEAKERS = "topLanguagesBySpeakers";
const AGGREGATED_DATA_BY_STATE = "aggregatedDataByState";
const AGGREGATED_DATA_BY_LANGUAGE =  "aggregateDataCountByLanguage";

function formatTime(hours, minutes=0, seconds=0) {
    let result = '';
    if(hours > 0) {
        result += `${hours} hrs `;
    }
    if(minutes > 0) {
        result += `${minutes} min `;
    }
    if(seconds > 0) {
        result += `${seconds} min `;
    }
    return result.substr(0, result.length-1);
}

function calculateTime(totalSeconds, isSeconds=true) {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingAfterHours / 60);
    const seconds = Math.round(remainingAfterHours % 60);
    if(isSeconds) {
        return {hours, minutes, seconds};
    } else {
        return {hours, minutes};
    }
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

function updateHrsForSayAndListen(language) {
    const $sayLoader = $('#say-loader');
    const $listenLoader = $('#listen-loader');
    $sayLoader.removeClass('d-none');
    $listenLoader.removeClass('d-none');
    setAggregateDataCountByLanguage();
    const $say_p_3 = $("#say-p-3");
    const $listen_p_3 = $("#listen-p-3");
    const stringifyData = localStorage.getItem(AGGREGATED_DATA_BY_LANGUAGE);
    const aggregateDetails = JSON.parse(stringifyData);
    const totalInfo = aggregateDetails && aggregateDetails.find((element) => element.language === language);
    if (totalInfo) {
        const {total_contributions, total_validations} = totalInfo;
        total_contributions && $say_p_3.text(`${total_contributions} hrs are recorded in ${language}`);
        total_validations && $listen_p_3.text(`${total_validations} hrs are validated in ${language}`);
    } else {
        $say_p_3.text(`0 hr is recorded in ${language}`);
        $listen_p_3.text(`0 hr is validated in ${language}`);
    }
    $sayLoader.addClass('d-none');
    $listenLoader.addClass('d-none');
}

function getStatistics() {
    const $speakersData = $('#speaker-data');
    const $speakersDataLoader = $speakersData.find('#loader1, #loader2, #loader3');
    const $speakersDataSpeakerWrapper = $('#speakers-wrapper');
    const $speakersDataSpeakerValue = $('#speaker-value');
    const $speakersDataHoursWrapper = $('#hours-wrapper');
    const $speakersDataHoursValue = $('#hour-value');
    const $speakersDataLanguagesWrapper = $('#languages-wrapper');
    const $speakersDataLanguagesValue = $('#languages-value');
    $speakersDataLoader.removeClass('d-none');
    $speakersDataHoursWrapper.addClass('d-none');
    $speakersDataSpeakerWrapper.addClass('d-none');
    $speakersDataLanguagesWrapper.addClass('d-none');

    performAPIRequest('/aggregate-data-count')
        .then((response) => {
            try {
                const {hours, minutes, seconds} = calculateTime((Number(response.data[0].total_contributions)*60*60));
                $speakersDataHoursValue.text(`${hours}h ${minutes}m ${seconds}s`);
                $speakersDataSpeakerValue.text(response.data[0].total_speakers);
                $speakersDataLanguagesValue.text(response.data[0].total_languages);
                $speakersDataLoader.addClass('d-none');
                $speakersDataHoursWrapper.removeClass('d-none');
                $speakersDataSpeakerWrapper.removeClass('d-none');
                $speakersDataLanguagesWrapper.removeClass('d-none');
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
        response.forEach(ele => {
            const {hours, minutes} = calculateTime(Number(ele.total_contributions)*60*60);
            ele.total_contributions_text = formatTime(hours, minutes);
        });
    }
    chart.data = response;
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = yAxisLabel;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;
    categoryAxis.renderer.grid.template.strokeWidth = 0;
    var label = categoryAxis.renderer.labels.template;
    label.truncate = false;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeWidth = 0;
    valueAxis.labelsEnabled = false;

    var label = valueAxis.renderer.labels.template;
    label.truncate = false;

    categoryAxis.renderer.minGridDistance = 25;
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = xAxisLabel;
    series.dataFields.categoryY = yAxisLabel;

    var valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = xAxisLabel === "total_speakers" ? '{total_speakers}' : '{total_contributions_text}';
    valueLabel.label.fontSize = 20;
    valueLabel.label.horizontalCenter = "right";
    valueLabel.label.dx = 0;

    var cellSize = 35;
    chart.events.on("datavalidated", function(ev) {
        var chart = ev.target;
        var categoryAxis = chart.yAxes.getIndex(0);
        var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
        var targetHeight = chart.pixelHeight + adjustHeight;
        chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });
}

//lastRefreshedDate
//store api Response in local

var chartReg = {};
function showByHoursChart() {
    if(chartReg["chart"]) {
        chartReg["chart"].dispose();
    }
    const topLanguagesByHoursData = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
    if (topLanguagesByHoursData) {
        constructChart(JSON.parse(topLanguagesByHoursData).data, 'total_contributions', 'language');
    } else {
        performAPIRequest('/top-languages-by-hours').then((response) => {
            localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(response));
            constructChart(response.data, 'total_contributions', 'language');
        });
    }
}

function showBySpeakersChart() {
    if(chartReg["chart"]) {
        chartReg["chart"].dispose();
    }
    const topLanguagesBySpeakers = localStorage.getItem(TOP_LANGUAGES_BY_SPEAKERS);
    if(topLanguagesBySpeakers) {
        constructChart(JSON.parse(topLanguagesBySpeakers).data, 'total_speakers', 'language');
    } else {
        performAPIRequest('/top-languages-by-speakers').then((response) => {
            localStorage.setItem(TOP_LANGUAGES_BY_SPEAKERS, JSON.stringify(response));
            constructChart(response.data, 'total_speakers', 'language');
        });
    }
}

function drawMap(response) {
    const $legendDiv = $("#legendDiv");
    const maxContribution = Math.max.apply(Math, response.data.map(function(ele) { return Number(ele.total_contributions); }))
        const quarterVal = maxContribution / 4;
        response.data.forEach(ele => {
            const {hours:cHours, minutes: cMinutes, seconds: cSeconds} = calculateTime((Number(ele.total_contributions)*60*60), true);
            const {hours:vHours, minutes:vMinutes, seconds: vSeconds} = calculateTime((Number(ele.total_validations)*60*60), true);
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

        polygonSeries.mapPolygons.template.adapter.add("fill", function(fill, target) {
            if (target.dataItem) {
                if (target.dataItem.value >= (quarterVal*3)) {
                    return am4core.color("#86D126");
                } else if (target.dataItem.value >= (quarterVal*2)) {
                    return am4core.color("#EA923F");
                } else if (target.dataItem.value >= quarterVal) {
                    return am4core.color("#FBEA5A");
                } else {
                    return am4core.color("#C6C6C6");
                }
            }
            return fill;
        });
        chart.series.push(polygonSeries);

        const $quarter = $("#quarter .legend-val");
        const $half = $("#half .legend-val");
        const $threeQuarter = $("#threeQuarter .legend-val");
        const $full = $("#full .legend-val");
        const {hours: qHours, minutes: qMinuts} = calculateTime(quarterVal*60*60);
        const {hours: hHours, minutes: hMinuts} = calculateTime(quarterVal*2*60*60);
        const {hours: tQHours, minutes: tQMinuts} = calculateTime(quarterVal*3*60*60);
        $quarter.text(`0 - ${formatTime(qHours, qMinuts)}`);
        $half.text(`${formatTime(qHours, qMinuts)} - ${formatTime(hHours, hMinuts)}`);
        $threeQuarter.text(`${formatTime(hHours, hMinuts)} - ${formatTime(tQHours, tQMinuts)}`);
        $full.text(`> ${formatTime(tQHours, tQMinuts)}`);
        $legendDiv.removeClass('d-none').addClass("d-flex");
}

function generateIndiaMap() {
    const response  = localStorage.getItem(AGGREGATED_DATA_BY_STATE);
    if(response) {
        drawMap(JSON.parse(response));
    } else {
        performAPIRequest('/aggregate-data-count?byState=true')
        .then((response) => {
            localStorage.setItem(AGGREGATED_DATA_BY_STATE, JSON.stringify(response));
            drawMap(response);
        }).catch((err) => {
            console.log(err);
            $legendDiv.show();
        });
    }
}

const setAggregateDataCountByLanguage = function () {
    performAPIRequest(`/aggregate-data-count?byLanguage=true`)
        .then((details) => {
            localStorage.setItem(AGGREGATED_DATA_BY_LANGUAGE, JSON.stringify(details.data));
        })
        .catch((err) => {
            console.log(err);
        });
}

const getDefaultTargettedDiv = function (key, value, $sayListenLanguage) {
    let targetIndex = 0;
    const  $sayListenLanguageItems = $sayListenLanguage.children();
    $sayListenLanguageItems.each(function (index, element) {
        if (element.getAttribute(key) === value) {
            targetIndex = index;
        }
    });

    return $sayListenLanguageItems[targetIndex];
}

const setLangNavBar = (targetedDiv,top_lang, $languageNavBar) => {
    const allDivs = $languageNavBar.children();
    let targetttedDivIndex = -1
    allDivs.each(function (index, element) {
        if (element.getAttribute('value') === top_lang) {
            targetttedDivIndex = index;
        }
    });

    const previousActiveDiv = $languageNavBar.find('.active');
    previousActiveDiv.removeClass('active');
    const $6th_place = document.getElementById('6th_option');
    if (targetttedDivIndex < 0) {
        $6th_place.innerText = top_lang;
        $6th_place.classList.remove('d-none');
        $6th_place.classList.add('active');

        $6th_place.setAttribute('value', top_lang);
    } else {
        allDivs[targetttedDivIndex].classList.add('active');
        $6th_place.classList.remove('active');
        $6th_place.classList.add('d-none');
    }
}

const setLanguagesInHeader = function(response) {
    const $languageNavBar= $('#language-nav-bar');
    const $languageNavBarItems = $languageNavBar.children();
    const $navBarLoader = $('#nav-bar-loader');
   
    response.data.forEach((element,index)=>{
        $languageNavBarItems[index].setAttribute('value',element.language);
        $languageNavBarItems[index].innerText = element.language;
    })
    $navBarLoader.addClass('d-none');
    $languageNavBar.removeClass('d-none');
    setDefaultLang();
}

const setTop5LanInNavBar = function(){
     const topLanguagesByHours = localStorage.getItem(TOP_LANGUAGES_BY_HOURS);
    if(topLanguagesByHours) {
        setLanguagesInHeader(JSON.parse(topLanguagesByHours));
    } else {
        performAPIRequest('/top-languages-by-hours')
        .then((response) => {
            localStorage.setItem(TOP_LANGUAGES_BY_HOURS, JSON.stringify(response));
            setLanguagesInHeader(response);
        });
    }
}

const setDefaultLang = function (){
    const contributionLanguage = localStorage.getItem('contributionLanguage');
    const $sayListenLanguage = $('#say-listen-language');
    const  $languageNavBar = $('#language-nav-bar')

    if(!contributionLanguage){
        const $homePage = document.getElementById('home-page');
        const defaultLangId = $homePage.getAttribute('default-lang');
        const targettedDiv = getDefaultTargettedDiv('id',defaultLangId, $sayListenLanguage);
        const language = targettedDiv.getAttribute("value");
        localStorage.setItem('contributionLanguage', language);
        updateHrsForSayAndListen(language);
        setLangNavBar(targettedDiv, language, $languageNavBar);
        return;
    }
    const targettedDiv = getDefaultTargettedDiv('value',contributionLanguage, $sayListenLanguage);
    updateHrsForSayAndListen(contributionLanguage);
    setLangNavBar(targettedDiv, contributionLanguage, $languageNavBar);
}

const clearLocalStroage = function() {
    localStorage.removeItem(TOP_LANGUAGES_BY_HOURS);
    localStorage.removeItem(TOP_LANGUAGES_BY_SPEAKERS);
    localStorage.removeItem(AGGREGATED_DATA_BY_STATE);
    localStorage.removeItem(AGGREGATED_DATA_BY_LANGUAGE);
}

$(document).ready(function () {
    clearLocalStroage();
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

    setTop5LanInNavBar();
    let top_lang = localStorage.getItem('contributionLanguage');
    const $languageNavBar = $('#language-nav-bar');
    const $sayListenLanguage = $('#say-listen-language');

    $sayListenLanguage.on('click',(e)=>{
        const targetedDiv = e.target;
        const language = targetedDiv.getAttribute("value");
        top_lang = language;
        localStorage.setItem('contributionLanguage',language);
        setLangNavBar(targetedDiv, language, $languageNavBar);
        updateHrsForSayAndListen(language);
    })

    $languageNavBar.on('click', (e) => {
        const targetedDiv = e.target;
        const language = targetedDiv.getAttribute('value');
        top_lang = language;
        localStorage.setItem('contributionLanguage',language);
        const $6th_place = $('#6th_option')
        const previousActiveDiv = $languageNavBar.find('.active') || $6th_place;
        previousActiveDiv.removeClass('active');
        $6th_place.addClass('d-none');
        targetedDiv.classList.add('active');
        updateHrsForSayAndListen(language);
    })

    setAggregateDataCountByLanguage();

    $('#start_recording').on('click', () => {
        if (top_lang === "Hindi" || top_lang === "Odia") {
            sentenceLanguage = top_lang;
        } else {
            sentenceLanguage = "Odia";
        }
    });

    $('[name="topLanguageChart"]').on('change', (event) => {
        if(event.target.value === 'hours') {
            showByHoursChart();
        } else {
            showBySpeakersChart();
        }
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
    const $say_container = $('#say_container');
    const $listen_container = $('#listen_container');
    $say.hover(() => {
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $say.addClass('col-lg-6');
        $listen.addClass('col-lg-4');
        $say.removeClass('col-md-5');
        $listen.removeClass('col-md-5');
        $say.addClass('col-md-6');
        $listen.addClass('col-md-4');
        $say_p_2.removeClass('d-none');
        $say_container.addClass('say-active');
    }, () => {
        $say.removeClass('col-lg-6');
        $listen.removeClass('col-lg-4');
        $say.addClass('col-lg-5');
        $listen.addClass('col-lg-5');
        $say.removeClass('col-md-6');
        $listen.removeClass('col-md-4');
        $say.addClass('col-md-5');
        $listen.addClass('col-md-5');
        $say_p_2.addClass('d-none');
        $say_container.removeClass('say-active');
    })

    $listen.hover(() => {
        $say.removeClass('col-lg-5');
        $listen.removeClass('col-lg-5');
        $listen.addClass('col-lg-6');
        $say.addClass('col-lg-4');
        $listen_p_2.removeClass('d-none');
        $listen_container.addClass('listen-active');
    }, () => {
        $say.removeClass('col-lg-4');
        $listen.removeClass('col-lg-6');
        $say.addClass('col-lg-5');
        $listen.addClass('col-lg-5');
        $listen_p_2.addClass('d-none');
        $listen_container.removeClass('listen-active');
    })

    getStatistics();
    buildGraphs(defaultLang);
    generateIndiaMap();
    showByHoursChart();
});

module.exports = {
    calculateTime,
    getStatistics,
    performAPIRequest,
    updateHrsForSayAndListen,
    getDefaultTargettedDiv
};
