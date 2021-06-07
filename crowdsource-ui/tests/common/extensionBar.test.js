const {readFileSync} = require('fs');
const {stringToHTML} = require('../utils');
const {addListenerToExtensionBarElements} = require('../../build/js/common/extensionBar');

document.body = stringToHTML(
  readFileSync(`${__dirname}/../../build/views/common/extensionBar.ejs`, 'UTF-8')
);

describe('addListenerToExtensionBarElements', () => {
  addListenerToExtensionBarElements();

  describe("extension-bar-close-btn on click listener", () => {
    test("should close extension bar when user clicks on extension-bar-close-btn", () => {
      const closeBtn = $("#extension-bar-close-btn");
      const bar = $("#extension-bar");
      closeBtn.click();
      expect(bar.hasClass('d-none')).toEqual(true)
    })
  })

  describe("extension_video_button on click listener", () => {
    test("should show close button on extension bar when user clicks on extension video button", () => {
      const watchVideoBtn = $("#extension_video_button");
      const barCloseBtn = $("#extension-bar-close-btn");
      watchVideoBtn.click();
      expect(barCloseBtn.hasClass('d-none')).toEqual(false)
    })
  })

  // describe("extension_video_close_btn on click listener", () => {
  //   test("should close extension video modal when user clicks on extension video close btn", () => {
  //     const videoCloseBtn = $("#extension_video_close_btn");
  //     const extension_modal = $("#extension_video_modal");
  //     videoCloseBtn.click();
  //     expect(extension_modal.hasClass('show')).toEqual(true)
  //   })
  // })
})


