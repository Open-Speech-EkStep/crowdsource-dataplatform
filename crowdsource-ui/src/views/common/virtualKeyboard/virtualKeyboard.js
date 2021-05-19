/**
 * simple-keyboard documentation
 * https://github.com/hodgef/simple-keyboard
 */
const { keyboardLayout } = require('./keyboardLayout');
const { CONTRIBUTION_LANGUAGE } = require('./constants');
let keyboard;
const showKeyboard = function (language, callBack1=()=>{} , callBack2=()=>{}) {
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
    // if(event.target.value) {
    //   const isLanguage = lngtype(event.target.value);
    // if (isLanguage) {
      keyboard.setInput(event.target.value);
      const $submitEditButton = $("#submit-edit-button");
      const $cancelEditButton = $("#cancel-edit-button");
      localStorage.setItem("physicalKeyboard", true);
      $('#keyboardBox').addClass('d-none');

      if (event.target.value.length > 0) {
        $cancelEditButton.removeAttr('disabled');
        $submitEditButton.removeAttr('disabled');
        const children = $submitEditButton.children().children();
        children[0].setAttribute("fill", '#007BFF');
      } else {
        $submitEditButton.attr('disabled', true);
        $cancelEditButton.attr('disabled', true);
        const children = $submitEditButton.children().children();
        children[0].setAttribute("fill", '#D7D7D7');
      }
    // } else {
    //   $("#wrong-language").removeClass("d-none");
    //   setTimeout(() => {
    //     $("#wrong-language").addClass("d-none");
    //   },2000)
    // }
  // }
    keyboard.setInput(event.target.value);
    // const $submitEditButton = $("#submit-edit-button");
    localStorage.setItem("physicalKeyboard",true);
    $('#keyboardBox').addClass('d-none');

    if(event.target.value.length > 0) {
      callBack1();
      $submitEditButton.removeAttr('disabled');
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#007BFF');
    }else {
      callBack2()
      $submitEditButton.attr('disabled',true);
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#D7D7D7');
    }
  });

  function onChange(input) {
    document.querySelector(".edit-area").value = input;
    const $submitEditButton = $("#submit-edit-button");
    localStorage.setItem("physicalKeyboard",false);
    if(input.length > 0) {
      callBack1();
      $submitEditButton.removeAttr('disabled');
      const children = $submitEditButton.children().children();
      children[0].setAttribute("fill", '#007BFF');
    } else {
      callBack2();
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

  function lngtype(text) {
    var text = text.replace(/\s/g); //read input value, and remove "space" by replace \s 
    //Dictionary for Unicode range of the languages
    var langdic = {
      "arabic": /[\u0600-\u06FF]/,
      "persian": /[\u0750-\u077F]/,
      "Hebrew": /[\u0590-\u05FF]/,
      "Syriac": /[\u0700-\u074F]/,
      "Bengali": /[\u0980-\u09FF]/,
      "Ethiopic": /[\u1200-\u137F]/,
      "Greek and Coptic": /[\u0370-\u03FF]/,
      "Georgian": /[\u10A0-\u10FF]/,
      "Thai": /[\u0E00-\u0E7F]/,
      "English": /^[a-zA-Z]+$/
      //add other languages her
    }
    //const keys = Object.keys(langdic); //read  keys
    //const keys = Object.values(langdic); //read  values
    const keys = Object.entries(langdic); // read  keys and values from the dictionary
    let isLanguageSelected = false;
    Object.entries(langdic).forEach(([key, value]) => {// loop to read all the dictionary items if not true
      if (value.test(text) == true) {   //Check Unicode to see which one is true
        // return document.getElementById("lang_her").innerHTML = key; //print language name if unicode true  
        if (key == localStorage.getItem(CONTRIBUTION_LANGUAGE)) {
          isLanguageSelected = true;
        } 
      }
    });
    return isLanguageSelected;
  }

  const toggleCapsLock = function () {
    const capsLockBtn = $(".hg-layout-shift .hg-row .hg-button-lock")[0];
    if (capsLockBtn) {
      capsLockBtn.style.backgroundColor = "greenYellow";
    }
  }
}


const closeKeyboard = function () {
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

module.exports = { showKeyboard, closeKeyboard, setInput }

