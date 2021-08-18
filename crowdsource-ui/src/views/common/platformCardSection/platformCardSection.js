
$(document).ready(function () {
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
    sideScroll($tabBar,direction,25,10,10);
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
    const prev = $('#carouselExampleIndicators .nav-tabs li.active');
    const $tabBar = document.getElementById('tabBar');
    const prevActiveTab = prev[0].id;
    if(evt.direction === 'right') {
       if(prevActiveTab === "likhoTab") {
        sideScroll($tabBar,'left',25,120,10);
       } 
       if(prevActiveTab === "boloTab") {
        sideScroll($tabBar,'left',25,100,10);
       }
       if(prevActiveTab === "sunoTab") {
        sideScroll($tabBar,'right',25,210,10);
      }
    } else {
      if(prevActiveTab === "likhoTab") {
        sideScroll($tabBar,'right',25,100,10);
      }
      if(prevActiveTab === "sunoTab") {
        sideScroll($tabBar,'right',25,120,10);
      }
      if(prevActiveTab === "dekhoTab") {
        sideScroll($tabBar,'left',25,210,10);
      }
    }
    $('#carouselExampleIndicators .carousel-item .active').fadeOut(500);
    $('#carouselExampleIndicators .nav-tabs li.active').removeClass('active');
    $('#carouselExampleIndicators .nav-tabs li:eq('+$(evt.relatedTarget).index()+')').addClass('active');
  })
});
