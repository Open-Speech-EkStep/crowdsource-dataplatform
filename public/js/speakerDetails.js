!function e(t,a,n){function r(i,u){if(!a[i]){if(!t[i]){var l="function"==typeof require&&require;if(!u&&l)return l(i,!0);if(o)return o(i,!0);throw new Error("Cannot find module '"+i+"'")}var s=a[i]={exports:{}};t[i][0].call(s.exports,function(e){var a=t[i][1][e];return r(a||e)},s,s.exports,e,t,a,n)}return a[i].exports}for(var o="function"==typeof require&&require,i=0;i<n.length;i++)r(n[i]);return r}({1:[function(e,t,a){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!1,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!1,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!1,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!1,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!1,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!1,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!1,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!1,data:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage"}},{}],2:[function(e,t,a){"use strict";var n=e("./constants"),r=n.DEFAULT_CON_LANGUAGE,o=n.CONTRIBUTION_LANGUAGE,i=n.ALL_LANGUAGES;function u(e,t){var a=e.val().trim();s(a)?(e.addClass("is-invalid"),t.removeClass("d-none")):(e.removeClass("is-invalid"),t.addClass("d-none"))}function l(){var e=document.getElementById("age"),t=document.getElementById("mother-tongue"),a=document.getElementById("username"),n=document.querySelector('input[name = "gender"]:checked');n&&(n.checked=!1),e.selectedIndex=0,t.selectedIndex=0,a.value=""}var s=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};function c(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))}t.exports={testUserName:s,validateUserName:u,setSpeakerDetails:function(e,t,a,n){var r=localStorage.getItem(e);if(r){var o=JSON.parse(r),i=document.querySelector('input[name = "gender"][value="'+o.gender+'"]');if(["male","female"].indexOf(o.gender)>-1)i&&(i.checked=!0,i.previous=!0);else if(""!==o.gender){var l=document.querySelector('input[name = "gender"][value="others"]');l&&(l.checked=!0,l.previous=!0);var s=document.querySelector('input[name = "trans_gender"][value="'+o.gender+'"]');s&&($("#transgender_options").removeClass("d-none"),s.checked=!0,s.previous=!0)}t.value=o.age,a.value=o.motherTongue,n.val(o.userName?o.userName.trim().substring(0,12):""),u(n,n.next())}},resetSpeakerDetails:l,setUserNameTooltip:c,setStartRecordBtnToolTipContent:function(e,t){s(e)&&t.attr("data-original-title","Please validate any error message before proceeding")},setUserModalOnShown:function(e){$("#userModal").on("shown.bs.modal",function(){$("#resetBtn").on("click",l),e.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto",trigger:"focus"}),c(e)})},setUserNameOnInputFocus:function(){var e=$("#username"),t=e.next();e.on("input focus",function(){u(e,t),c(e)})},setGenderRadioButtonOnClick:function(){document.querySelectorAll('input[name = "gender"]').forEach(function(e){e.addEventListener("click",function(e){e.target.previous&&(e.target.checked=!1),e.target.previous=e.target.checked})})},setStartRecordingBtnOnClick:function(){var e=$("#proceed-box"),t=document.querySelectorAll('input[name = "gender"]'),a=document.querySelectorAll('input[name = "trans_gender"]'),n=$("#username"),u=document.getElementById("age"),l=document.getElementById("mother-tongue");e.on("click",function(){var e=Array.from(t).filter(function(e){return e.checked}),c=e.length?e[0].value:"";if("others"===c){var d=Array.from(a).filter(function(e){return e.checked});c=d.length?d[0].value:""}var g=n.val().trim().substring(0,12),m=localStorage.getItem(o);if(i.find(function(e){return e.value===m}).data||(m=r),!s(g)){var v={gender:c,age:u.value,motherTongue:l.value,userName:g,language:m};localStorage.setItem("speakerDetails",JSON.stringify(v)),localStorage.setItem(o,m),location.href="/record"}})}}},{"./constants":1}]},{},[2]);