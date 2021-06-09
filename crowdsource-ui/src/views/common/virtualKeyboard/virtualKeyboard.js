/**
 * simple-keyboard documentation
 * https://github.com/hodgef/simple-keyboard
 */
const { keyboardLayout } = require('./keyboardLayout');
const { CONTRIBUTION_LANGUAGE, CURRENT_MODULE, LIKHO_TO_LANGUAGE } = require('./constants');
const { isMobileDevice } = require('./common');
let keyboard;
const showKeyboard = function (language, callBack1 = () => { }, callBack2 = () => { }) {
  let Keyboard = window.SimpleKeyboard.default;

  /**
   * Available layouts
   * https://github.com/hodgef/simple-keyboard-layouts/tree/master/src/lib/layouts
   */
  const layout = keyboardLayout[language];

  keyboard = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    syncInstanceInputs: true,
    ...layout
  });

  /**
   * Update simple-keyboard when input is changed directly
   */
  document.querySelector(".edit-area").addEventListener("input", event => {
    keyboard.setInput(event.target.value);
    const currentModule = localStorage.getItem(CURRENT_MODULE);
    const $submitEditButton = isMobileDevice() && currentModule == "suno" ? $("#submit-edit-button_mob") : $("#submit-edit-button");
    const isLanguage = event.target.value ? lngtype(event.target.value) : true;
    const $cancelButton = isMobileDevice() ? $("#cancel-edit-button_mob") : null;
    localStorage.setItem("physicalKeyboard", true);
    $('#keyboardBox').addClass('d-none');

    if (event.target.value.length > 0 && isLanguage) {
      callBack1();
      $submitEditButton.removeAttr('disabled');
      if($cancelButton) {
        $cancelButton.removeAttr('disabled');
      }
    }
    else if(!isLanguage){
      setTimeout(() => {
        $("#wrong-language").removeClass("d-none");
      }, 200);
        $submitEditButton.attr('disabled', true);
        setTimeout(() => {
          $("#wrong-language").addClass("d-none");
        }, 2000);
    }
    else {
      callBack2()
      $submitEditButton.attr('disabled', true);
      if($cancelButton) {
        $cancelButton.attr('disabled', true);
      }
    }
  });

  function onChange(input) {
    document.querySelector(".edit-area").value = input;
    const isLanguage = input ? lngtype(input) : true;
    const currentModule = localStorage.getItem(CURRENT_MODULE);
    const $submitEditButton =  $("#submit-edit-button");
    const $cancelButton = $("#cancel-edit-button");
    localStorage.setItem("physicalKeyboard", false);
    if (input.length > 0 && isLanguage) {
      callBack1();
      if($cancelButton) {
        $cancelButton.removeAttr('disabled');
      }
      $submitEditButton.removeAttr('disabled');
    } else if(!isLanguage){
      setTimeout(() => {
        $("#wrong-language").removeClass("d-none");
      }, 200);
      $submitEditButton.attr('disabled', true);
        setTimeout(() => {
          $("#wrong-language").addClass("d-none");
        }, 2000);
    } 
    else {
      callBack2();
      if($cancelButton) {
        $cancelButton.attr('disabled', true);
      }
      $submitEditButton.attr('disabled', true);
    }
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
    if (capsLockBtn && capsLockBtn.style) {
      capsLockBtn.style.backgroundColor = "greenYellow";
    }
  }
}

function lngtype(text) {
  const newText = text.replace(/\s/g, ''); //read input value, and remove "space" by replace \s
  //Dictionary for Unicode range of the languages
  const currentModule = localStorage.getItem(CURRENT_MODULE);
  let langdic = {
    "Assamese": /^[\u0980-\u09FF\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "Bengali": /^[\u0980-\u09FF\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "English": /^[\u0020-\u007F]+$/,
    "Gujarati": /^[\u0A80-\u0AFF\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "Hindi": /^[\u0900-\u097F\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "Kannada": /^[\u0C80-\u0CFF\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "Malayalam": /^[\u0D00-\u0D7F\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "Odia": /^[\u0B00-\u0B7F\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "Marathi": /^[\u0900-\u097F\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "Punjabi": /^[\u0A00-\u0A7F\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "Tamil": /^[\u0B80-\u0BFF\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
    "Telugu": /^[\u0C00-\u0C7F\u0020-\u0040\u005B-\u0060\u007B-\u007F\u0964-\u0965]+$/,
  }

  // if(currentModule == 'suno' ){
  //    langdic = {
  //     "Assamese": /^[\u0980-\u09FF\u0030-\u0039]+$/,
  //     "Bengali": /^[\u0980-\u09FF\u0030-\u0039]+$/,
  //     "English": /^[\u0020-\u007F]+$/,
  //     "Gujarati": /^[\u0A80-\u0AFF\u0030-\u0039]+$/,
  //     "Hindi": /^[\u0900-\u097F\u0030-\u0039]+$/,
  //     "Kannada": /^[\u0C80-\u0CFF\u0030-\u0039]+$/,
  //     "Malayalam": /^[\u0D00-\u0D7F\u0030-\u0039]+$/,
  //     "Odia": /^[\u0B00-\u0B7F\u0030-\u0039]+$/,
  //     "Marathi": /^[\u0900-\u097F\u0030-\u0039]+$/,
  //     "Punjabi": /^[\u0A00-\u0A7F\u0030-\u0039]+$/,
  //     "Tamil": /^[\u0B80-\u0BFF\u0030-\u0039]+$/,
  //     "Telugu": /^[\u0C00-\u0C7F\u0030-\u0039]+$/,
  //   }
  // }
  let isLanguageSelected = false;

  const contributionLanguage = currentModule === 'likho' ? localStorage.getItem(LIKHO_TO_LANGUAGE):  localStorage.getItem(CONTRIBUTION_LANGUAGE);
  Object.entries(langdic).forEach(([key, value]) => {// loop to read all the dictionary items if not true
    if (value.test(newText) == true) {   //Check Unicode to see which one is true
      if (key.toLowerCase() == contributionLanguage.toLowerCase()) {
        isLanguageSelected = true;
      }
    }
  });
  return isLanguageSelected;
}

const closeKeyboard = function () {
  keyboard.destroy();
}

const setInput = (text) => {
  keyboard.setInput(text);
}


function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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


try {
  $("#keyboardBox").draggable({
    containment: "body"
  });
} catch (e) {
  dragElement(document.getElementById("keyboardBox"));
}



$('#keyboardCloseBtn').on('click', () => {
  $('#keyboardBox').addClass('d-none');
})

module.exports = { showKeyboard, closeKeyboard, setInput,lngtype }

