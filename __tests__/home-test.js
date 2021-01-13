const {updateLanguageInButton} = require('../assets/js/home');

it('should update innerText of start record btn with given language', () => {
  document.body.innerHTML = '<div><button id="start-record" /></div>';
  updateLanguageInButton('hindi');
  expect(document.getElementById('start-record').innerText).toEqual(
    'START RECORDING IN HINDI'
  );
});
