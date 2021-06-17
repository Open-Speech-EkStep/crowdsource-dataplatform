const {performAPIRequest} = require('./utils')

const boloType = {name:"bolo", type:"text", goal_value:0, total_languages:0, goal_label:"hours"}
const sunoType = {name:"suno", type:"asr", goal_value:0, total_languages:0, goal_label:"hours"}
const likhoType = {name:"likho", type:"parallel", goal_value:0, total_languages:0, goal_label:"translations"}
const dekhoType = {name:"dekho", type:"ocr", goal_value:0, total_languages:0, goal_label:"images"}

const moduleList = [sunoType, boloType, likhoType, dekhoType];


function setLanguageGoalForModules() {
  const language = "English";
  const source = "contribute";

  moduleList.forEach(  (module) =>{
      performAPIRequest(`/language-goal/${module.type}/${language}/${source}`).then(res=>{
        module.goal_value = res.goal;
        $('#language-goal-each').html(moduleList[0].goal_value + " " +moduleList[0].goal_label);
      });

      performAPIRequest(`/available-languages/${module.type}`).then(res=>{
        module.total_languages = res.datasetLanguages.length;
        $('#language-count').html(moduleList[0].total_languages);
      });
    })
}

$(document).ready(function(ev){
  setLanguageGoalForModules();

  $('#carouselExampleIndicators').on('slide.bs.carousel', function (evt) {
    const index = +$(evt.relatedTarget).index();
    $('#carouselExampleIndicators .nav-tabs li.active').removeClass('active');
    $('#carouselExampleIndicators .nav-tabs li:eq('+$(evt.relatedTarget).index()+')').addClass('active');
    $('#language-count').html(moduleList[index].total_languages);
    $('#language-goal-each').html(moduleList[index].goal_value + " " +moduleList[index].goal_label);
  })
});

module.exports = {setLanguageGoalForModules}
