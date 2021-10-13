
$(document).ready(function () {
  const $asrTab = $('#asrTab');
  const $textTab = $('#textTab');
  const $parallelTab = $('#parallelTab');
  const $ocrTab = $('#ocrTab');

  $asrTab.on('click', function () {
    const $tabBar = document.getElementById('tabBar');
    sideScroll($tabBar,'left',25,100,10);
  });

  $textTab.on('click', function () {
    const prev = $('#carouselExampleIndicators .nav-tabs li.active');
    const $tabBar = document.getElementById('tabBar');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $asrTab[0].id ? 'right' :'left';
    sideScroll($tabBar,direction,25,10,10);
  });

  $parallelTab.on('click', function () {
    const prev = $('#carouselExampleIndicators .nav-tabs li.active');
    const $tabBar = document.getElementById('tabBar');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $ocrTab[0].id ? 'left' :'right';
    sideScroll($tabBar,direction,25,120,10);
  });

  $ocrTab.on('click', function () {
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
       if(prevActiveTab === "parallelTab") {
        sideScroll($tabBar,'left',25,120,10);
       } 
       if(prevActiveTab === "textTab") {
        sideScroll($tabBar,'left',25,100,10);
       }
       if(prevActiveTab === "asrTab") {
        sideScroll($tabBar,'right',25,210,10);
      }
    } else {
      if(prevActiveTab === "parallelTab") {
        sideScroll($tabBar,'right',25,100,10);
      }
      if(prevActiveTab === "asrTab") {
        sideScroll($tabBar,'right',25,120,10);
      }
      if(prevActiveTab === "ocrTab") {
        sideScroll($tabBar,'left',25,210,10);
      }
    }
    $('#carouselExampleIndicators .carousel-item .active').fadeOut(500);
    $('#carouselExampleIndicators .nav-tabs li.active').removeClass('active');
    $('#carouselExampleIndicators .nav-tabs li:eq('+$(evt.relatedTarget).index()+')').addClass('active');
  })
});
