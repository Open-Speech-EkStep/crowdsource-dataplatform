function onActiveTab(value) {
  const $header = $('#module_name');
  const allDivs = $header.children();
  let targetedDivIndex = -1;
  allDivs.each(function (index, element) {
    if (element.getAttribute('value') === value) {
      targetedDivIndex = index;
    }
  });
  const previousActiveDiv = $header.find('.active');
  previousActiveDiv && previousActiveDiv.removeClass('active');
  allDivs[targetedDivIndex].classList.add('active');
}

$(document).ready(function(ev){
  const language_goals= [{ total_languages : 12, goal : 100},{ total_languages : 12, goal : 100},{ total_languages : 12, goal : 10000},{ total_languages : 12, goal : 10000}]
  const language_text= ["hours","hours","translations","images"]
  $('#language-count').html(language_goals[0].total_languages);
  $('#language-goal-each').html(language_goals[0].goal + " " +language_text[0]);

  $('#carouselExampleIndicators').on('slide.bs.carousel', function (evt) {
    const index = +$(evt.relatedTarget).index();
    $('#carouselExampleIndicators .nav-tabs li a.active').removeClass('active');
    $('#carouselExampleIndicators .nav-tabs li a:eq('+$(evt.relatedTarget).index()+')').addClass('active');
    $('#language-count').html(language_goals[index].total_languages);
    $('#language-goal-each').html(language_goals[index].goal + " " +language_text[index]);
  })
});