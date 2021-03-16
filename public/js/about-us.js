!function e(t,a,n){function o(i,l){if(!a[i]){if(!t[i]){var c="function"==typeof require&&require;if(!l&&c)return c(i,!0);if(r)return r(i,!0);throw new Error("Cannot find module '"+i+"'")}var s=a[i]={exports:{}};t[i][0].call(s.exports,function(e){var a=t[i][1][e];return o(a||e)},s,s.exports,e,t,a,n)}return a[i].exports}for(var r="function"==typeof require&&require,i=0;i<n.length;i++)o(n[i]);return o}({1:[function(e,t,a){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!0,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!0,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!0,data:!0},{value:"Dogri",id:"doi",text:"डोगरी",hasLocaleText:!0,data:!1},{value:"Maithili",id:"mai",text:"Maithili",hasLocaleText:!0,data:!1},{value:"Urdu",id:"ur",text:"اردو",hasLocaleText:!0,data:!1},{value:"Konkani Roman",id:"kr",text:"Konkani Roman",hasLocaleText:!0,data:!1},{value:"Konkani DV",id:"kd",text:"Konkani DV",hasLocaleText:!0,data:!1},{value:"Manipuri BN",id:"mnibn",text:"Manipuri BN",hasLocaleText:!1,data:!1},{value:"Manipuri MM",id:"mnimm",text:"Manipuri MM",hasLocaleText:!1,data:!1},{value:"Santali OL",id:"satol",text:"Santali OL",hasLocaleText:!1,data:!1},{value:"Santali DV",id:"satdv",text:"Santali DV",hasLocaleText:!1,data:!1},{value:"Sanskrit",id:"sa",text:"Sanskrit",hasLocaleText:!0,data:!1}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(e,t,a){"use strict";var n=e("./speakerDetails"),o=n.testUserName,r=n.setSpeakerDetails,i=n.setStartRecordBtnToolTipContent,l=n.setTNCOnChange,c=n.setUserModalOnShown,s=n.setUserNameOnInputFocus,u=n.setGenderRadioButtonOnClick,d=e("./constants"),g=d.DEFAULT_CON_LANGUAGE,h=d.ALL_LANGUAGES,m=e("./utils").updateLocaleLanguagesDropdown;$(document).ready(function(){var e,t=$("#proceed-box"),a=t.parent(),n=document.querySelectorAll('input[name = "gender"]'),d=document.getElementById("age"),f=document.getElementById("mother-tongue"),v=$("#username"),p=$("#tnc"),L=g,T=localStorage.getItem("contributionLanguage");T&&m(T),p.prop("checked",!1),a.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto"}),r("speakerDetails",d,f,v),u(),$("#languageTop").on("change",function(t){e=t.target.value,$("#start_recording").removeAttr("disabled")}),$("#start_recording").on("click",function(){L=e}),i(v.val().trim(),a),l(v,a),s(),t.on("click",function(){if(p.prop("checked")){var e=Array.from(n).filter(function(e){return e.checked}),t=e.length?e[0].value:"",a=v.val().trim().substring(0,12);if(h.find(function(e){return e.value===L}).data||(L=g),o(a))return;var r={gender:t,age:d.value,motherTongue:f.value,userName:a,language:L||localStorage.getItem("contributionLanguage")};localStorage.setItem("speakerDetails",JSON.stringify(r)),localStorage.setItem("contributionLanguage",L),location.href="/record"}}),c(v)})},{"./constants":1,"./speakerDetails":3,"./utils":4}],3:[function(e,t,a){"use strict";var n=e("./constants"),o=n.DEFAULT_CON_LANGUAGE,r=n.CONTRIBUTION_LANGUAGE,i=n.ALL_LANGUAGES;function l(e,t,a){var n=e.val().trim();s(n)?(e.addClass("is-invalid"),t.removeClass("d-none")):(e.removeClass("is-invalid"),t.addClass("d-none")),a.trigger("change")}function c(){var e=document.getElementById("age"),t=document.getElementById("mother-tongue"),a=document.getElementById("username"),n=document.querySelector('input[name = "gender"]:checked');n&&(n.checked=!1),e.selectedIndex=0,t.selectedIndex=0,a.value=""}var s=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};function u(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))}var d=function(e,t){s(e)?t.attr("data-original-title","Please validate any error message before proceeding"):t.attr("data-original-title","Please agree to the Terms and Conditions before proceeding")};t.exports={testUserName:s,validateUserName:l,setSpeakerDetails:function(e,t,a,n){var o=localStorage.getItem(e);if(o){var r=JSON.parse(o),i=document.querySelector('input[name = "gender"][value="'+r.gender+'"]');i&&(i.checked=!0,i.previous=!0),t.value=r.age,a.value=r.motherTongue,n.val(r.userName?r.userName.trim().substring(0,12):""),l(n,n.next(),$("#tnc"))}},resetSpeakerDetails:c,setUserNameTooltip:u,setStartRecordBtnToolTipContent:d,setTNCOnChange:function(e,t){var a=$("#tnc"),n=$("#proceed-box");a.change(function(){var a=e.val().trim();this.checked&&!s(a)?(n.removeAttr("disabled").removeClass("point-none"),t.tooltip("disable")):(d(a,t),n.prop("disabled","true").addClass("point-none"),t.tooltip("enable"))})},setUserModalOnShown:function(e){$("#userModal").on("shown.bs.modal",function(){$("#resetBtn").on("click",c),e.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto",trigger:"focus"}),u(e)})},setUserNameOnInputFocus:function(){var e=$("#username"),t=e.next(),a=$("#tnc");e.on("input focus",function(){l(e,t,a),u(e)})},setGenderRadioButtonOnClick:function(){document.querySelectorAll('input[name = "gender"]').forEach(function(e){e.addEventListener("click",function(e){e.target.previous&&(e.target.checked=!1),e.target.previous=e.target.checked})})},setStartRecordingBtnOnClick:function(e){var t=$("#proceed-box"),a=$("#tnc"),n=document.querySelectorAll('input[name = "gender"]'),l=$("#username"),c=document.getElementById("age"),u=document.getElementById("mother-tongue");t.on("click",function(){if(a.prop("checked")){var t=Array.from(n).filter(function(e){return e.checked}),d=t.length?t[0].value:"",g=l.val().trim().substring(0,12);if(console.log(e),i.find(function(t){return t.value===e}).data||(e=o),s(g))return;var h={gender:d,age:c.value,motherTongue:u.value,userName:g,language:e||localStorage.getItem(r)};localStorage.setItem("speakerDetails",JSON.stringify(h)),location.href="/record"}})}}},{"./constants":1}],4:[function(e,t,a){"use strict";var n=e("./constants"),o=n.HOUR_IN_SECONDS,r=n.SIXTY,i=n.ALL_LANGUAGES;var l=function(e){return fetch(e).then(function(e){if(e.ok)return Promise.resolve(e.json());throw Error(e.statusText||"HTTP error")})};t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),a=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",a+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){var e=localStorage.getItem("state_region")||"NOT_PRESENT",t=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==e&&"NOT_PRESENT"!==t&&e.length>0&&t.length>0?new Promise(function(a,n){a({regionName:e,country:t})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),a="";for(var n in t)if(t[n].startsWith("ip=")){a=t[n].replace("ip=","");break}return 0!==a.length?fetch("/location-info?ip=".concat(a)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),a=i.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===a.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(a.value,' class="dropdown-item" href="/changeLocale/').concat(a.id,'">').concat(a.text,"</a>"))},calculateTime:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=Math.floor(e/o),n=e%o,i=Math.floor(n/r),l=Math.round(n%r);return t?{hours:a,minutes:i,seconds:l}:{hours:a,minutes:i}},formatTime:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n="";return e>0&&(n+="".concat(e," hrs ")),t>0&&(n+="".concat(t," min ")),0===e&&0===t&&a>0&&(n+="".concat(a," sec ")),n.substr(0,n.length-1)},getLocaleString:function(){l("/get-locale-strings").then(function(e){localStorage.setItem("localeString",JSON.stringify(e))})},performAPIRequest:l,showElement:function(e){e.removeClass("d-none")},hideElement:function(e){e.addClass("d-none")}}},{"./constants":1}]},{},[2]);