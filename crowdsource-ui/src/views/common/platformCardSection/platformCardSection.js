
$(document).ready(function (ev) {
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
    $('#carouselExampleIndicators .carousel-item .active').fadeOut(500);
    $('#carouselExampleIndicators .nav-tabs li.active').removeClass('active');
    $('#carouselExampleIndicators .nav-tabs li:eq('+$(evt.relatedTarget).index()+')').addClass('active');
  })
});
