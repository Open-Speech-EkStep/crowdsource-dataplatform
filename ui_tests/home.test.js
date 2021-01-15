const home = require('../assets/js/home');

describe('updateLanguageInButton', () => {
  test('should update innerText of start record btn for given language', () => {
    document.body.innerHTML = '<div><button id="start-record" /></div>';
    home.updateLanguageInButton('hindi');
    expect(document.getElementById('start-record').innerText).toEqual(
      'START RECORDING IN HINDI'
    );
  });
});

describe('calculateTime', () => {
  test('should calculate time in hours,min and sec for given sentence count', () => {
    expect(home.calculateTime(27)).toEqual({hours: 0, minutes: 2, seconds: 42});
  });
});
