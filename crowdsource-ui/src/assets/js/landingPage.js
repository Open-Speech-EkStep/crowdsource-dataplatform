const { onActiveNavbar } = require('./header');

// const setSayListenBackground = function (){
//   const $card1 = $(".card1");
//   const $card2 = $(".card2");
//   const $card3 = $(".card3");
//   const $card4 = $(".card4");
//   const $card1Width = $card1.outerWidth( true);
//   const $card2Width = $card2.outerWidth(true);
//   const $card3Width = $card3.outerWidth(true);
//   const $card4Width = $card4.outerWidth(true);
//   const totalWidth = $card1Width + $card2Width+$card3Width + $card4Width;
//   $card1.css("background-size",`${totalWidth}px auto`);
//   $card2.css("background-size",`${totalWidth}px auto`);
//   $card3.css("background-size",`${totalWidth}px auto`);
//   $card4.css("background-size",`${totalWidth}px auto`);
// }

const setHover = function (){
  const $card1 = $(".card1");
  const $card2 = $(".card2");
  const $card3 = $(".card3");
  const $card4 = $(".card4");
  $card1.hover(() => {
    $card1.css("box-shadow","0px 0px 32px rgba(166, 192, 251, 0.8)")
  }, () => {
    $card1.css("box-shadow","0px 0px 32px rgb(0 0 0 / 10%)")
  });

  $card2.hover(() => {
    $card2.css("box-shadow","0px 0px 32px rgba(166, 192, 251, 0.8)")
  }, () => {
    $card2.css("box-shadow","0px 0px 32px rgb(0 0 0 / 10%)")
  });

  $card3.hover(() => {
    $card3.css("box-shadow","0px 0px 32px rgba(166, 192, 251, 0.8)")
  }, () => {
    $card3.css("box-shadow","0px 0px 32px rgb(0 0 0 / 10%)")
  });

  $card4.hover(() => {
    $card4.css("box-shadow","0px 0px 32px rgba(166, 192, 251, 0.8)")
  }, () => {
    $card4.css("box-shadow","0px 0px 32px rgb(0 0 0 / 10%)")
  });

}

$(document).ready(function () {
  localStorage.setItem('module','home');
  onActiveNavbar('home');
  setHover();
});