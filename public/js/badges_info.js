!function t(e,n,o){function a(r,c){if(!n[r]){if(!e[r]){var s="function"==typeof require&&require;if(!c&&s)return s(r,!0);if(i)return i(r,!0);throw new Error("Cannot find module '"+r+"'")}var l=n[r]={exports:{}};e[r][0].call(l.exports,function(t){var n=e[r][1][t];return a(n||t)},l,l.exports,t,e,n,o)}return n[r].exports}for(var i="function"==typeof require&&require,r=0;r<o.length;r++)a(o[r]);return a}({1:[function(t,e,n){"use strict";e.exports={DEFAULT_CON_LANGUAGE:"Hindi",AUDIO_DURATION:6,SIXTY:60,HOUR_IN_SECONDS:3600,ALL_LANGUAGES:[{value:"Assamese",id:"as",text:"অসমীয়া",hasLocaleText:!0,data:!0},{value:"Bengali",id:"bn",text:"বাংলা",hasLocaleText:!0,data:!0},{value:"English",id:"en",text:"English",hasLocaleText:!0,data:!0},{value:"Gujarati",id:"gu",text:"ગુજરાતી",hasLocaleText:!0,data:!0},{value:"Hindi",id:"hi",text:"हिंदी",hasLocaleText:!0,data:!0},{value:"Kannada",id:"kn",text:"ಕನ್ನಡ",hasLocaleText:!0,data:!0},{value:"Malayalam",id:"ml",text:"മലയാളം",hasLocaleText:!0,data:!0},{value:"Marathi",id:"mr",text:"मराठी",hasLocaleText:!0,data:!0},{value:"Odia",id:"or",text:"ଓଡିଆ",hasLocaleText:!0,data:!0},{value:"Punjabi",id:"pa",text:"ਪੰਜਾਬੀ",hasLocaleText:!0,data:!0},{value:"Tamil",id:"ta",text:"தமிழ்",hasLocaleText:!0,data:!0},{value:"Telugu",id:"te",text:"తెలుగు",hasLocaleText:!0,data:!0}],TOP_LANGUAGES_BY_HOURS:"topLanguagesByHours",TOP_LANGUAGES_BY_SPEAKERS:"topLanguagesBySpeakers",AGGREGATED_DATA_BY_LANGUAGE:"aggregateDataCountByLanguage",LOCALE_STRINGS:"localeString",CONTRIBUTION_LANGUAGE:"contributionLanguage",BADGES:{bronze:{imgLg:"/img/bronze_badge.svg",imgSm:"/img/bronze_contributor.jpeg"},silver:{imgLg:"/img/silver_badge.svg",imgSm:"/img/silver_contributor.jpeg"},gold:{imgLg:"/img/gold_badge.svg",imgSm:"/img/gold_contributor.jpeg"},platinum:{imgLg:"/img/platinum_badge.svg",imgSm:"/img/platinum_contributor.jpeg"}}}},{}],2:[function(t,e,n){"use strict";var o=t("./utils"),a=o.performAPIRequest,i=o.getLocaleString,r=o.updateLocaleLanguagesDropdown,c=t("./constants"),s=c.CONTRIBUTION_LANGUAGE,l=c.BADGES,u=c.LOCALE_STRINGS,g=function(t){var e=$("#table-rows"),n=$("#card-row"),o=JSON.parse(localStorage.getItem(u));t.forEach(function(t,a){var i,r=t.contributions,c=t.badge,s=a+1;if(c){var u=function(t,e){var n=l[t.toLowerCase()];return'<div class="col-12 col-lg-3 col-md-4 col-sm-6">\n            <div class="card row text-center m-2">\n                <div class="py-3">\n                    <img src='.concat(n.imgLg,' alt="bronze_badge">\n                </div>\n                <h3 class="py-3">').concat(e[t],"</h3>\n            </div>\n        </div>")}(c,o);n.append(u),i=function(t,e,n,o){var a=l[n.toLowerCase()];return"<tr><td>".concat(o.Level," ").concat(t,"</td><td>").concat(e," ").concat(o.Sentences,"</td><td><div><img src=").concat(a.imgLg,' class="table-img" alt=').concat(n,"></div><span>").concat(o[n],"</span></td></tr>")}(s,r,c,o)}else i=function(t,e,n){return"<tr><td>".concat(n.Level," ").concat(t,"</td><td>").concat(e," ").concat(n.Sentences,"</td><td>").concat(n["N/A"],"</td></tr>")}(s,r,o);e.append(i)})};$(document).ready(function(){var t=localStorage.getItem(s)||"english";t&&r(t),i().then(function(){a("/rewards-info?language=".concat(t)).then(g).catch(function(t){console.log(t)})}).catch(function(){window.location.href="/"})})},{"./constants":1,"./utils":4}],3:[function(t,e,n){"use strict";var o=t("./utils").updateLocaleLanguagesDropdown,a=t("./constants").ALL_LANGUAGES,i=function(t){var e=location.href.split("/"),n=e[e.length-1];r("i18n",t,1),location.href="/".concat(t,"/").concat(n)};function r(t,e,n){var o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3);var a="expires="+o.toGMTString();document.cookie=t+"="+e+";"+a+";path=/"}function c(t){for(var e=t+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var a=n[o];" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(e))return a.substring(e.length,a.length)}return""}e.exports={checkCookie:function(){return""!=c("i18n")},getCookie:c,setCookie:r,changeLocale:i,showLanguagePopup:function(){document.getElementById("toggle-content-language").click()},redirectToLocalisedPage:function(){var t=c("i18n"),e=location.href.split("/"),n=e[e.length-2];if($("#home-page").attr("default-lang",t),n!=t)i(t);else{var r=a.find(function(e){return e.id===t});r&&o(r.value)}}}},{"./constants":1,"./utils":4}],4:[function(t,e,n){"use strict";var o=t("./constants"),a=o.HOUR_IN_SECONDS,i=o.SIXTY,r=o.ALL_LANGUAGES,c=t("./locale").getCookie;var s=function(t){return fetch(t).then(function(t){if(t.ok)return Promise.resolve(t.json());throw Error(t.statusText||"HTTP error")})};e.exports={setPageContentHeight:function(){var t=$("footer"),e=$(".navbar"),n=100-(t.outerHeight()+e.outerHeight())*(100/document.documentElement.clientHeight);$("#content-wrapper").css("min-height",n+"vh")},toggleFooterPosition:function(){var t=$("footer");t.toggleClass("fixed-bottom"),t.toggleClass("bottom")},fetchLocationInfo:function(){var t=localStorage.getItem("state_region")||"NOT_PRESENT",e=localStorage.getItem("country")||"NOT_PRESENT";return"NOT_PRESENT"!==t&&"NOT_PRESENT"!==e&&t.length>0&&e.length>0?new Promise(function(n){n({regionName:t,country:e})}):fetch("https://www.cloudflare.com/cdn-cgi/trace").then(function(t){return t.text()}).then(function(t){var e=t.split("\n"),n="";for(var o in e)if(e[o].startsWith("ip=")){n=e[o].replace("ip=","");break}return 0!==n.length?fetch("/location-info?ip=".concat(n)):new Promise(function(t,e){e("Ip Address not available")})})},updateLocaleLanguagesDropdown:function(t){var e=$("#localisation_dropdown"),n=r.find(function(e){return e.value===t});"english"===t.toLowerCase()||!1===n.hasLocaleText?e.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>'):e.html('<a id="english" class="dropdown-item" href="/changeLocale/en">English</a>\n        <a id='.concat(n.value,' class="dropdown-item" href="/changeLocale/').concat(n.id,'">').concat(n.text,"</a>"))},calculateTime:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=Math.floor(t/a),o=t%a,r=Math.floor(o/i),c=Math.round(o%i);return e?{hours:n,minutes:r,seconds:c}:{hours:n,minutes:r}},formatTime:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o="";return t>0&&(o+="".concat(t," hrs ")),e>0&&(o+="".concat(e," min ")),0===t&&0===e&&n>0&&(o+="".concat(n," sec ")),o.substr(0,o.length-1)},getLocaleString:function(){return new Promise(function(t,e){var n=c("i18n");n||(document.cookie="i18n=en",n="en"),s("/get-locale-strings/".concat(n)).then(function(e){localStorage.setItem("localeString",JSON.stringify(e)),t(e)}).catch(function(t){return e(t)})})},performAPIRequest:s,showElement:function(t){t.removeClass("d-none")},hideElement:function(t){t.addClass("d-none")},setFooterPosition:function(){var t=$("#page-content").outerHeight();$("body").outerHeight()<=t+$("nav").outerHeight()+$("footer").outerHeight()&&$("footer").removeClass("fixed-bottom").addClass("bottom")},reportSentenceOrRecording:function(t){return new Promise(function(e,n){try{fetch("/report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then(function(t){return t.json()}).then(function(t){e(t)})}catch(t){n(t)}})}}},{"./constants":1,"./locale":3}]},{},[2]);