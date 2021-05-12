/**
 * simple-keyboard documentation
 * https://github.com/hodgef/simple-keyboard
 */
const {keyboardLayout} = require('./keyboardLayout');
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


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

dragElement(document.getElementById("keyboardBox"));

$('#keyboardCloseBtn').on('click', () => {
  $('#keyboardBox').addClass('d-none');
})

module.exports = {showKeyboard, closeKeyboard, setInput}

