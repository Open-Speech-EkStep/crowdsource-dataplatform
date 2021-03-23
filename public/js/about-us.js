!function e(t,n,a){function o(i,c){if(!n[i]){if(!t[i]){var l="function"==typeof require&&require;if(!c&&l)return l(i,!0);if(r)return r(i,!0);throw new Error("Cannot find module '"+i+"'")}var u=n[i]={exports:{}};t[i][0].call(u.exports,function(e){var n=t[i][1][e];return o(n||e)},u,u.exports,e,t,n,a)}return n[i].exports}for(var r="function"==typeof require&&require,i=0;i<a.length;i++)o(a[i]);return o}({1:[function(e,t,n){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!1,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!1,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!1,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!1,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!1,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!1,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!1,data:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(e,t,n){"use strict";var a=e("./speakerDetails"),o=a.testUserName,r=a.setSpeakerDetails,i=a.setStartRecordBtnToolTipContent,c=a.setUserModalOnShown,l=a.setUserNameOnInputFocus,u=a.setGenderRadioButtonOnClick,s=(a.setStartRecordingBtnOnClick,e("./constants")),d=s.DEFAULT_CON_LANGUAGE,g=s.ALL_LANGUAGES,f=e("./utils").updateLocaleLanguagesDropdown;$(document).ready(function(){var e,t=$("#proceed-box"),n=t.parent(),a=document.querySelectorAll('input[name = "gender"]'),s=document.getElementById("age"),m=document.getElementById("mother-tongue"),h=$("#username"),v=d,p=localStorage.getItem("contributionLanguage");p&&f(p),$('input[name = "gender"]').on("change",function(){var e=document.querySelector('input[name = "gender"]:checked'),t=$("#transgender_options");"others"===e.value?t.removeClass("d-none"):t.addClass("d-none")}),n.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto"}),r("speakerDetails",s,m,h),u(),$("#languageTop").on("change",function(t){e=t.target.value,$("#start_recording").removeAttr("disabled")}),$("#start_recording").on("click",function(){v=e,document.cookie="i18n=en"}),i(h.val().trim(),n),l(),t.on("click",function(){var e=Array.from(a).filter(function(e){return e.checked}),t=e.length?e[0].value:"",n=h.val().trim().substring(0,12);if(g.find(function(e){return e.value===v}).data||(v=d),!o(n)){var r=document.querySelectorAll('input[name = "trans_gender"]');if("others"===t){var i=Array.from(r).filter(function(e){return e.checked});t=i.length?i[0].value:""}var c={gender:t,age:s.value,motherTongue:m.value,userName:n,language:v||localStorage.getItem("contributionLanguage")};localStorage.setItem("speakerDetails",JSON.stringify(c)),localStorage.setItem("contributionLanguage",v),location.href="/record"}}),c(h)})},{"./constants":1,"./speakerDetails":4,"./utils":5}],3:[function(e,t,n){"use strict";var a=e("./utils").updateLocaleLanguagesDropdown,o=e("./constants").ALL_LANGUAGES,r=function(e){var t=location.href.split("/"),n=t[t.length-1];i("i18n",e,1),location.href="/".concat(e,"/").concat(n)};function i(e,t,n){var a=new Date;a.setTime(a.getTime()+24*n*60*60*1e3);var o="expires="+a.toGMTString();document.cookie=e+"="+t+";"+o+";path=/"}function c(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),a=0;a<n.length;a++){for(var o=n[a];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))return o.substring(t.length,o.length)}return""}t.exports={checkCookie:function(){return""!=c("i18n")},getCookie:c,setCookie:i,changeLocale:r,showLanguagePopup:function(){document.getElementById("toggle-content-language").click()},redirectToLocalisedPage:function(){var e=c("i18n"),t=location.href.split("/"),n=t[t.length-2];if($("#home-page").attr("default-lang",e),n!=e)r(e);else{var i=o.find(function(t){return t.id===e});i&&a(i.value)}}}},{"./constants":1,"./utils":5}],4:[function(e,t,n){"use strict";var a=e("./constants"),o=a.DEFAULT_CON_LANGUAGE,r=a.CONTRIBUTION_LANGUAGE,i=a.ALL_LANGUAGES;function c(e,t){var n=e.val().trim();u(n)?(e.addClass("is-invalid"),t.removeClass("d-none")):(e.removeClass("is-invalid"),t.addClass("d-none"))}function l(){var e=document.getElementById("age"),t=document.getElementById("mother-tongue"),n=document.getElementById("username"),a=document.querySelector('input[name = "gender"]:checked');a&&(a.checked=!1),e.selectedIndex=0,t.selectedIndex=0,n.value=""}var u=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};function s(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))}t.exports={testUserName:u,validateUserName:c,setSpeakerDetails:function(e,t,n,a){var o=localStorage.getItem(e);if(o){var r=JSON.parse(o),i=document.querySelector('input[name = "gender"][value="'+r.gender+'"]');if(["male","female"].indexOf(r.gender)>-1)i&&(i.checked=!0,i.previous=!0);else if(""!==r.gender){var l=document.querySelector('input[name = "gender"][value="others"]');l&&(l.checked=!0,l.previous=!0);var u=document.querySelector('input[name = "trans_gender"][value="'+r.gender+'"]');u&&($("#transgender_options").removeClass("d-none"),u.checked=!0,u.previous=!0)}t.value=r.age,n.value=r.motherTongue,a.val(r.userName?r.userName.trim().substring(0,12):""),c(a,a.next())}},resetSpeakerDetails:l,setUserNameTooltip:s,setStartRecordBtnToolTipContent:function(e,t){u(e)&&t.attr("data-original-title","Please validate any error message before proceeding")},setUserModalOnShown:function(e){$("#userModal").on("shown.bs.modal",function(){$("#resetBtn").on("click",l),e.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto",trigger:"focus"}),s(e)})},setUserNameOnInputFocus:function(){var e=$("#username"),t=e.next();e.on("input focus",function(){c(e,t),s(e)})},setGenderRadioButtonOnClick:function(){document.querySelectorAll('input[name = "gender"]').forEach(function(e){e.addEventListener("click",function(e){e.target.previous&&(e.target.checked=!1),e.target.previous=e.target.checked})})},setStartRecordingBtnOnClick:function(){var e=$("#proceed-box"),t=document.querySelectorAll('input[name = "gender"]'),n=document.querySelectorAll('input[name = "trans_gender"]'),a=$("#username"),c=document.getElementById("age"),l=document.getElementById("mother-tongue");e.on("click",function(){var e=Array.from(t).filter(function(e){return e.checked}),s=e.length?e[0].value:"";if("others"===s){var d=Array.from(n).filter(function(e){return e.checked});s=d.length?d[0].value:""}var g=a.val().trim().substring(0,12),f=localStorage.getItem(r);if(i.find(function(e){return e.value===f}).data||(f=o),!u(g)){var m={gender:s,age:c.value,motherTongue:l.value,userName:g,language:f};localStorage.setItem("speakerDetails",JSON.stringify(m)),localStorage.setItem(r,f),location.href="/record"}})}}},{"./constants":1}],5:[function(e,t,n){"use strict";var a=e("./constants"),o=a.HOUR_IN_SECONDS,r=a.SIXTY,i=a.ALL_LANGUAGES,c=e("./locale").getCookie;var l=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),n=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",n+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){var e=localStorage.getItem("state_region")||"NOT_PRESENT",t=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==e&&"NOT_PRESENT"!==t&&e.length>0&&t.length>0?new Promise(function(n){n({regionName:e,country:t})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),n="";for(var a in t)if(t[a].startsWith("ip=")){n=t[a].replace("ip=","");break}return 0!==n.length?fetch("/location-info?ip=".concat(n)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),n=i.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===n.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(n.value,' class="dropdown-item" href="/changeLocale/').concat(n.id,'">').concat(n.text,"</a>"))},calculateTime:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=Math.floor(e/o),a=e%o,i=Math.floor(a/r),c=Math.round(a%r);return t?{hours:n,minutes:i,seconds:c}:{hours:n,minutes:i}},formatTime:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,a="";return e>0&&(a+="".concat(e," hrs ")),t>0&&(a+="".concat(t," min ")),0===e&&0===t&&n>0&&(a+="".concat(n," sec ")),a.substr(0,a.length-1)},getLocaleString:function(){return new Promise(function(e,t){var n=c("i18n");l("/get-locale-strings/".concat(n)).then(function(t){localStorage.setItem("localeString",JSON.stringify(t)),e(t)})})},performAPIRequest:l,showElement:function(e){e.removeClass("d-none")},hideElement:function(e){e.addClass("d-none")},setFooterPosition:function(){var e=$("#page-content").outerHeight();$("body").outerHeight()<=e+$("nav").outerHeight()+$("footer").outerHeight()&&$("footer").removeClass("fixed-bottom").addClass("bottom")}}},{"./constants":1,"./locale":3}]},{},[2]);