const { onActiveNavbar } = require('./header');
const { redirectToLocalisedPage} = require('./locale');

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
  if (!localStorage.getItem('i18n')){
    localStorage.setItem('i18n','en');
    redirectToLocalisedPage();
  }
  onActiveNavbar('home');
  setHover();
});