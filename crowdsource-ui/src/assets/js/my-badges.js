const fetch = require('./fetch');
const { CONTRIBUTION_LANGUAGE, LOCALE_STRINGS, SPEAKER_DETAILS_KEY,
  INITIATIVES_NAME,config,BADGES_API_TEXT, CURRENT_MODULE} = require('./constants');
const {
  updateLocaleLanguagesDropdown,
  getLocaleString,
  getLanguageBadge,
  translate
} = require('./utils');
const {onChangeUser, showUserProfile,onOpenUserDropDown} = require('./header');
const {isMobileDevice, hasUserRegistered, showErrorPopup} = require('./common');

const NO_BADGE_EARNED_TEXT = 'No badge earned for <initiative>'; 

const getWidgetWithBadge = (imgPath, badgeType, initiativeType, type, localeString, language) => {
  return `
  <div class="badge-widget cursor-pointer text-center bg-white" id="${badgeType}_${type}_${initiativeType}_${language}_badge">
  <img src=${imgPath} class="my-badge-image" height="74" width="60" rel="popover" data-toggle="popover" >
  <h6 class="mt-2 font-family-Rowdies text-capitalize">${localeString[config[badgeType]]}</h6>
</div>`
}

const getWidgetWithoutBadge = (badgeType, type, localeString,initiativeType, language) => {
  return ` <div class="badge-widget-placeholder m-auto text-center" id="${badgeType}_${type}_${language}_${initiativeType}_placeholder">
                 <p class="text-capitalize">${localeString[config[badgeType]]}</p>
 </div>`
}


const getBadgeRow = (result, id, type, localeString) => {
  let $tableRows = $(`#${id}`);
 
  if (result && result.language && result.language.length > 0) {
    result.language.forEach(item => {
      const row = ` <div class="col-12 p-0 my-2">
              <div class="row m-0">
                <div class="col-lg-2 p-0 p-lg-3 p-md-3 col-12 m-auto">
                  <h4 class="font-family-Rowdies my-4 my-lg-0 my-md-0">${localeString[item.name]}</h4> 
                 </div>
                 ${item.contribute && item.contribute.length ? ` <div class="col-lg-5 col-12 mt-3 mt-lg-0 mt-md-0 p-0 p-lg-3 p-md-3">
                 <div class="row mx-0 mb-2 d-lg-none">
                   <h6 class="font-weight-normal font-family-Rowdies"> ${localeString['Contribution']} </h6>
                   </div>
                 <div class="row m-0">
                   <div class="col-3 pl-0">
                   ${item.contribute[0] && item.contribute[0].grade == BADGES_API_TEXT.badge_1 ? getWidgetWithBadge(getLanguageBadge(item.name, 'badge_1', 'contribute', type), 'badge_1', type, 'contribution', localeString, item.name) : getWidgetWithoutBadge('badge_1', 'contribution', localeString, type, item.name)}
                  
                   </div>
                   <div class="col-3 pl-0">
                     ${item.contribute[1] && item.contribute[1].grade == BADGES_API_TEXT.badge_2 ? getWidgetWithBadge(getLanguageBadge(item.name, 'badge_2', 'contribute', type), 'badge_2', type, 'contribution', localeString, item.name) : getWidgetWithoutBadge('badge_2', 'contribution', localeString,type, item.name)}
                   </div>
                   <div class="col-3 pl-0">
                     ${item.contribute[2] && item.contribute[2].grade == BADGES_API_TEXT.badge_3 ? getWidgetWithBadge(getLanguageBadge(item.name, 'badge_3', 'contribute', type), 'badge_3', type, 'contribution', localeString, item.name) : getWidgetWithoutBadge('badge_3', 'contribution', localeString,type, item.name)}
                   </div>
                   <div class="col-3 pl-0">
                   ${item.contribute[3] && item.contribute[3].grade == BADGES_API_TEXT.badge_4 ? getWidgetWithBadge(getLanguageBadge(item.name, 'badge_4', 'contribute', type), 'badge_4', type, 'contribution', localeString, item.name) : getWidgetWithoutBadge('badge_4', 'contribution', localeString,type, item.name)}
                   </div>
                 </div>
               </div>`: `<div class="col-lg-5 col-12 mt-3 mt-lg-0 mt-md-0 p-0 p-lg-3 p-md-3">
               <div class="row mx-0 mb-2 d-lg-none">
                 <h6 class="font-weight-normal font-family-Rowdies"> ${localeString['Contribution']} </h6>
                 </div>
               <div class="row m-0">
                 <div class="col-3 pl-0">
                 ${getWidgetWithoutBadge('badge_1', 'contribution', localeString, type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                   ${getWidgetWithoutBadge('badge_2', 'contribution', localeString,type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                   ${ getWidgetWithoutBadge('badge_3', 'contribution', localeString,type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                 ${getWidgetWithoutBadge('badge_4', 'contribution', localeString,type, item.name)}
                 </div>
               </div>
             </div>`}
               ${item.validate && item.validate.length ? `  <div class="col-lg-5 col-12 mt-3 mt-lg-0 mt-md-0 p-0 p-lg-3 p-md-3">
               <div class="row mx-0 mb-2 d-lg-none">
               <h6 class="font-weight-normal font-family-Rowdies"> ${localeString['Validation']} </h6>
               </div>
               <div class="row m-0">
                 <div class="col-3 pl-0">
                 ${item.validate[0] && item.validate[0].grade == BADGES_API_TEXT.badge_1 ? getWidgetWithBadge(getLanguageBadge(item.name, 'badge_1', 'validate', type), 'badge_1', type, 'validation', localeString, item.name) : getWidgetWithoutBadge('badge_1', 'validation', localeString,type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                     ${item.validate[1] && item.validate[1].grade == BADGES_API_TEXT.badge_2 ? getWidgetWithBadge(getLanguageBadge(item.name, 'badge_2', 'validate', type), 'badge_2', type, 'validation', localeString, item.name) : getWidgetWithoutBadge('badge_2', 'validation', localeString,type,item.name)}
                   </div>
                   <div class="col-3 pl-0">
                     ${item.validate[2] && item.validate[2].grade == BADGES_API_TEXT.badge_3 ? getWidgetWithBadge(getLanguageBadge(item.name, 'badge_3', 'validate', type), 'badge_3', type, 'validation', localeString, item.name) : getWidgetWithoutBadge('badge_3', 'validation', localeString,type, item.name)}
                   </div>
                   <div class="col-3 pl-0">
                   ${item.validate[3] && item.validate[3].grade == BADGES_API_TEXT.badge_4 ? getWidgetWithBadge(getLanguageBadge(item.name, 'badge_4', 'validate', type),'badge_4', type, 'validation', localeString, item.name) : getWidgetWithoutBadge('badge_4', 'validation', localeString,type, item.name)}
                   </div>
               </div>
             </div>` : `<div class="col-lg-5 col-12 mt-3 mt-lg-0 mt-md-0 p-0 p-lg-3 p-md-3">
             <div class="row mx-0 mb-2 d-lg-none">
             <h6 class="font-weight-normal font-family-Rowdies"> ${localeString['Validation']} </h6>
             </div>
             <div class="row m-0">
               <div class="col-3 pl-0">
               ${getWidgetWithoutBadge('badge_1', 'validation', localeString,type, item.name)}
               </div>
               <div class="col-3 pl-0">
                   ${getWidgetWithoutBadge('badge_2', 'validation', localeString,type,item.name)}
                 </div>
                 <div class="col-3 pl-0">
                   ${getWidgetWithoutBadge('badge_3', 'validation', localeString,type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                 ${getWidgetWithoutBadge('badge_4', 'validation', localeString,type, item.name)}
                 </div>
             </div>
           </div>`}
              </div>
            </div>`;
      $tableRows.append(row);
    });
  } else {
    $(`#${type}-type`).addClass('d-none');
    const translatedError = translate(NO_BADGE_EARNED_TEXT);
    const initiative = translate(INITIATIVES_NAME[type]);
    const finalErrorMessage = translatedError.replace("<initiative>", initiative);
    const row = ` <div class="col-12 p-0">
    <div class="row mx-0 text-center mt-5">
      <h4 class="w-100"> ${finalErrorMessage}</h4>
    </div>
    </div>
    `
    $tableRows.append(row);
  }
  $('.badge-widget').off('click').on('click', ($event) => {
    $('.badge-widget').removeClass('active');
    const badgeId = $($event.currentTarget).attr('id');
    $(`#${badgeId}`).addClass('active');
    var offset = $($event.currentTarget).offset();
    const image = $($event.currentTarget).find("img").attr('src');
    $("#badge-popover").find("img").attr('src', image);
    $('#badge-popover').css({top:offset.top - 180, left:isMobileDevice() ? offset.left+ 60: offset.left - 200, visibility: 'visible'});
  });
  $(document).on('click', (event) => {
    if (!$(event.target).closest(".badge-widget").length) {
      $('.badge-widget').removeClass('active');
      $('#badge-popover').css({visibility: 'hidden'});
  }
  });
}

const groupBy = (data, column) => {
  return data.reduce((r, a) => {
    r[a[column]] = [...r[a[column]] || [], a];
    return r;
  }, {});
}

const bindData = (initiativekey, langaugeArray, mappedData) => {
  let initiativeData = {
    initiativeType: initiativekey,
    language: langaugeArray
  }
  mappedData.push(initiativeData);
}

const getBadgesForUser = (userName) => {
  return new Promise((resolve) => {
    if(userName) {
      $('#badge_username').removeClass('d-none');
      $('#badge_username').text(userName);
    } else  {
      $('#badge_username').addClass('d-none');
    }
    fetch(`/user-rewards/${userName}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    .then(data => {
      if (!data.ok) {
        throw (data.status || 500);
      } else {
        return Promise.resolve(data.json());
      }
    })
    .catch(errStatus => {
      showErrorPopup(errStatus);
      throw errStatus
    })
      .then((result) => {
        let mappedData = [];
        let initiativeKeys = ['text', 'ocr', 'parallel', 'asr'];
        if (result && result.length) {
          $('#asr-type').removeClass('d-none');
          $('#text-type').removeClass('d-none');
          $('#parallel-type').removeClass('d-none');
          $('#ocr-type').removeClass('d-none');
          let groupByInitiative = groupBy(result, 'type');
          initiativeKeys.forEach(initiativeKey => {
            if (groupByInitiative && groupByInitiative[initiativeKey]) {
              let initiativeByData = groupByInitiative[initiativeKey];
              let groupByLanguage = groupBy(initiativeByData, 'language');
              let languageKeys = Object.keys(groupByLanguage);
              let languageArray = [];
              languageKeys.forEach(elem => {
                let result = groupByLanguage[elem];
                const contribution = result.filter(initiativeKey => initiativeKey.category == 'contribute').sort((a, b) => Number(a.milestone) < Number(b.milestone) ? -1 : 1);
                const validate = result.filter(initiativeKey => initiativeKey.category == 'validate').sort((a, b) => Number(a.milestone) < Number(b.milestone) ? -1 : 1);
                let languageObj = {
                  name: elem,
                  contribute: contribution,
                  validate: validate
                }
                languageArray.push(languageObj);
              });
              bindData(initiativeKey, languageArray, mappedData)
            } else {
           
              bindData(initiativeKey, [], mappedData);
            }
          });
        }  else {
          $('#asr-type').addClass('d-none');
          $('#text-type').addClass('d-none');
          $('#parallel-type').addClass('d-none');
          $('#ocr-type').addClass('d-none');
          initiativeKeys.forEach(initiativeKey => {
              bindData(initiativeKey, [], mappedData);
          });
        }
          mappedData.forEach(element => {
            const id = element.initiativeType == 'text' ? 'text-badge' : element.initiativeType == 'ocr' ? 'ocr-badge' : element.initiativeType == 'asr' ? 'asr-badge' : 'parallel-badge';
            const type = element.initiativeType == 'text' ? 'text' : element.initiativeType == 'ocr' ? 'ocr' : element.initiativeType == 'asr' ? 'asr' : 'parallel';
            const localeString =  JSON.parse(localStorage.getItem(LOCALE_STRINGS));
            getBadgeRow(element, id, type, localeString);
          });
          resolve(result);
      });
  })
}

$(document).ready(() => {
  localStorage.setItem(CURRENT_MODULE,"others");
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';

  const $asrTab = $('#asr-tab');
  const $textTab = $('#text-tab');
  const $parallelTab = $('#parallel-tab');
  const $ocrTab = $('#ocr-tab');

  $asrTab.on('click', function () {
    const $tabBar = document.getElementById('my-badge');
    sideScroll($tabBar,'left',25,100,10);
  });

  $textTab.on('click', function () {
    const prev = $('.my-badge-container .nav-tabs li>a.active');
    const $tabBar = document.getElementById('my-badge');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $asrTab[0].id ? 'right' :'left';
    sideScroll($tabBar,direction,25,160,10);
  });

  $parallelTab.on('click', function () {
    const prev = $('.my-badge-container .nav-tabs li>a.active');
    const $tabBar = document.getElementById('my-badge');
    const prevActiveTab = prev[0].id;
    const direction = prevActiveTab == $ocrTab[0].id ? 'left' :'right';
    sideScroll($tabBar,direction,25,160,10);
  });

  $ocrTab.on('click', function () {
    const $tabBar = document.getElementById('my-badge');
    sideScroll($tabBar,'right',25,100,10);
  });

  function sideScroll(element,direction,speed,distance,step){
    let scrollAmount = 0;
    const slideTimer = setInterval(function(){
      if(direction == 'left'){
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if(scrollAmount >= distance){
        window.clearInterval(slideTimer);
      }
    }, speed);
  }
  updateLocaleLanguagesDropdown(language);
  const details = JSON.parse(localStorage.getItem("speakerDetails"));
  const username = details && details.userName ? details.userName: '';
  getLocaleString().then(() => {
    getBadgesForUser(username);
  }).catch(err => {
    console.log(err);
  });
  const moduleType = localStorage.getItem(CURRENT_MODULE);
  if(hasUserRegistered()){
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  } else {
    showUserProfile('');
  }
  onChangeUser('./my-badges.html', moduleType);
  onOpenUserDropDown();
});

module.exports = {getBadgesForUser, getBadgeRow};