const { context_root } = require('./env-api');

const hideBackdrop = function (backdrop){
  if(!backdrop){
    return;
  }
  backdrop.remove();
  const newBackdrop = document.getElementsByClassName('modal-backdrop')
  hideBackdrop(newBackdrop[0]);
}

const addListenerToExtensionBarElements = ()=>{
  $("#extension-bar-close-btn").on('click',()=>{
    $("#extension-bar").addClass('d-none');

  })

  $("#extension_video_button").on('click',()=>{
    $("#extension-bar-close-btn").removeClass('d-none');
  })

  $("#extension_video_close_btn").on('click', () => {
    const extension_modal = $('#extension_video_modal');
    const extension_video = document.getElementById('extension_video');
    extension_modal.modal('hide');
    const backdrop = document.getElementsByClassName('modal-backdrop')
    try{
      hideBackdrop(backdrop[0])
    } catch (e) {
      console.log(e)
    }
    extension_video.pause();
  })
}

// const setExtensionVideoFlag = function (){
//   const extension_video = document.getElementById('extension_video');
//   extension_video.on('ended',()=>{
//     localStorage.setItem('extension_video',true);
//   })
// }
//
// setExtensionVideoFlag();

$(document).ready(function () {
  addBaseUrlToVideoSrc();
  addListenerToExtensionBarElements();
});

const addBaseUrlToVideoSrc = () => {
  const videoElement = $('#extension_video');
  const src = videoElement.find('source').attr('src');
  videoElement.find('source').attr('src', `${context_root}${src}`);
  videoElement[0].load();
}

module.exports = {addListenerToExtensionBarElements}




