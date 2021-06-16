$(document).ready(function(ev){
  $('#carouselExampleIndicatorsl').on('slide.bs.carousel', function (evt) {
    $('#carouselExampleIndicators .carousel-indicators li.active').removeClass('active');
    $('#carouselExampleIndicators .carousel-indicators li:eq('+$(evt.relatedTarget).index()+')').addClass('active');
  })
});