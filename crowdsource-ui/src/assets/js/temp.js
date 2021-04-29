/**
 * simple-keyboard documentation
 * https://github.com/hodgef/simple-keyboard
 */

let Keyboard = window.SimpleKeyboard.default;

/**
 * Available layouts
 * https://github.com/hodgef/simple-keyboard-layouts/tree/master/src/lib/layouts
 */
let layout = require('../keyBoardLayout/hindi.json');

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  physicalKeyboardHighlight : true,
  physicalKeyboardHighlightPress: true,
  syncInstanceInputs: true,
  ...layout
});

/**
 * Update simple-keyboard when input is changed directly
 */
document.querySelector(".input").addEventListener("input", event => {
  keyboard.setInput(event.target.value);
});

console.log(keyboard);

function onChange(input) {
  document.querySelector(".input").value = input;
  // keyboard.setOptions({
  //
  // });
  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);

  /**
   * If you want to handle the shift and caps lock buttons
   */
  if (button === "{shift}" || button === "{lock}") handleShift();
}

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle,
  });
  toggleCapsLock();
}

const toggleCapsLock = function (){
  const capsLockBtn = $(".hg-layout-shift .hg-row .hg-button-lock")[0];
  if(capsLockBtn){
    capsLockBtn.style.backgroundColor = "greenYellow";
  }
}

