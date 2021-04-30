/**
 * simple-keyboard documentation
 * https://github.com/hodgef/simple-keyboard
 */

const hindi = {
  "layout": {
    "default": [
      "₹ { } - ॄ ॣ ग़ ज़ ड़ = \\ ॢ क़ ; ' < ॰ ॥ /",
      " १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}",
      "{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ",
      "{lock} ो े ् ि ु प र क त च ट {enter}",
      "{shift}  ं म न व ल स , . य {shift}",
      ".com @ {space}"
    ],
    "shift": [
      "! # $ % ^ & * [ ] _ ॠ ॡ ॹ ढ़ + | फ़ ख़ : \" ॐ > ऽ ?",
      "~ ऍ ॅ ्र ४ ज्ञ त्र क्ष श्र ( ) ः ऋ {bksp}",
      "{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ",
      "{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}",
      "{shift}  ँ ण    श ष । ? {shift}",
      ".com @ {space}"
    ]
  }
}

let keyboard;
const showKeyboard = function (language) {
  let Keyboard = window.SimpleKeyboard.default;

  /**
   * Available layouts
   * https://github.com/hodgef/simple-keyboard-layouts/tree/master/src/lib/layouts
   */
  const layout = hindi;

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

    if(event.target.value.length > 0) {
      $submitEditButton.removeAttr('disabled');
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#007BFF');
    }else {
      $submitEditButton.attr('disabled',true);
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#D7D7D7');
    }
  });

  function onChange(input) {
    document.querySelector(".edit-area").value = input;
    const $submitEditButton = $("#submit-edit-button");
    if(input.length > 0) {
      $submitEditButton.removeAttr('disabled');
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#007BFF');
    } else {
      $submitEditButton.attr('disabled',true);
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

