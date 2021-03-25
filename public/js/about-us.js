!function e(t,n,o){function a(i,c){if(!n[i]){if(!t[i]){var u="function"==typeof require&&require;if(!c&&u)return u(i,!0);if(r)return r(i,!0);throw new Error("Cannot find module '"+i+"'")}var l=n[i]={exports:{}};t[i][0].call(l.exports,function(e){var n=t[i][1][e];return a(n||e)},l,l.exports,e,t,n,o)}return n[i].exports}for(var r="function"==typeof require&&require,i=0;i<o.length;i++)a(o[i]);return a}({1:[function(e,t,n){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!1,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!0,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!0,data:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(e,t,n){"use strict";var o=e("./speakerDetails"),a=o.testUserName,r=o.setSpeakerDetails,i=o.setStartRecordBtnToolTipContent,c=o.setUserModalOnShown,u=o.setUserNameOnInputFocus,l=o.setGenderRadioButtonOnClick,s=(o.setStartRecordingBtnOnClick,e("./constants")),d=s.DEFAULT_CON_LANGUAGE,g=s.ALL_LANGUAGES,f=e("./utils").updateLocaleLanguagesDropdown;$(document).ready(function(){var e,t=$("#proceed-box"),n=t.parent(),o=document.querySelectorAll('input[name = "gender"]'),s=document.getElementById("age"),m=document.getElementById("mother-tongue"),h=$("#username"),v=d,p=localStorage.getItem("contributionLanguage");p&&f(p),$('input[name = "gender"]').on("change",function(){var e=document.querySelector('input[name = "gender"]:checked'),t=$("#transgender_options");"others"===e.value?t.removeClass("d-none"):t.addClass("d-none")}),n.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto"}),r("speakerDetails",s,m,h),l(),$("#languageTop").on("change",function(t){e=t.target.value,$("#start_recording").removeAttr("disabled")}),$("#start_recording").on("click",function(){v=e,document.cookie="i18n=en"}),i(h.val().trim(),n),u(),t.on("click",function(){var e=Array.from(o).filter(function(e){return e.checked}),t=e.length?e[0].value:"",n=h.val().trim().substring(0,12);if(g.find(function(e){return e.value===v}).data||(v=d),!a(n)){var r=document.querySelectorAll('input[name = "trans_gender"]');if("others"===t){var i=Array.from(r).filter(function(e){return e.checked});t=i.length?i[0].value:""}var c={gender:t,age:s.value,motherTongue:m.value,userName:n,language:v||localStorage.getItem("contributionLanguage")};localStorage.setItem("speakerDetails",JSON.stringify(c)),localStorage.setItem("contributionLanguage",v),location.href="/record"}}),c(h)})},{"./constants":1,"./speakerDetails":4,"./utils":5}],3:[function(e,t,n){"use strict";var o=e("./utils").updateLocaleLanguagesDropdown,a=e("./constants").ALL_LANGUAGES,r=function(e){var t=location.href.split("/"),n=t[t.length-1];i("i18n",e,1),location.href="/".concat(e,"/").concat(n)};function i(e,t,n){var o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3);var a="expires="+o.toGMTString();document.cookie=e+"="+t+";"+a+";path=/"}function c(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var a=n[o];" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(t))return a.substring(t.length,a.length)}return""}t.exports={checkCookie:function(){return""!=c("i18n")},getCookie:c,setCookie:i,changeLocale:r,showLanguagePopup:function(){document.getElementById("toggle-content-language").click()},redirectToLocalisedPage:function(){var e=c("i18n"),t=location.href.split("/"),n=t[t.length-2];if($("#home-page").attr("default-lang",e),n!=e)r(e);else{var i=a.find(function(t){return t.id===e});i&&o(i.value)}}}},{"./constants":1,"./utils":5}],4:[function(e,t,n){"use strict";var o=e("./constants"),a=o.DEFAULT_CON_LANGUAGE,r=o.CONTRIBUTION_LANGUAGE,i=o.ALL_LANGUAGES;function c(e,t){var n=e.val().trim();l(n)?(e.addClass("is-invalid"),t.removeClass("d-none")):(e.removeClass("is-invalid"),t.addClass("d-none"))}function u(){var e=document.getElementById("age"),t=document.getElementById("mother-tongue"),n=document.getElementById("username"),o=document.querySelector('input[name = "gender"]:checked');o&&(o.checked=!1),e.selectedIndex=0,t.selectedIndex=0,n.value=""}var l=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};function s(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))}t.exports={testUserName:l,validateUserName:c,setSpeakerDetails:function(e,t,n,o){var a=localStorage.getItem(e);if(a){var r=JSON.parse(a),i=document.querySelector('input[name = "gender"][value="'+r.gender+'"]');if(["male","female"].indexOf(r.gender)>-1)i&&(i.checked=!0,i.previous=!0);else if(""!==r.gender){var u=document.querySelector('input[name = "gender"][value="others"]');u&&(u.checked=!0,u.previous=!0);var l=document.querySelector('input[name = "trans_gender"][value="'+r.gender+'"]');l&&($("#transgender_options").removeClass("d-none"),l.checked=!0,l.previous=!0)}t.value=r.age,n.value=r.motherTongue,o.val(r.userName?r.userName.trim().substring(0,12):""),c(o,o.next())}},resetSpeakerDetails:u,setUserNameTooltip:s,setStartRecordBtnToolTipContent:function(e,t){l(e)&&t.attr("data-original-title","Please validate any error message before proceeding")},setUserModalOnShown:function(e){$("#userModal").on("shown.bs.modal",function(){$("#resetBtn").on("click",u),e.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto",trigger:"focus"}),s(e)})},setUserNameOnInputFocus:function(){var e=$("#username"),t=e.next();e.on("input focus",function(){c(e,t),s(e)})},setGenderRadioButtonOnClick:function(){document.querySelectorAll('input[name = "gender"]').forEach(function(e){e.addEventListener("click",function(e){e.target.previous&&(e.target.checked=!1),e.target.previous=e.target.checked})})},setStartRecordingBtnOnClick:function(){var e=$("#proceed-box"),t=document.querySelectorAll('input[name = "gender"]'),n=document.querySelectorAll('input[name = "trans_gender"]'),o=$("#username"),c=document.getElementById("age"),u=document.getElementById("mother-tongue");e.on("click",function(){var e=Array.from(t).filter(function(e){return e.checked}),s=e.length?e[0].value:"";if("others"===s){var d=Array.from(n).filter(function(e){return e.checked});s=d.length?d[0].value:""}var g=o.val().trim().substring(0,12),f=localStorage.getItem(r);if(i.find(function(e){return e.value===f}).data||(f=a),!l(g)){var m={gender:s,age:c.value,motherTongue:u.value,userName:g,language:f};localStorage.setItem("speakerDetails",JSON.stringify(m)),localStorage.setItem(r,f),location.href="/record"}})}}},{"./constants":1}],5:[function(e,t,n){"use strict";var o=e("./constants"),a=o.HOUR_IN_SECONDS,r=o.SIXTY,i=o.ALL_LANGUAGES,c=e("./locale").getCookie;var u=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),n=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",n+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){var e=localStorage.getItem("state_region")||"NOT_PRESENT",t=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==e&&"NOT_PRESENT"!==t&&e.length>0&&t.length>0?new Promise(function(n){n({regionName:e,country:t})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),n="";for(var o in t)if(t[o].startsWith("ip=")){n=t[o].replace("ip=","");break}return 0!==n.length?fetch("/location-info?ip=".concat(n)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),n=i.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===n.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(n.value,' class="dropdown-item" href="/changeLocale/').concat(n.id,'">').concat(n.text,"</a>"))},calculateTime:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=Math.floor(e/a),o=e%a,i=Math.floor(o/r),c=Math.round(o%r);return t?{hours:n,minutes:i,seconds:c}:{hours:n,minutes:i}},formatTime:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o="";return e>0&&(o+="".concat(e," hrs ")),t>0&&(o+="".concat(t," min ")),0===e&&0===t&&n>0&&(o+="".concat(n," sec ")),o.substr(0,o.length-1)},getLocaleString:function(){return new Promise(function(e,t){var n=c("i18n");u("/get-locale-strings/".concat(n)).then(function(t){localStorage.setItem("localeString",JSON.stringify(t)),e(t)})})},performAPIRequest:u,showElement:function(e){e.removeClass("d-none")},hideElement:function(e){e.addClass("d-none")},setFooterPosition:function(){var e=$("#page-content").outerHeight();$("body").outerHeight()<=e+$("nav").outerHeight()+$("footer").outerHeight()&&$("footer").removeClass("fixed-bottom").addClass("bottom")},reportSentenceOrRecording:function(e){return new Promise(function(t,n){try{fetch("/report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then(function(e){return e.json()}).then(function(e){t(e)})}catch(e){n(e)}})}}},{"./constants":1,"./locale":3}]},{},[2]);