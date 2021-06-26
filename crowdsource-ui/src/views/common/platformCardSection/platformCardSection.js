const { performAPIRequest } = require('./utils')

const boloType = { name: "bolo", type: "text", goal_value: 0, total_languages: 0, goal_label: "hours" }
const sunoType = { name: "suno", type: "asr", goal_value: 0, total_languages: 0, goal_label: "hours" }
const likhoType = { name: "likho", type: "parallel", goal_value: 0, total_languages: 0, goal_label: "translations" }
const dekhoType = { name: "dekho", type: "ocr", goal_value: 0, total_languages: 0, goal_label: "images" }

const moduleList = [sunoType, boloType, likhoType, dekhoType];

function getLanguageGoalForModules() {
  const language = "English";
  const source = "contribute";

  return Promise.all(moduleList.map((module) => {
    return Promise.all([performAPIRequest(`/language-goal/${module.type}/${language}/${source}`),
    performAPIRequest(`/available-languages/${module.type}`)
    ]).then((responses) => {
      return Promise.resolve(responses)
    })
  })).catch(() => {
    $('#language-goal-each').html(moduleList[0].goal_value + " " + moduleList[0].goal_label);
    $('#language-count').html(moduleList[0].total_languages);
  })
}

$(document).ready(function (ev) {
  // getLanguageGoalForModules().then((res)=>{
  //   moduleList.map((module, index) =>{
  //     module.goal_value = res[index][0].goal;
  //     module.total_languages = res[index][1].datasetLanguages.length;
  //   })
  //   $('#language-goal-each').html(moduleList[0].goal_value + " " + moduleList[0].goal_label);
  //   $('#language-count').html(moduleList[0].total_languages);
  // });


  const $sunoTab = $('#sunoTab');
  const $boloTab = $('#boloTab');
  const $likhoTab = $('#likhoTab');
  const $dekhoTab = $('#dekhoTab');

  $sunoTab.on('click', function () {
    const $tabBar = document.getElementById('tabBar');
    sideScroll($tabBar,'left',25,100,10);
  });

  $boloTab.on('click', function () {
    const prev = $('#carouselExampleIndicators .nav-tabs li.active');
    const $tabBar = document.getElementById('tabBar');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $sunoTab[0].id ? 'right' :'left';
    sideScroll($tabBar,direction,25,120,10);
  });

  $likhoTab.on('click', function () {
    const prev = $('#carouselExampleIndicators .nav-tabs li.active');
    const $tabBar = document.getElementById('tabBar');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $dekhoTab[0].id ? 'left' :'right';
    sideScroll($tabBar,direction,25,120,10);
  });

  $dekhoTab.on('click', function () {
    const $tabBar = document.getElementById('tabBar');
    sideScroll($tabBar,'right',25,100,10);
  });

  function sideScroll(element,direction,speed,distance,step){
    let scrollAmount = 0;
    const slideTimer = setInterval(function(){
      if(direction == 'left'){
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if(scrollAmount >= distance){
        window.clearInterval(slideTimer);
      }
    }, speed);
  }


  $('#carouselExampleIndicators').on('slide.bs.carousel', function (evt) {
    const index = +$(evt.relatedTarget).index();
    $('#carouselExampleIndicators .carousel-item .active').fadeOut(500);
    $('#carouselExampleIndicators .nav-tabs li.active').removeClass('active');
    $('#carouselExampleIndicators .nav-tabs li:eq('+$(evt.relatedTarget).index()+')').addClass('active');
    $('#language-count').html(moduleList[index].total_languages);
    $('#language-goal-each').html(moduleList[index].goal_value + " " + moduleList[index].goal_label);
  })
});

module.exports = { getLanguageGoalForModules }
