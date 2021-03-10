!function e(t,a,n){function o(i,l){if(!a[i]){if(!t[i]){var c="function"==typeof require&&require;if(!l&&c)return c(i,!0);if(r)return r(i,!0);throw new Error("Cannot find module '"+i+"'")}var s=a[i]={exports:{}};t[i][0].call(s.exports,function(e){var a=t[i][1][e];return o(a||e)},s,s.exports,e,t,a,n)}return a[i].exports}for(var r="function"==typeof require&&require,i=0;i<n.length;i++)o(n[i]);return o}({1:[function(e,t,a){"use strict";t.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600}},{}],2:[function(e,t,a){"use strict";var n=e("./speakerDetails"),o=n.validateUserName,r=n.testUserName,i=n.setSpeakerDetails,l=n.resetSpeakerDetails,c=n.setUserNameTooltip,s=n.setStartRecordBtnToolTipContent,u=e("./constants").DEFAULT_CON_LANGUAGE,d=e("./utils").updateLocaleLanguagesDropdown;$(document).ready(function(){var e,t=$("#proceed-box"),a=t.parent(),n=document.querySelectorAll('input[name = "gender"]'),g=document.getElementById("age"),h=document.getElementById("mother-tongue"),m=$("#username"),p=m.next(),f=$("#tnc"),v=u,x=localStorage.getItem("contributionLanguage");d(x),f.prop("checked",!1),a.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto"}),i("speakerDetails",g,h,m),n.forEach(function(e){e.addEventListener("click",function(e){e.target.previous&&(e.target.checked=!1),e.target.previous=e.target.checked})}),$("#languageTop").on("change",function(t){e=t.target.value,$("#start_recording").removeAttr("disabled")}),$("#start_recording").on("click",function(){v=e}),s(m.val().trim(),a),f.change(function(){var e=m.val().trim();this.checked&&!r(e)?(t.removeAttr("disabled").removeClass("point-none"),a.tooltip("disable")):(s(e,a),t.prop("disabled","true").addClass("point-none"),a.tooltip("enable"))}),m.on("input focus",function(){o(m,p,f),c(m)}),t.on("click",function(){if(f.prop("checked")){var e=Array.from(n).filter(function(e){return e.checked}),t=e.length?e[0].value:"",a=m.val().trim().substring(0,12);if("English"===v&&(v=u),r(a))return;var o={gender:t,age:g.value,motherTongue:h.value,userName:a,language:v};localStorage.setItem("speakerDetails",JSON.stringify(o)),localStorage.setItem("contributionLanguage",v),location.href="/record"}}),$("#userModal").on("shown.bs.modal",function(){$("#resetBtn").on("click",l),m.tooltip({container:"body",placement:screen.availWidth>500?"right":"auto",trigger:"focus"}),c(m)})})},{"./constants":1,"./speakerDetails":3,"./utils":4}],3:[function(e,t,a){"use strict";function n(e,t,a){var n=e.val().trim();o(n)?(e.addClass("is-invalid"),t.removeClass("d-none")):(e.removeClass("is-invalid"),t.addClass("d-none")),a.trigger("change")}var o=function(e){return/^[6-9]\d{9}$/.test(e)||/^\S+@\S+[\.][0-9a-z]+$/.test(e)};t.exports={testUserName:o,validateUserName:n,setSpeakerDetails:function(e,t,a,o){var r=localStorage.getItem(e);if(r){var i=JSON.parse(r),l=document.querySelector('input[name = "gender"][value="'+i.gender+'"]');l&&(l.checked=!0,l.previous=!0),t.value=i.age,a.value=i.motherTongue,o.val(i.userName?i.userName.trim().substring(0,12):""),n(o,o.next(),$("#tnc"))}},resetSpeakerDetails:function(){var e=document.getElementById("age"),t=document.getElementById("mother-tongue"),a=document.getElementById("username"),n=document.querySelector('input[name = "gender"]:checked');n&&(n.checked=!1),e.selectedIndex=0,t.selectedIndex=0,a.value=""},setUserNameTooltip:function(e){e.val().length>11?(e.tooltip("enable"),e.tooltip("show")):(e.tooltip("disable"),e.tooltip("hide"))},setStartRecordBtnToolTipContent:function(e,t){o(e)?t.attr("data-original-title","Please validate any error message before proceeding"):t.attr("data-original-title","Please agree to the Terms and Conditions before proceeding")}}},{}],4:[function(e,t,a){"use strict";var n=[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0},{value:"Odia",id:"or",text:"ଘୃଣା",hasLocaleText:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!1},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!1}];t.exports={setPageContentHeight:function(){var e=$("footer"),t=$(".navbar"),a=100-(e.outerHeight()+t.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",a+"vh")},toggleFooterPosition:function(){var e=$("footer");e.toggleClass("fixed-bottom"),e.toggleClass("bottom")},fetchLocationInfo:function(){return fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(e){return e.text()}).then(function(e){var t=e.split("\n"),a="";for(var n in t)if(t[n].startsWith("ip=")){a=t[n].replace("ip=","");break}return 0!==a.length?fetch("/location-info?ip=".concat(a)):new Promise(function(e,t){t("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(e){var t=$("#localisation_dropdown"),a=n.find(function(t){return t.value===e});"english"===e.toLowerCase()||!1===a.hasLocaleText?t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):t.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(a.value,' class="dropdown-item" href="/changeLocale/').concat(a.id,'">').concat(a.text,"</a>"))}}},{}]},{},[2]);