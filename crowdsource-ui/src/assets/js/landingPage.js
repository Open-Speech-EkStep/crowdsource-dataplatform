const { onActiveNavbar } = require('./header');

$(document).ready(function () {
  localStorage.setItem('module','home');
  onActiveNavbar('home');
});