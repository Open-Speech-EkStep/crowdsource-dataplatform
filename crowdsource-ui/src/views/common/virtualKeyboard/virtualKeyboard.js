/**
 * simple-keyboard documentation
 * https://github.com/hodgef/simple-keyboard
 */
const {keyboardLayout} = require('./keyboardLayout');
console.log(keyboardLayout)
let keyboard;
const showKeyboard = function (language) {
  let Keyboard = window.SimpleKeyboard.default;

  /**
   * Available layouts
   * https://github.com/hodgef/simple-keyboard-layouts/tree/master/src/lib/layouts
   */
  const layout = keyboardLayout[language];

  keyboard = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    physicalKeyboardHighlight: true,
    physicalKeyboardHighlightPress: true,
    syncInstanceInputs: true,
    ...layout
  });

  /**
   * Update simple-keyboard when input is changed directly
   */
  document.querySelector(".edit-area").addEventListener("input", event => {
    keyboard.setInput(event.target.value);
    const $submitEditButton = $("#submit-edit-button");
    const $cancelEditButton = $("#cancel-edit-button");

    if(event.target.value.length > 0) {
      $cancelEditButton.removeAttr('disabled');
      $submitEditButton.removeAttr('disabled');
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#007BFF');
    }else {
      $submitEditButton.attr('disabled',true);
      $cancelEditButton.attr('disabled',true);
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#D7D7D7');
    }
  });

  function onChange(input) {
    document.querySelector(".edit-area").value = input;
    const $submitEditButton = $("#submit-edit-button");
    const $cancelEditButton = $("#cancel-edit-button");
    if(input.length > 0) {
      $submitEditButton.removeAttr('disabled');
      $cancelEditButton.removeAttr('disabled');
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#007BFF');
    } else {
      $submitEditButton.attr('disabled',true);
      $cancelEditButton.attr('disabled',true);
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#D7D7D7');
    }
    // keyboard.setOptions({
    //
    // });
  }

  function onKeyPress(button) {
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") handleShift();
  }

  function handleShift() {
    const currentLayout = keyboard.options.layoutName;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";

    keyboard.setOptions({
      layoutName: shiftToggle,
    });
    toggleCapsLock();
  }

  const toggleCapsLock = function () {
    const capsLockBtn = $(".hg-layout-shift .hg-row .hg-button-lock")[0];
    if (capsLockBtn) {
      capsLockBtn.style.backgroundColor = "greenYellow";
    }
  }
}


const closeKeyboard = function (){
  keyboard.destroy();
}

const setInput = (text) => {
  keyboard.setInput(text);
}


module.exports = {showKeyboard, closeKeyboard, setInput}

