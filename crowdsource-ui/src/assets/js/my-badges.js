const fetch = require('./fetch');
const { CONTRIBUTION_LANGUAGE, LOCALE_STRINGS, SPEAKER_DETAILS_KEY} = require('./constants');
const {
  updateLocaleLanguagesDropdown,
  getLocaleString
} = require('./utils');
const {onChangeUser, showUserProfile,onOpenUserDropDown} = require('./header');
const {isMobileDevice, hasUserRegistered} = require('./common');

const getWidgetWithBadge = (imgPath, badgeType, initiativeType, type, localeString, language) => {
  return `
  <div class="badge-widget cursor-pointer text-center" id="${badgeType}_${type}_${initiativeType}_${language}_badge">
  <img src=${imgPath} class="my-badge-image" height="74" width="60" rel="popover" data-toggle="popover" >
  <h6 class="mt-2 font-family-Rowdies text-capitalize">${localeString[badgeType]}</h6>
</div>`
}

const getWidgetWithoutBadge = (badgeType, type, localeString,initiativeType, language) => {
  return ` <div class="badge-widget-placeholder m-auto text-center" id="${badgeType}_${type}_${language}_${initiativeType}_placeholder">
                 <p class="text-capitalize">${localeString[badgeType]}</p>
 </div>`
}

const getBadgeRow = (result, id, type, localeString) => {
  let $tableRows = $(`#${id}`);
 
  if (result && result.language && result.language.length > 0) {
    result.language.forEach(item => {
      const row = ` <div class="col-12 p-0 my-2">
              <div class="row m-0">
                <div class="col-lg-2 col-md-3 p-0 p-lg-3 p-md-3 col-12 m-auto">
                  <h4 class="font-family-Rowdies my-4 my-lg-0 my-md-0">${localeString[item.name]}</h4> 
                 </div>
                 ${item.contribute && item.contribute.length ? ` <div class="col-lg-5 col-md-5 col-12 mt-3 mt-lg-0 mt-md-0 p-0 p-lg-3 p-md-3">
                 <div class="row mx-0 mb-2 d-lg-none">
                   <h6 class="text-custom-muted font-weight-normal font-family-Rowdies"> ${localeString['Contribution']} </h6>
                   </div>
                 <div class="row m-0">
                   <div class="col-3 pl-0">
                   ${item.contribute[0] && item.contribute[0].grade == 'Bronze' ? getWidgetWithBadge(`/img/${type}_bronze_medal.svg`, 'bronze', type, 'contribution', localeString, item.name) : getWidgetWithoutBadge('bronze', 'contribution', localeString, type, item.name)}
                  
                   </div>
                   <div class="col-3 pl-0">
                     ${item.contribute[1] && item.contribute[1].grade == 'Silver' ? getWidgetWithBadge(`/img/${type}_silver_medal.svg`, 'silver', type, 'contribution', localeString, item.name) : getWidgetWithoutBadge('silver', 'contribution', localeString,type, item.name)}
                   </div>
                   <div class="col-3 pl-0">
                     ${item.contribute[2] && item.contribute[2].grade == 'Gold' ? getWidgetWithBadge(`/img/${type}_gold_medal.svg`, 'gold', type, 'contribution', localeString, item.name) : getWidgetWithoutBadge('gold', 'contribution', localeString,type, item.name)}
                   </div>
                   <div class="col-3 pl-0">
                   ${item.contribute[3] && item.contribute[3].grade == 'Platinum' ? getWidgetWithBadge(`/img/${type}_platinum_medal.svg`, 'platinum', type, 'contribution', localeString, item.name) : getWidgetWithoutBadge('platinum', 'contribution', localeString,type, item.name)}
                   </div>
                 </div>
               </div>`: `<div class="col-lg-5 col-md-5 col-12 mt-3 mt-lg-0 mt-md-0 p-0 p-lg-3 p-md-3">
               <div class="row mx-0 mb-2 d-lg-none">
                 <h6 class="text-custom-muted font-weight-normal font-family-Rowdies"> Contribution </h6>
                 </div>
               <div class="row m-0">
                 <div class="col-3 pl-0">
                 ${getWidgetWithoutBadge('bronze', 'contribution', localeString, type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                   ${getWidgetWithoutBadge('silver', 'contribution', localeString,type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                   ${ getWidgetWithoutBadge('gold', 'contribution', localeString,type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                 ${getWidgetWithoutBadge('platinum', 'contribution', localeString,type, item.name)}
                 </div>
               </div>
             </div>`}
               ${item.validate && item.validate.length ? `  <div class="col-lg-5 col-md-5 col-12 mt-3 mt-lg-0 mt-md-0 p-0 p-lg-3 p-md-3">
               <div class="row mx-0 mb-2 d-lg-none">
               <h6 class="text-custom-muted font-weight-normal font-family-Rowdies"> ${localeString['Validation']} </h6>
               </div>
               <div class="row m-0">
                 <div class="col-3 pl-0">
                 ${item.validate[0] && item.validate[0].grade == 'Bronze' ? getWidgetWithBadge(`/img/${type}_bronze_medal_val.svg`, 'bronze', type, 'validation', localeString, item.name) : getWidgetWithoutBadge('bronze', 'validation', localeString,type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                     ${item.validate[1] && item.validate[1].grade == 'Silver' ? getWidgetWithBadge(`/img/${type}_silver_medal_val.svg`, 'silver', type, 'validation', localeString, item.name) : getWidgetWithoutBadge('silver', 'validation', localeString,type,item.name)}
                   </div>
                   <div class="col-3 pl-0">
                     ${item.validate[2] && item.validate[2].grade == 'Gold' ? getWidgetWithBadge(`/img/${type}_gold_medal_val.svg`, 'gold', type, 'validation', localeString, item.name) : getWidgetWithoutBadge('gold', 'validation', localeString,type, item.name)}
                   </div>
                   <div class="col-3 pl-0">
                   ${item.validate[3] && item.validate[3].grade == 'Platinum' ? getWidgetWithBadge(`/img/${type}_platinum_medal_val.svg`, 'platinum', type, 'validation', localeString, item.name) : getWidgetWithoutBadge('platinum', 'validation', localeString,type, item.name)}
                   </div>
               </div>
             </div>` : `<div class="col-lg-5 col-md-5 col-12 mt-3 mt-lg-0 mt-md-0 p-0 p-lg-3 p-md-3">
             <div class="row mx-0 mb-2 d-lg-none">
             <h6 class="text-custom-muted font-weight-normal font-family-Rowdies"> Validation </h6>
             </div>
             <div class="row m-0">
               <div class="col-3 pl-0">
               ${getWidgetWithoutBadge('bronze', 'validation', localeString,type, item.name)}
               </div>
               <div class="col-3 pl-0">
                   ${getWidgetWithoutBadge('silver', 'validation', localeString,type,item.name)}
                 </div>
                 <div class="col-3 pl-0">
                   ${getWidgetWithoutBadge('gold', 'validation', localeString,type, item.name)}
                 </div>
                 <div class="col-3 pl-0">
                 ${getWidgetWithoutBadge('platinum', 'validation', localeString,type, item.name)}
                 </div>
             </div>
           </div>`}
              </div>
            </div>`;
      $tableRows.append(row);
    });
  } else {
    $(`#${type}-type`).addClass('d-none');
    const row = ` <div class="col-12 p-0">
    <div class="row mx-0 text-center mt-5">
      <h4 class="text-custom-muted w-100"> No badge earned for ${type} india</h4>
    </div>
    </div>
    `
    $tableRows.append(row);
  }
  $('.badge-widget').off('click').on('click', ($event) => {
    $('.badge-widget').removeClass('light-blue');
    const badgeId = $($event.currentTarget).attr('id');
    $(`#${badgeId}`).addClass('light-blue');
    var offset = $($event.currentTarget).offset();
    const image = $($event.currentTarget).find("img").attr('src');
    $("#badge-popover").find("img").attr('src', image);
    $('#badge-popover').css({top:offset.top - 180, left:isMobileDevice() ? offset.left+ 60: offset.left - 200, visibility: 'visible'});
  });
  $(document).on('click', (event) => {
    if (!$(event.target).closest(".badge-widget").length) {
      $('.badge-widget').removeClass('light-blue');
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
  return new Promise((resolve, reject) => {
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
      .then((res) => res.json())
      .then((result) => {
        let mappedData = [];
        let initiativekeys = ['text', 'ocr', 'parallel', 'asr'];
        if (result && result.length) {
          $('#suno-type').removeClass('d-none');
          $('#bolo-type').removeClass('d-none');
          $('#likho-type').removeClass('d-none');
          $('#dekho-type').removeClass('d-none');
          let groupByInitiative = groupBy(result, 'type');
          initiativekeys.forEach(initiativekey => {
            if (groupByInitiative && groupByInitiative[initiativekey]) {
              let initiativeByData = groupByInitiative[initiativekey];
              let groupByLanguage = groupBy(initiativeByData, 'language');
              let langaugeKeys = Object.keys(groupByLanguage);
              let langaugeArray = [];
              langaugeKeys.forEach(elem => {
                let result = groupByLanguage[elem];
                const contribution = result.filter(initiativekey => initiativekey.category == 'contribute').sort((a, b) => Number(a.milestone) < Number(b.milestone) ? -1 : 1);;
                const validate = result.filter(initiativekey => initiativekey.category == 'validate').sort((a, b) => Number(a.milestone) < Number(b.milestone) ? -1 : 1);
                let languageObj = {
                  name: elem,
                  contribute: contribution,
                  validate: validate
                }
                langaugeArray.push(languageObj);
              });
              bindData(initiativekey, langaugeArray, mappedData)
            } else {
           
              bindData(initiativekey, [], mappedData);
            }
          });
        }  else {
          $('#suno-type').addClass('d-none');
          $('#bolo-type').addClass('d-none');
          $('#likho-type').addClass('d-none');
          $('#dekho-type').addClass('d-none');
          initiativekeys.forEach(initiativekey => {
              bindData(initiativekey, [], mappedData);
          });
        }
          mappedData.forEach(element => {
            const id = element.initiativeType == 'text' ? 'bolo-badge' : element.initiativeType == 'ocr' ? 'dekho-badge' : element.initiativeType == 'asr' ? 'suno-badge' : 'likho-badge';
            const type = element.initiativeType == 'text' ? 'bolo' : element.initiativeType == 'ocr' ? 'dekho' : element.initiativeType == 'asr' ? 'suno' : 'likho';
            const localeString =  JSON.parse(localStorage.getItem(LOCALE_STRINGS));
            getBadgeRow(element, id, type, localeString);
          });
          resolve(result);
      });
  })
}

$(document).ready(() => {
  const details = JSON.parse(localStorage.getItem("speakerDetails"));
  const username = details && details.userName ? details.userName: '';
  getLocaleString().then(() => {
    getBadgesForUser(username);
  }).catch(() => {
    window.location.href = "/";
  });
  let moduleType = localStorage.getItem("module");
  if(hasUserRegistered()){
    const speakerDetails = localStorage.getItem(SPEAKER_DETAILS_KEY);
    const localSpeakerDataParsed = JSON.parse(speakerDetails);
    showUserProfile(localSpeakerDataParsed.userName);
  } else {
    showUserProfile('');
  }
  onChangeUser('./my-badges.html', moduleType);
  onOpenUserDropDown();
  const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || 'english';
  updateLocaleLanguagesDropdown(language);
});

module.exports = {getBadgesForUser, getBadgeRow};