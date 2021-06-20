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
  getLanguageGoalForModules().then((res)=>{
    moduleList.map((module, index) =>{
      module.goal_value = res[index][0].goal;
      module.total_languages = res[index][1].datasetLanguages.length;
    })
    $('#language-goal-each').html(moduleList[0].goal_value + " " + moduleList[0].goal_label);
    $('#language-count').html(moduleList[0].total_languages);
  });

  $('#carouselExampleIndicators').on('slide.bs.carousel', function (evt) {
    const index = +$(evt.relatedTarget).index();
    $('#carouselExampleIndicators .nav-tabs li.active').removeClass('active');
    $('#carouselExampleIndicators .nav-tabs li:eq('+$(evt.relatedTarget).index()+')').addClass('active');
    $('#language-count').html(moduleList[index].total_languages);
    $('#language-goal-each').html(moduleList[index].goal_value + " " + moduleList[index].goal_label);
  })
});

module.exports = { getLanguageGoalForModules }
